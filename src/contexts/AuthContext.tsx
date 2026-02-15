import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { createTrialSubscription, getUserSubscription, checkTrialStatus, UserSubscription } from '../utils/subscription';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscription: UserSubscription | null;
  trialStatus: { isExpired: boolean; daysRemaining: number; isActive: boolean };
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [trialStatus, setTrialStatus] = useState({ isExpired: true, daysRemaining: 0, isActive: false });

  const loadSubscription = async (userId: string) => {
    const sub = await getUserSubscription(userId);
    setSubscription(sub);
    const status = checkTrialStatus(sub);
    setTrialStatus(status);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscription(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadSubscription(session.user.id);
        }
        setLoading(false);
      })();
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const refreshSubscription = async () => {
    if (user) {
      await loadSubscription(user.id);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      await createTrialSubscription(data.user.id);
      await loadSubscription(data.user.id);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, subscription, trialStatus, signUp, signIn, signOut, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
