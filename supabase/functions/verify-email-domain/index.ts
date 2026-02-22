/**
 * @fileoverview Supabase Edge Function — Email domain verification.
 *
 * **Endpoint**: `POST /functions/v1/verify-email-domain`
 *
 * **Request body** (JSON):
 * | Field  | Type   | Description                    |
 * |--------|--------|--------------------------------|
 * | domain | string | Email domain to verify         |
 *
 * **Response** (JSON):
 * | Field   | Type   | Description                         |
 * |---------|--------|-------------------------------------|
 * | isValid | bool   | Whether the domain passed checks    |
 * | reason  | string | Human-readable explanation          |
 *
 * **Validation pipeline**:
 * 1. IP-based rate limiting (5 requests / 60 s per IP).
 * 2. Blocklist check against known disposable email providers.
 * 3. DNS MX + A record lookup via Google Public DNS API.
 *
 * **Error codes**: 400 (missing domain), 429 (rate limited), 500 (DNS failure).
 *
 * @module supabase/functions/verify-email-domain
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/** CORS headers applied to every response (including preflight). */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  domain: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `email-verify:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    rateLimitMap.set(key, newEntry);

    if (rateLimitMap.size > 10000) {
      const keysToDelete: string[] = [];
      rateLimitMap.forEach((value, k) => {
        if (now > value.resetTime) {
          keysToDelete.push(k);
        }
      });
      keysToDelete.forEach(k => rateLimitMap.delete(k));
    }

    return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: newEntry.resetTime };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetTime: entry.resetTime };
}

async function checkDNSRecords(domain: string): Promise<boolean> {
  try {
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const dnsData = await dnsResponse.json();

    if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
      return true;
    }

    const aResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const aData = await aResponse.json();

    if (aData.Status === 0 && aData.Answer && aData.Answer.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const rateLimitKey = getRateLimitKey(req);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          isValid: false,
          error: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    const { domain }: RequestBody = await req.json();

    if (!domain || typeof domain !== 'string') {
      return new Response(
        JSON.stringify({
          isValid: false,
          error: 'Domain is required'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const normalizedDomain = domain.toLowerCase().trim();

    const knownFakeDomains = [
      'test.com', 'example.com', 'fake.com', 'dummy.com', 'sample.com',
      'temp.com', 'temporary.com', 'fakeemail.com', 'notreal.com',
      'mailinator.com', 'guerrillamail.com', 'throwaway.email',
      '10minutemail.com', 'tempmail.com', 'disposable.com'
    ];

    if (knownFakeDomains.includes(normalizedDomain)) {
      return new Response(
        JSON.stringify({
          isValid: false,
          reason: 'Known fake or disposable domain'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const hasValidDNS = await checkDNSRecords(normalizedDomain);

    return new Response(
      JSON.stringify({
        isValid: hasValidDNS,
        reason: hasValidDNS ? 'Valid domain' : 'No DNS records found for domain'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        isValid: false,
        error: 'Failed to verify domain'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
