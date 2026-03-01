/**
 * @fileoverview Enterprise upgrade / checkout page.
 *
 * Displays the Enterprise plan feature list, pricing ($299/mo), and a
 * "Proceed to Secure Checkout" button that:
 * 1. Calls the `create-checkout` Supabase Edge Function.
 * 2. Receives a Stripe Checkout Session URL.
 * 3. Redirects the browser to Stripe's hosted checkout.
 *
 * On success, Stripe redirects back to `/dashboard?payment=success`.
 * On cancellation, the user is sent to `/upgrade?payment=canceled`.
 *
 * @module pages/Upgrade
 */

import React, { useState } from 'react';
import { Check, Sparkles, ArrowLeft, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { getEnvVars } from '../utils/env';

export const Upgrade: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const env = getEnvVars();
      const response = await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-card rounded-3xl shadow-elegant border p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 shadow-glow">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              NeuralFlow Pro
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Unlock the full power of AI-driven sales automation and enterprise-grade CRM features.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
              <span className="text-5xl font-bold text-primary">$299</span>
              <span className="text-muted-foreground font-medium">/month</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8 py-8 border-y border-border/50">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Unlimited CRM Leads</p>
                <p className="text-xs text-muted-foreground">No caps on your growth</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Advanced AI Assistant</p>
                <p className="text-xs text-muted-foreground">Deep deal risk analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Team Collaboration</p>
                <p className="text-xs text-muted-foreground">Unlimited team members</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Priority Support</p>
                <p className="text-xs text-muted-foreground">24/7 technical assistance</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-elegant flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={20} />
                Upgrade to NeuralFlow Pro
                <Zap size={20} className="fill-current" />
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span>Stripe Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Check size={12} />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
