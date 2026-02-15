/*
  # User Subscriptions and Trial System
  
  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trial_start_date` (timestamptz) - When trial started
      - `trial_end_date` (timestamptz) - When trial ends (14 days after start)
      - `subscription_status` (text) - trial, active, expired, cancelled
      - `plan_type` (text) - trial, enterprise
      - `stripe_customer_id` (text, nullable)
      - `stripe_subscription_id` (text, nullable)
      - `stripe_payment_method_id` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `user_subscriptions` table
    - Add policy for authenticated users to read their own subscription data
    - Add policy for authenticated users to update their own subscription data
  
  3. Important Notes
    - Trial period is automatically set to 14 days from signup
    - After trial expires, users must upgrade to Enterprise plan
    - Stripe integration for payment processing
*/

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  trial_start_date timestamptz DEFAULT now() NOT NULL,
  trial_end_date timestamptz DEFAULT (now() + interval '14 days') NOT NULL,
  subscription_status text DEFAULT 'trial' NOT NULL CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  plan_type text DEFAULT 'trial' NOT NULL CHECK (plan_type IN ('trial', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_method_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(subscription_status);
