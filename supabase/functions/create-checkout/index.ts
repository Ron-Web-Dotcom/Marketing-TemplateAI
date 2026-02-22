/**
 * @fileoverview Supabase Edge Function — Stripe Checkout Session creator.
 *
 * **Endpoint**: `POST /functions/v1/create-checkout`
 *
 * **Request body** (JSON):
 * | Field   | Type   | Description              |
 * |---------|--------|--------------------------|
 * | userId  | string | Supabase auth user id    |
 * | email   | string | User's email address     |
 *
 * **Response** (JSON):
 * | Field        | Type   | Description                         |
 * |--------------|--------|-------------------------------------|
 * | success      | bool   | `true` on success                   |
 * | sessionId    | string | Stripe Checkout Session id          |
 * | checkoutUrl  | string | Redirect URL for Stripe Checkout    |
 *
 * **Flow**:
 * 1. Validates the `STRIPE_SECRET_KEY` environment variable.
 * 2. Creates (or reuses) a Stripe Customer with the user's email.
 * 3. Creates a Stripe Checkout Session for a $299/mo subscription.
 * 4. Returns the checkout URL so the frontend can redirect.
 *
 * **Error codes**: 400 (missing fields / Stripe error), 503 (no key).
 *
 * @module supabase/functions/create-checkout
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

/** CORS headers applied to every response (including preflight). */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  userId: string;
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({
          error: 'Payment processing is currently unavailable. Please contact support.'
        }),
        {
          status: 503,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { userId, email }: CheckoutRequest = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields'
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const createCustomerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,
        metadata: JSON.stringify({ userId }),
      }).toString(),
    });

    const customer = await createCustomerResponse.json();

    if (customer.error) {
      throw new Error(customer.error.message);
    }

    const appUrl = Deno.env.get('APP_URL') || req.headers.get('origin') || 'http://localhost:5173';

    const checkoutParams: Record<string, string> = {
      'success_url': `${appUrl}/dashboard?payment=success`,
      'cancel_url': `${appUrl}/upgrade?payment=canceled`,
      'customer': customer.id,
      'mode': 'subscription',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': 'Enterprise Plan',
      'line_items[0][price_data][product_data][description]': 'Full access to all features',
      'line_items[0][price_data][recurring][interval]': 'month',
      'line_items[0][price_data][unit_amount]': '29900',
      'line_items[0][quantity]': '1',
      'payment_method_types[0]': 'card',
      'client_reference_id': userId,
      'metadata[user_id]': userId,
    };

    const sessionResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(checkoutParams).toString(),
    });

    const session = await sessionResponse.json();

    if (session.error) {
      throw new Error(session.error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Payment processing failed. Please try again.'
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
});
