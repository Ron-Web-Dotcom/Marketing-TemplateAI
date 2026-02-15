/*
  # Marketing Dashboard Schema
  
  Creates comprehensive schema for AI-powered marketing dashboard including:
  
  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `name` (text) - Campaign name
      - `status` (text) - active, paused, completed
      - `budget` (numeric) - Campaign budget
      - `spent` (numeric) - Amount spent
      - `impressions` (bigint) - Total impressions
      - `clicks` (bigint) - Total clicks
      - `conversions` (bigint) - Total conversions
      - `revenue` (numeric) - Revenue generated
      - `start_date` (date) - Campaign start date
      - `end_date` (date) - Campaign end date
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `analytics_metrics`
      - `id` (uuid, primary key)
      - `date` (date) - Metric date
      - `page_views` (bigint) - Total page views
      - `unique_visitors` (bigint) - Unique visitors
      - `bounce_rate` (numeric) - Bounce rate percentage
      - `avg_session_duration` (numeric) - Average session duration in seconds
      - `conversion_rate` (numeric) - Conversion rate percentage
      - `revenue` (numeric) - Daily revenue
      - `created_at` (timestamptz)
    
    - `ai_insights`
      - `id` (uuid, primary key)
      - `type` (text) - insight, recommendation, alert
      - `category` (text) - performance, seo, content, campaign
      - `title` (text) - Insight title
      - `description` (text) - Detailed description
      - `impact` (text) - high, medium, low
      - `status` (text) - new, viewed, actioned
      - `created_at` (timestamptz)
    
    - `content_performance`
      - `id` (uuid, primary key)
      - `title` (text) - Content title
      - `url` (text) - Content URL
      - `views` (bigint) - Total views
      - `engagement_rate` (numeric) - Engagement rate percentage
      - `avg_time_on_page` (numeric) - Average time on page in seconds
      - `conversions` (bigint) - Conversions from this content
      - `date` (date) - Performance date
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users to manage all data
    
  3. Sample Data
    - Insert sample campaigns, analytics, insights, and content performance data
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  budget numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  conversions bigint NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics_metrics table
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  page_views bigint NOT NULL DEFAULT 0,
  unique_visitors bigint NOT NULL DEFAULT 0,
  bounce_rate numeric NOT NULL DEFAULT 0,
  avg_session_duration numeric NOT NULL DEFAULT 0,
  conversion_rate numeric NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date)
);

-- Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'insight',
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  impact text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create content_performance table
CREATE TABLE IF NOT EXISTS content_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  views bigint NOT NULL DEFAULT 0,
  engagement_rate numeric NOT NULL DEFAULT 0,
  avg_time_on_page numeric NOT NULL DEFAULT 0,
  conversions bigint NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON analytics_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view insights"
  ON ai_insights FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update insights"
  ON ai_insights FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view content performance"
  ON content_performance FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample campaigns
INSERT INTO campaigns (name, status, budget, spent, impressions, clicks, conversions, revenue, start_date, end_date)
VALUES 
  ('Summer Product Launch', 'active', 50000, 32400, 1250000, 45600, 3420, 125680, '2024-06-01', '2024-08-31'),
  ('Black Friday Sale', 'active', 100000, 78200, 2800000, 125400, 8950, 445230, '2024-11-15', '2024-12-05'),
  ('Brand Awareness Q1', 'completed', 35000, 34800, 980000, 32100, 1240, 52100, '2024-01-01', '2024-03-31'),
  ('Email Campaign - Newsletter', 'active', 15000, 8900, 450000, 18200, 980, 38400, '2024-01-01', NULL),
  ('Social Media Boost', 'paused', 25000, 12300, 560000, 22400, 890, 28900, '2024-03-15', NULL)
ON CONFLICT DO NOTHING;

-- Insert sample analytics for the last 30 days
INSERT INTO analytics_metrics (date, page_views, unique_visitors, bounce_rate, avg_session_duration, conversion_rate, revenue)
SELECT 
  (CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29))::date,
  (50000 + random() * 30000)::bigint,
  (25000 + random() * 15000)::bigint,
  (35 + random() * 20)::numeric(5,2),
  (180 + random() * 120)::numeric(10,2),
  (2.5 + random() * 3)::numeric(5,2),
  (15000 + random() * 25000)::numeric(10,2)
FROM generate_series(0, 29)
ON CONFLICT (date) DO NOTHING;

-- Insert sample AI insights
INSERT INTO ai_insights (type, category, title, description, impact, status)
VALUES 
  ('recommendation', 'performance', 'Optimize Ad Spend for Campaign #2', 'Our AI detected that your Black Friday Sale campaign is performing 34% above target. Consider increasing budget allocation by $15,000 to maximize ROI during peak conversion hours (2-6 PM EST).', 'high', 'new'),
  ('insight', 'seo', 'Content Gap Opportunity Detected', 'Analysis shows high search volume for "workflow automation tools comparison" with low competition. Creating content around this topic could drive an estimated 2,500+ monthly organic visits.', 'high', 'new'),
  ('alert', 'campaign', 'Declining CTR on Social Campaign', 'The Social Media Boost campaign CTR has dropped 23% in the last 7 days. Ad creative refresh recommended. Similar campaigns saw 45% improvement after creative updates.', 'medium', 'viewed'),
  ('recommendation', 'content', 'Best Performing Content Patterns', 'Blog posts with "How to" in titles generate 3x more conversions than other formats. Recommend increasing production of tutorial-style content from 2 to 5 posts per week.', 'medium', 'new'),
  ('insight', 'performance', 'Peak Conversion Time Identified', 'Users converting at highest rates between 2-4 PM EST (18% conversion rate vs 4% average). Recommend scheduling email campaigns and retargeting ads during this window.', 'high', 'actioned'),
  ('recommendation', 'seo', 'Technical SEO Quick Wins', 'AI analysis found 12 pages with slow load times (>3s). Optimizing images and enabling compression could improve rankings for 8 high-value keywords and increase organic traffic by 15%.', 'medium', 'new')
ON CONFLICT DO NOTHING;

-- Insert sample content performance
INSERT INTO content_performance (title, url, views, engagement_rate, avg_time_on_page, conversions, date)
VALUES 
  ('Complete Guide to Workflow Automation', '/blog/workflow-automation-guide', 45200, 68.5, 385, 420, CURRENT_DATE - 5),
  ('Top 10 Productivity Tips for 2024', '/blog/productivity-tips-2024', 32100, 52.3, 245, 180, CURRENT_DATE - 8),
  ('How to Choose the Right SaaS Tool', '/blog/choose-saas-tool', 28900, 71.2, 420, 340, CURRENT_DATE - 3),
  ('Customer Success Stories', '/customers', 18700, 45.8, 180, 125, CURRENT_DATE - 12),
  ('Pricing Plans Comparison', '/pricing', 56300, 82.4, 290, 890, CURRENT_DATE - 1),
  ('Integration Marketplace', '/integrations', 21400, 38.9, 165, 78, CURRENT_DATE - 7)
ON CONFLICT DO NOTHING;