/**
 * @fileoverview Supabase client initialisation and shared TypeScript interfaces.
 *
 * Initialises the singleton Supabase client using validated environment
 * variables and exports TypeScript interfaces that mirror the database
 * table schemas for type-safe queries throughout the application.
 *
 * @module lib/supabase
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getEnvVars, isSupabaseConfigured } from '../utils/env';

const env = getEnvVars();

/**
 * `true` when valid Supabase credentials are present.
 * Components should check this before making Supabase calls.
 */
export const supabaseEnabled = isSupabaseConfigured();

/**
 * Singleton Supabase client used for all database, auth, and storage
 * operations.  When env vars are missing a dummy client is created that
 * will fail gracefully instead of crashing on import.
 */
export const supabase: SupabaseClient = createClient(
  env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
);

/* ------------------------------------------------------------------ */
/*  Database Table Interfaces                                          */
/* ------------------------------------------------------------------ */

/** A marketing campaign row from the `campaigns` table. */
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

/** A daily analytics snapshot from the `analytics_metrics` table. */
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

/** An AI-generated insight from the `ai_insights` table. */
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

/** A content performance row from the `content_performance` table. */
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
