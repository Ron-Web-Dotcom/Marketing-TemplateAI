/**
 * @fileoverview Environment variable validation and access.
 *
 * Provides a single function, {@link getEnvVars}, that reads and validates
 * all required Vite environment variables at runtime.  If any variable is
 * missing or blank the function throws immediately, making configuration
 * errors easy to diagnose during development.
 *
 * @module utils/env
 */

/** Expected shape of the validated environment variables. */
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

/**
 * Read a single environment variable, returning an empty string if missing.
 *
 * @param value - The raw value from `import.meta.env`.
 * @returns The trimmed string value, or `""` when undefined.
 */
function readEnvVar(value: string | undefined): string {
  return value?.trim() ?? '';
}

/**
 * Retrieve all Supabase environment variables.
 * Returns empty strings when variables are not set — callers must
 * guard against blank values before making network requests.
 *
 * @returns An object containing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
 */
export function getEnvVars(): ImportMetaEnv {
  return {
    VITE_SUPABASE_URL: readEnvVar(import.meta.env.VITE_SUPABASE_URL),
    VITE_SUPABASE_ANON_KEY: readEnvVar(import.meta.env.VITE_SUPABASE_ANON_KEY),
  };
}

/**
 * Returns `true` when both Supabase env vars are configured.
 */
export function isSupabaseConfigured(): boolean {
  const env = getEnvVars();
  return env.VITE_SUPABASE_URL !== '' && env.VITE_SUPABASE_ANON_KEY !== '';
}
