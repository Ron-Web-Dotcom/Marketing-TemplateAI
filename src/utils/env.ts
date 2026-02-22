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
 * Validate that a single environment variable is defined and non-empty.
 *
 * @param name  - Human-readable name of the variable (for error messages).
 * @param value - The raw value from `import.meta.env`.
 * @returns The validated, trimmed string value.
 * @throws {Error} When the value is undefined or blank.
 */
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
  return value;
}

/**
 * Retrieve and validate all required environment variables.
 *
 * @returns An object containing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
 * @throws {Error} If any required variable is missing.
 */
export function getEnvVars(): ImportMetaEnv {
  return {
    VITE_SUPABASE_URL: validateEnvVar(
      'VITE_SUPABASE_URL',
      import.meta.env.VITE_SUPABASE_URL
    ),
    VITE_SUPABASE_ANON_KEY: validateEnvVar(
      'VITE_SUPABASE_ANON_KEY',
      import.meta.env.VITE_SUPABASE_ANON_KEY
    ),
  };
}
