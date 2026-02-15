import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Shield, Clock, ArrowLeft, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type PaymentMethod = 'card' | 'paypal' | 'google' | 'apple';

export const Upgrade: React.FC = () => {
  const { user, trialStatus, refreshSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            email,
            cardNumber,
            expiry,
            cvc,
            paymentMethod: 'card',
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          await refreshSubscription();
          (window as any).navigate?.('/dashboard');
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            email,
            paymentMethod,
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          await refreshSubscription();
          (window as any).navigate?.('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <button
          onClick={() => (window as any).navigate?.('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4">
                <Sparkles size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Upgrade to Enterprise
              </h1>
              {trialStatus.isExpired ? (
                <p className="text-red-600 font-medium">Your trial has expired. Upgrade to continue using the platform.</p>
              ) : (
                <p className="text-gray-600">
                  {trialStatus.daysRemaining} days remaining in your trial
                </p>
              )}
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Unlimited Campaigns</h3>
                  <p className="text-sm text-gray-600">Create and manage unlimited marketing campaigns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced AI Insights</h3>
                  <p className="text-sm text-gray-600">Get powerful AI-driven recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Priority Support</h3>
                  <p className="text-sm text-gray-600">24/7 dedicated support team</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Integrations</h3>
                  <p className="text-sm text-gray-600">Connect with your favorite tools</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">Billed monthly, cancel anytime</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <CreditCard size={24} className={paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-600'} />
                  <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Credit Card
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'paypal'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <svg className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-orange-600' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.28c2.743 0 4.65.588 5.671 1.746 1.088 1.233 1.423 2.967 1.024 5.3-.423 2.476-1.376 4.295-2.836 5.407-1.407 1.073-3.406 1.617-5.943 1.617H9.192a.77.77 0 0 0-.76.653l-.845 4.924a.643.643 0 0 1-.633.623z"/>
                  </svg>
                  <span className={`text-sm font-medium ${paymentMethod === 'paypal' ? 'text-orange-600' : 'text-gray-700'}`}>
                    PayPal
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'google'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <svg className={`w-6 h-6 ${paymentMethod === 'google' ? 'text-orange-600' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  <span className={`text-sm font-medium ${paymentMethod === 'google' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Google Pay
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'apple'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <Smartphone size={24} className={paymentMethod === 'apple' ? 'text-orange-600' : 'text-gray-600'} />
                  <span className={`text-sm font-medium ${paymentMethod === 'apple' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Apple Pay
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        required
                        maxLength={19}
                        className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setExpiry(value);
                          }}
                          required
                          maxLength={5}
                          className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <div className="relative">
                        <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                          required
                          maxLength={4}
                          className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 text-center">
                  <p className="text-gray-700 font-medium mb-2">
                    You will be redirected to {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'google' ? 'Google Pay' : 'Apple Pay'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Complete your payment securely on their platform
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield size={18} />
                    {paymentMethod === 'card' ? 'Upgrade Now - $299/month' : `Continue with ${paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'google' ? 'Google Pay' : 'Apple Pay'}`}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your payment is secured with industry-standard encryption. By upgrading, you agree to our Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
