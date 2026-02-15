import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  domain: string;
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
    console.error('DNS check error:', error);
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
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
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
