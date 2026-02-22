/**
 * @fileoverview Authentication context and provider.
 *
 * Manages Supabase authentication state (email/password + OAuth) and the
 * user's subscription / trial status.  Exposes the {@link useAuth} hook so
 * any component in the tree can read the current user, sign in/out, or
 * check subscription details.
 *
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseEnabled } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  createTrialSubscription,
  getUserSubscription,
  checkTrialStatus,
  UserSubscription,
} from '../utils/subscription';

/** Shape of the authentication context exposed to consumers. */
interface AuthContextType {
  /** Currently authenticated Supabase user, or `null`. */
  user: User | null;
  /** `true` while the initial session is being restored. */
  loading: boolean;
  /** Active subscription record from `user_subscriptions`. */
  subscription: UserSubscription | null;
  /** Derived trial status — expiry, remaining days, active flag. */
  trialStatus: { isExpired: boolean; daysRemaining: number; isActive: boolean };
  /** Create a new account with email + password. */
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  /** Sign in with email + password. */
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  /** Initiate Google OAuth flow. */
  signInWithGoogle: () => Promise<{ error: any }>;
  /** Initiate Apple OAuth flow. */
  signInWithApple: () => Promise<{ error: any }>;
  /** Sign the current user out and clear local state. */
  signOut: () => Promise<void>;
  /** Re-fetch the subscription from the database. */
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication and subscription state to the component tree.
 *
 * On mount it restores the existing Supabase session and subscribes to
 * `onAuthStateChange` so sign-in / sign-out events are reflected
 * automatically.  New users receive a 14-day trial subscription.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [trialStatus, setTrialStatus] = useState({
    isExpired: true,
    daysRemaining: 0,
    isActive: false,
  });

  /**
   * Fetch (and optionally create) the subscription for a given user.
   *
   * @param userId  - Supabase auth user id.
   * @param isNewUser - When `true`, creates a trial row if none exists.
   */
  const loadSubscription = async (userId: string, isNewUser: boolean = false) => {
    let sub = await getUserSubscription(userId);

    if (!sub && isNewUser) {
      await createTrialSubscription(userId);
      sub = await getUserSubscription(userId);
    }

    setSubscription(sub);
    const status = checkTrialStatus(sub);
    setTrialStatus(status);
  };

  /* Restore session on mount and subscribe to auth state changes. */
  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscription(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        /* Detect first-time sign-in by comparing created/updated timestamps. */
        const isNewUser =
          event === 'SIGNED_IN' &&
          session.user.created_at === session.user.updated_at;
        await loadSubscription(session.user.id, isNewUser);
      }
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  /** Re-fetch the current user's subscription from the database. */
  const refreshSubscription = async () => {
    if (user) {
      await loadSubscription(user.id);
    }
  };

  /**
   * Create a new account and provision a 14-day trial subscription.
   *
   * @returns An object containing a possible Supabase error.
   */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (!error && data.user) {
      setUser(data.user);
      await createTrialSubscription(data.user.id);
      await loadSubscription(data.user.id);
    }

    return { error };
  };

  /**
   * Sign in with email and password.
   *
   * @returns An object containing a possible Supabase error.
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      setUser(data.user);
    }

    return { error };
  };

  /**
   * Redirect the user to Google's OAuth consent screen.
   * On success the browser is sent back to `/dashboard`.
   */
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  /**
   * Redirect the user to Apple's OAuth consent screen.
   * On success the browser is sent back to `/dashboard`.
   */
  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  /** Sign the user out and reset all local state. */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        subscription,
        trialStatus,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook that returns the current authentication context.
 *
 * @throws {Error} If called outside of an {@link AuthProvider}.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
