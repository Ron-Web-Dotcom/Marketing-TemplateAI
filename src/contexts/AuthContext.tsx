/**
 * @fileoverview Authentication context and provider.
 *
 * Manages Blink SDK authentication state and the
 * user's organization. Exposes the {@link useAuth} hook so
 * any component in the tree can read the current user, sign in/out, or
 * manage their organization.
 *
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { blink, Organization } from '../lib/blink';
import { BlinkUser } from '@blinkdotnew/sdk';

/** Shape of the authentication context exposed to consumers. */
interface AuthContextType {
  /** Currently authenticated Blink user, or `null`. */
  user: BlinkUser | null;
  /** `true` while the initial session is being restored. */
  loading: boolean;
  /** Active organization for the current user. */
  organization: Organization | null;
  /** Initiate managed login flow. */
  login: (redirectUrl?: string) => void;
  /** Sign the current user out and clear local state. */
  signOut: () => Promise<void>;
  /** Re-fetch organization from the database. */
  refreshOrganization: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication and organization state to the component tree.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BlinkUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  /**
   * Fetch (and optionally create) the organization for a given user.
   */
  const loadOrganization = async (userId: string) => {
    try {
      const orgs = await (blink.db as any).organizations.list({
        where: { ownerId: userId },
        limit: 1
      }) as Organization[];

      if (orgs.length > 0) {
        setOrganization(orgs[0]);
      } else {
        // Create a default organization for the new user
        const newOrg = await (blink.db as any).organizations.create({
          name: 'My Workspace',
          ownerId: userId
        }) as Organization;
        setOrganization(newOrg);
      }
    } catch (error) {
      console.error('Failed to load organization:', error);
    }
  };

  /* Restore session on mount and subscribe to auth state changes. */
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user);
      if (state.user) {
        await loadOrganization(state.user.id);
      } else {
        setOrganization(null);
      }
      setLoading(state.isLoading);
    });

    return unsubscribe;
  }, []);

  /** Re-fetch organization. */
  const refreshOrganization = async () => {
    if (user) {
      await loadOrganization(user.id);
    }
  };

  const login = (redirectUrl?: string) => {
    blink.auth.login(redirectUrl || window.location.href);
  };

  /** Sign the user out and reset all local state. */
  const signOut = async () => {
    await blink.auth.signOut();
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        organization,
        login,
        signOut,
        refreshOrganization,
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