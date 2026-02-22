/**
 * @fileoverview Subscription and trial management utilities.
 *
 * Contains CRUD helpers for the `user_subscriptions` table and pure
 * functions for computing trial expiry status.  Used by
 * {@link AuthContext} to surface subscription data throughout the app.
 *
 * @module utils/subscription
 */

import { supabase } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Row shape of the `user_subscriptions` database table. */
export interface UserSubscription {
  id: string;
  user_id: string;
  trial_start_date: string;
  trial_end_date: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  plan_type: 'trial' | 'enterprise';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_payment_method_id: string | null;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Database Operations                                                */
/* ------------------------------------------------------------------ */

/**
 * Insert a new 14-day trial subscription for a freshly registered user.
 *
 * @param userId - The Supabase auth user id.
 * @returns The newly created subscription row, or `null` on error.
 */
export const createTrialSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      trial_start_date: new Date().toISOString(),
      trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_status: 'trial',
      plan_type: 'trial',
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating trial subscription:', error);
    return null;
  }

  return data;
};

/**
 * Fetch the subscription record for a specific user.
 *
 * @param userId - The Supabase auth user id.
 * @returns The subscription row, or `null` if none exists.
 */
export const getUserSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
};

/* ------------------------------------------------------------------ */
/*  Trial Status Computation                                           */
/* ------------------------------------------------------------------ */

/**
 * Compute the trial / subscription status for display in the UI.
 *
 * If the trial has elapsed and the status is still `trial`, the row is
 * updated to `expired` as a side-effect.
 *
 * @param subscription - The user's subscription row (may be `null`).
 * @returns An object with `isExpired`, `daysRemaining`, and `isActive`.
 */
export const checkTrialStatus = (subscription: UserSubscription | null) => {
  if (!subscription) {
    return { isExpired: true, daysRemaining: 0, isActive: false };
  }

  /* Enterprise users with an active status never expire. */
  if (
    subscription.plan_type === 'enterprise' &&
    subscription.subscription_status === 'active'
  ) {
    return { isExpired: false, daysRemaining: Infinity, isActive: true };
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);
  const daysRemaining = Math.ceil(
    (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isExpired =
    subscription.subscription_status === 'expired' || daysRemaining <= 0;

  /* Side-effect: mark the row as expired when the trial window closes. */
  if (isExpired && subscription.subscription_status === 'trial') {
    updateSubscriptionStatus(subscription.user_id, 'expired');
  }

  return {
    isExpired,
    daysRemaining: Math.max(0, daysRemaining),
    isActive: subscription.subscription_status === 'active',
  };
};

/**
 * Update the `subscription_status` column for a given user.
 *
 * @param userId - The Supabase auth user id.
 * @param status - New status value.
 */
export const updateSubscriptionStatus = async (
  userId: string,
  status: 'trial' | 'active' | 'expired' | 'cancelled'
) => {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
};

/**
 * Upgrade a user's subscription to the Enterprise plan after successful
 * Stripe payment.
 *
 * @param userId                - Supabase auth user id.
 * @param stripeCustomerId      - Stripe customer id.
 * @param stripeSubscriptionId  - Stripe subscription id.
 * @param stripePaymentMethodId - Stripe payment method id.
 * @returns The updated subscription row, or `null` on failure.
 */
export const upgradeToEnterprise = async (
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePaymentMethodId: string
): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({
      plan_type: 'enterprise',
      subscription_status: 'active',
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_payment_method_id: stripePaymentMethodId,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error upgrading subscription:', error);
    return null;
  }

  return data;
};
