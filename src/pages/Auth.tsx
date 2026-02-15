import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signIn, signInWithGoogle, signInWithApple } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        (window as any).navigate?.('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setOauthLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google OAuth error:', error);
        if (error.message?.includes('OAuth')) {
          setError('Google sign-in is not configured. Please contact support.');
        } else {
          setError(error.message || 'Failed to sign in with Google');
        }
        setOauthLoading(false);
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setOauthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setOauthLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        console.error('Apple OAuth error:', error);
        if (error.message?.includes('OAuth')) {
          setError('Apple sign-in is not configured. Please contact support.');
        } else {
          setError(error.message || 'Failed to sign in with Apple');
        }
        setOauthLoading(false);
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      setError('Failed to sign in with Apple. Please try again.');
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => (window as any).navigate?.('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp
                ? 'Start your free trial today'
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder={isSignUp ? 'Minimum 6 characters' : 'Enter your password'}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                <p className="text-red-600 font-medium">{error}</p>
                {error.includes('not configured') && (
                  <p className="text-gray-600 mt-1">
                    See <span className="font-mono text-xs">OAUTH_QUICKSTART.md</span> for setup instructions
                  </p>
                )}
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
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={oauthLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={oauthLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isSignUp ? (
                <>
                  Already have an account? <span className="font-semibold">Sign In</span>
                </>
              ) : (
                <>
                  Don't have an account? <span className="font-semibold">Sign Up</span>
                </>
              )}
            </button>
          </div>

          {isSignUp && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                Start your 14-day free trial with no credit card required.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
