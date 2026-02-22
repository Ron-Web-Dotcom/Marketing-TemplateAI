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
  const { user, trialStatus } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Upgrade to Enterprise
            </h1>
            {trialStatus.isExpired ? (
              <p className="text-red-600 font-medium mb-2">Your trial has expired. Upgrade to continue using the platform.</p>
            ) : (
              <p className="text-gray-600 mb-2">
                {trialStatus.daysRemaining} days remaining in your trial
              </p>
            )}
            <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
              <span className="text-5xl font-bold text-orange-600">$299</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 py-8 border-y border-orange-100">
            <h3 className="font-semibold text-gray-900 mb-4">Everything you need to succeed:</h3>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Unlimited Campaigns</p>
                <p className="text-sm text-gray-600">Run as many marketing campaigns as you need</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Advanced AI Insights</p>
                <p className="text-sm text-gray-600">Get real-time recommendations powered by machine learning</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Priority Support</p>
                <p className="text-sm text-gray-600">24/7 dedicated support team at your service</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Custom Integrations</p>
                <p className="text-sm text-gray-600">Connect with all your favorite tools and platforms</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Advanced Analytics</p>
                <p className="text-sm text-gray-600">Deep dive into performance metrics and trends</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Team Collaboration</p>
                <p className="text-sm text-gray-600">Invite unlimited team members</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={20} />
                Proceed to Secure Checkout
                <Zap size={20} />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield size={14} />
                <span>Secure payment by Stripe</span>
              </div>
              <span>•</span>
              <span>Cancel anytime</span>
              <span>•</span>
              <span>PCI DSS Compliant</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              You'll be redirected to Stripe's secure checkout page to complete your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
