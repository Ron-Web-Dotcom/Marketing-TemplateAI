import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from '../utils/env';

const env = getEnvVars();

export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsMetric {
  id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  revenue: number;
  created_at: string;
}

export interface AIInsight {
  id: string;
  type: 'insight' | 'recommendation' | 'alert';
  category: 'performance' | 'seo' | 'content' | 'campaign';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'new' | 'viewed' | 'actioned';
  created_at: string;
}

export interface ContentPerformance {
  id: string;
  title: string;
  url: string;
  views: number;
  engagement_rate: number;
  avg_time_on_page: number;
  conversions: number;
  date: string;
  created_at: string;
}
