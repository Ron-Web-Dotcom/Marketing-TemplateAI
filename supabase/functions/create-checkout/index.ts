import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  userId: string;
  email: string;
  paymentMethod: 'card' | 'paypal' | 'google' | 'apple';
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
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
          error: 'Stripe is not configured. Please contact support at ront.devops@gmail.com'
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

    const { userId, email, paymentMethod: paymentType, cardNumber, expiry, cvc }: CheckoutRequest = await req.json();

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

    if (paymentType === 'card' && cardNumber && expiry && cvc) {
      const [expMonth, expYear] = expiry.split('/');
      const fullYear = `20${expYear}`;

      const createPaymentMethodResponse = await fetch('https://api.stripe.com/v1/payment_methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          type: 'card',
          'card[number]': cardNumber.replace(/\s/g, ''),
          'card[exp_month]': expMonth,
          'card[exp_year]': fullYear,
          'card[cvc]': cvc,
        }).toString(),
      });

      const paymentMethod = await createPaymentMethodResponse.json();

      if (paymentMethod.error) {
        throw new Error(paymentMethod.error.message);
      }

      await fetch(
        `https://api.stripe.com/v1/payment_methods/${paymentMethod.id}/attach`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            customer: customer.id,
          }).toString(),
        }
      );

      await fetch(`https://api.stripe.com/v1/customers/${customer.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          invoice_settings: JSON.stringify({ default_payment_method: paymentMethod.id }),
        }).toString(),
      });

      const createSubscriptionResponse = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          customer: customer.id,
          'items[0][price_data][currency]': 'usd',
          'items[0][price_data][product_data][name]': 'Enterprise Plan',
          'items[0][price_data][recurring][interval]': 'month',
          'items[0][price_data][unit_amount]': '29900',
        }).toString(),
      });

      const subscription = await createSubscriptionResponse.json();

      if (subscription.error) {
        throw new Error(subscription.error.message);
      }

      const { error: updateError } = await supabaseClient
        .from('user_subscriptions')
        .update({
          plan_type: 'enterprise',
          subscription_status: 'active',
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          stripe_payment_method_id: paymentMethod.id,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return new Response(
        JSON.stringify({
          success: true,
          subscriptionId: subscription.id
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else if (paymentType === 'paypal' || paymentType === 'google' || paymentType === 'apple') {
      const checkoutParams: Record<string, string> = {
        'success_url': `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-success?userId=${userId}`,
        'cancel_url': `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-cancel`,
        'customer': customer.id,
        'mode': 'subscription',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': 'Enterprise Plan',
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][price_data][unit_amount]': '29900',
        'line_items[0][quantity]': '1',
      };

      if (paymentType === 'paypal') {
        checkoutParams['payment_method_types[0]'] = 'paypal';
      } else if (paymentType === 'google') {
        checkoutParams['payment_method_types[0]'] = 'card';
        checkoutParams['payment_method_types[1]'] = 'google_pay';
      } else if (paymentType === 'apple') {
        checkoutParams['payment_method_types[0]'] = 'card';
        checkoutParams['payment_method_types[1]'] = 'apple_pay';
      }

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
          redirectUrl: session.url
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      throw new Error('Invalid payment method');
    }
  } catch (error: any) {
    console.error('Checkout error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Payment processing failed. Please try again.'
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
