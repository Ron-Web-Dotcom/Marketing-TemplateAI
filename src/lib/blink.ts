import { createClient } from '@blinkdotnew/sdk';

/**
 * Blink SDK Client Initialization.
 * 
 * Provides centralized access to Auth, Database, Storage, and AI services.
 * Uses environment variables with hardcoded fallbacks for production stability.
 */

const PROJECT_ID = import.meta.env.VITE_BLINK_PROJECT_ID || 'neuralflow-ai-dashboard-1rjkqwij';
const PUBLISHABLE_KEY = import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_5YoB6YMIHX0DuphV8LFobOLHN_g1wQ8A';

export const blink = createClient({
  projectId: PROJECT_ID,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    mode: 'managed'
  }
});

/**
 * Types for the CRM Data Model.
 * 
 * Note: SQLite booleans are returned as "0"/"1" strings.
 */

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source?: string;
  score: number; // AI Lead Score
  orgId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expectedCloseDate?: string;
  leadId?: string;
  orgId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: string; // "0" or "1"
  relatedType?: 'lead' | 'deal' | 'contact';
  relatedId?: string;
  orgId: string;
  ownerId: string;
  createdAt: string;
}
