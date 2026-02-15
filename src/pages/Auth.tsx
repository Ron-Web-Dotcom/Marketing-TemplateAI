import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

type ViewMode = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

export const Auth: React.FC = () => {
  const { navigate } = useNavigation();
  const [viewMode, setViewMode] = useState<ViewMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { signUp, signIn, signInWithGoogle, signInWithApple } = useAuth();

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'Please enter a valid email address';

    const fakeDomains = [
      'test.com', 'example.com', 'fake.com', 'dummy.com', 'sample.com',
      'temp.com', 'temporary.com', 'fakeemail.com', 'notreal.com',
      'mailinator.com', 'guerrillamail.com', 'throwaway.email',
      '10minutemail.com', 'tempmail.com', 'disposable.com'
    ];

    if (fakeDomains.includes(domain)) {
      return 'Please use a real email address';
    }

    const tld = domain.split('.').pop();
    const validTLDs = [
      'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
      'co', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'in', 'br',
      'io', 'ai', 'app', 'dev', 'tech', 'online', 'store', 'shop',
      'us', 'info', 'biz', 'me', 'tv', 'cc'
    ];

    if (tld && !validTLDs.includes(tld)) {
      return 'Please use a valid email domain';
    }

    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 72) return 'Password must be less than 72 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    let confirmPasswordError = null;

    if (viewMode === 'signup') {
      confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    }

    if (emailError || passwordError || confirmPasswordError) {
      setValidationErrors({
        email: emailError || '',
        password: passwordError || '',
        confirmPassword: confirmPasswordError || '',
      });
      return;
    }

    setLoading(true);

    try {
      const domain = email.split('@')[1];
      const verifyResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email-domain`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.isValid) {
        setValidationErrors({
          email: 'This email domain does not appear to be valid. Please use a real email address.',
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
        return;
      }

      const { error } = viewMode === 'signup'
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        if (error.message?.includes('User already registered') ||
            error.message?.includes('already been registered') ||
            error.message?.includes('email already exists')) {
          setError('This email is already registered. Please sign in or use a different email.');
        } else if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message || 'An error occurred');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationErrors({ email: emailError });
      return;
    }

    setLoading(true);

    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        setError(error.message || 'Failed to send reset email');
      } else {
        setSuccess('Password reset email sent! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setOauthLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google OAuth error:', error);
        if (error.message?.includes('User already registered') ||
            error.message?.includes('email already exists')) {
          setError('This email is already registered with Google. Please sign in.');
        } else {
          setError('Google OAuth is not enabled in Supabase Dashboard. See OAUTH_ENABLE_NOW.md for 5-minute setup.');
        }
        setOauthLoading(false);
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError('Google OAuth is not enabled in Supabase Dashboard. See OAUTH_ENABLE_NOW.md for 5-minute setup.');
      setOauthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setSuccess('');
    setOauthLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        console.error('Apple OAuth error:', error);
        if (error.message?.includes('User already registered') ||
            error.message?.includes('email already exists')) {
          setError('This email is already registered with Apple. Please sign in.');
        } else {
          setError('Apple OAuth is not enabled in Supabase Dashboard. See OAUTH_ENABLE_NOW.md for 10-minute setup.');
        }
        setOauthLoading(false);
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      setError('Apple OAuth is not enabled in Supabase Dashboard. See OAUTH_ENABLE_NOW.md for 10-minute setup.');
      setOauthLoading(false);
    }
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'signup': return 'Create Account';
      case 'signin': return 'Welcome Back';
      case 'forgot-password': return 'Reset Password';
      case 'reset-password': return 'Set New Password';
    }
  };

  const getSubtitle = () => {
    switch (viewMode) {
      case 'signup': return 'Start your free trial today';
      case 'signin': return 'Sign in to access your dashboard';
      case 'forgot-password': return 'Enter your email to receive a reset link';
      case 'reset-password': return 'Enter the code from your email';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4">
              {viewMode === 'forgot-password' || viewMode === 'reset-password' ? (
                <KeyRound size={32} className="text-white" />
              ) : (
                <Sparkles size={32} className="text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              {getTitle()}
            </h1>
            <p className="text-gray-600">{getSubtitle()}</p>
          </div>

          {viewMode === 'forgot-password' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors({ ...validationErrors, email: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                      validationErrors.email ? 'bg-red-50' : 'bg-gray-50'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">{success}</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
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
                    Send Reset Link
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('signin');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors({ ...validationErrors, email: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                        validationErrors.email ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationErrors({ ...validationErrors, password: '' });
                      }}
                      minLength={8}
                      maxLength={72}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                        validationErrors.password ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                      placeholder={viewMode === 'signup' ? 'At least 8 chars, 1 uppercase, 1 number, 1 special char' : 'Enter your password'}
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                {viewMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setValidationErrors({ ...validationErrors, confirmPassword: '' });
                        }}
                        minLength={8}
                        maxLength={72}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                          validationErrors.confirmPassword ? 'bg-red-50' : 'bg-gray-50'
                        }`}
                        placeholder="Re-enter your password"
                      />
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {viewMode === 'signin' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('forgot-password');
                        setError('');
                      }}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">{success}</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-900 font-medium text-sm mb-2">{error}</p>
                    {error.includes('not enabled') && (
                      <div className="text-xs text-amber-800 space-y-1">
                        <p>Open the <span className="font-mono font-semibold">OAUTH_ENABLE_NOW.md</span> file for step-by-step instructions.</p>
                        <p>Or use Email/Password authentication (works immediately, no setup needed)</p>
                      </div>
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
                      {viewMode === 'signup' ? 'Create Account' : 'Sign In'}
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
                    setViewMode(viewMode === 'signup' ? 'signin' : 'signup');
                    setError('');
                    setSuccess('');
                    setValidationErrors({});
                    setConfirmPassword('');
                  }}
                  className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  {viewMode === 'signup' ? (
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

              {viewMode === 'signup' && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                    Start your 14-day free trial with no credit card required.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
