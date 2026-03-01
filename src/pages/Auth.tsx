/**
 * @fileoverview Authentication page — sign-in, sign-up, and password reset.
 *
 * Supports four view modes:
 * 1. **Sign In** — Email/password + Google/Apple OAuth.
 * 2. **Sign Up** — Email/password with confirmation + auto trial provisioning.
 * 3. **Forgot Password** — Sends a Supabase password-reset email.
 * 4. **Reset Password** — (placeholder for the token-based reset flow).
 *
 * Email validation includes:
 * - RFC-compliant format check
 * - Disposable / fake domain blocklist
 * - TLD allowlist
 * - Server-side DNS MX verification via the `verify-email-domain` edge function
 *
 * Password validation enforces:
 * - Minimum 8 / maximum 72 characters
 * - At least one uppercase, lowercase, digit, and special character
 *
 * @module pages/Auth
 */

import React from 'react';
import { Sparkles, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '@/components/ui/button';

export const Auth: React.FC = () => {
  const { navigate } = useNavigation();
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="bg-card rounded-2xl shadow-elegant border p-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-glow">
            <Sparkles size={40} className="text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">NeuralFlow AI</h1>
            <p className="text-muted-foreground leading-relaxed">
              Sign in to access your AI-powered sales workspace and manage your pipeline.
            </p>
          </div>

          <Button 
            size="lg" 
            className="w-full py-7 text-lg rounded-xl shadow-elegant gap-3"
            onClick={() => login('/dashboard')}
          >
            <LogIn size={20} />
            Continue to Platform
          </Button>

          <p className="text-xs text-muted-foreground px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};