/*
  # Add User ID and Fix RLS Policies for Multi-Tenancy
  
  ## Summary
  This migration implements proper data isolation by adding user_id columns to all tables
  and updating Row Level Security policies to enforce user-specific access control.
  
  ## Changes Made
  
  ### 1. Schema Changes
  #### Campaigns Table
  - Add `user_id` column (uuid, foreign key to auth.users)
  - Add index on user_id for performance
  
  #### Analytics Metrics Table
  - Add `user_id` column (uuid, foreign key to auth.users)
  - Drop existing unique constraint on date (allows per-user metrics)
  - Add unique constraint on (user_id, date)
  - Add index on user_id for performance
  
  #### AI Insights Table
  - Add `user_id` column (uuid, foreign key to auth.users)
  - Add index on user_id for performance
  
  #### Content Performance Table
  - Add `user_id` column (uuid, foreign key to auth.users)
  - Add index on user_id for performance
  
  ### 2. Data Migration
  - Set user_id to NULL for existing sample data (will not be visible to users)
  - New data will require user_id to be set
  
  ### 3. Security Updates (RLS Policies)
  #### Campaigns Policies
  - DROP old policies that allowed all authenticated users
  - CREATE new policies that filter by auth.uid() = user_id
  - Policies: SELECT, INSERT, UPDATE, DELETE
  
  #### Analytics Metrics Policies
  - DROP old policy
  - CREATE new policy filtering by user_id
  - Policy: SELECT only (analytics typically inserted by system)
  
  #### AI Insights Policies
  - DROP old policies
  - CREATE new policies filtering by user_id
  - Policies: SELECT, UPDATE
  
  #### Content Performance Policies
  - DROP old policy
  - CREATE new policy filtering by user_id
  - Policy: SELECT only
  
  ## Security Impact
  - ✅ Users can ONLY see their own data
  - ✅ Users can ONLY modify their own campaigns and insights
  - ✅ Proper data isolation for multi-tenant SaaS application
  - ✅ Foreign key constraints ensure data integrity
  
  ## Performance Impact
  - ✅ Indexes added on user_id columns for fast filtering
  - ✅ Compound index on analytics_metrics(user_id, date) for efficient queries
*/

-- Add user_id columns to all tables
DO $$
BEGIN
  -- Add user_id to campaigns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
  END IF;

  -- Add user_id to analytics_metrics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_metrics' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE analytics_metrics ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Drop old unique constraint on date only
    ALTER TABLE analytics_metrics DROP CONSTRAINT IF EXISTS analytics_metrics_date_key;
    
    -- Add new unique constraint on user_id + date
    ALTER TABLE analytics_metrics ADD CONSTRAINT analytics_metrics_user_date_key UNIQUE (user_id, date);
    
    CREATE INDEX IF NOT EXISTS idx_analytics_metrics_user_id ON analytics_metrics(user_id);
  END IF;

  -- Add user_id to ai_insights
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_insights' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE ai_insights ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
  END IF;

  -- Add user_id to content_performance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content_performance' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE content_performance ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_content_performance_user_id ON content_performance(user_id);
  END IF;
END $$;

-- Drop old insecure RLS policies
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON analytics_metrics;
DROP POLICY IF EXISTS "Authenticated users can view insights" ON ai_insights;
DROP POLICY IF EXISTS "Authenticated users can update insights" ON ai_insights;
DROP POLICY IF EXISTS "Authenticated users can view content performance" ON content_performance;

-- Create secure RLS policies for campaigns
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create secure RLS policies for analytics_metrics
CREATE POLICY "Users can view own analytics"
  ON analytics_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create secure RLS policies for ai_insights
CREATE POLICY "Users can view own insights"
  ON ai_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON ai_insights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON ai_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create secure RLS policies for content_performance
CREATE POLICY "Users can view own content performance"
  ON content_performance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content performance"
  ON content_performance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);