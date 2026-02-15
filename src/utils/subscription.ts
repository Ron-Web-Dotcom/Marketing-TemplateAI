import { supabase } from '../lib/supabase';

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

export const createTrialSubscription = async (userId: string) => {
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

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
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

export const checkTrialStatus = (subscription: UserSubscription | null) => {
  if (!subscription) {
    return { isExpired: true, daysRemaining: 0, isActive: false };
  }

  if (subscription.plan_type === 'enterprise' && subscription.subscription_status === 'active') {
    return { isExpired: false, daysRemaining: Infinity, isActive: true };
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isExpired = subscription.subscription_status === 'expired' || daysRemaining <= 0;

  if (isExpired && subscription.subscription_status === 'trial') {
    updateSubscriptionStatus(subscription.user_id, 'expired');
  }

  return {
    isExpired,
    daysRemaining: Math.max(0, daysRemaining),
    isActive: subscription.subscription_status === 'active',
  };
};

export const updateSubscriptionStatus = async (userId: string, status: 'trial' | 'active' | 'expired' | 'cancelled') => {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ subscription_status: status, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
};

export const upgradeToEnterprise = async (
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePaymentMethodId: string
) => {
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
