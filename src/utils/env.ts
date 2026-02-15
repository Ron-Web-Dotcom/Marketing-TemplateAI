interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
  return value;
}

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
