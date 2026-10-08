export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'FrameLearn',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
} as const;

export const validateEnv = (): boolean => {
  if (!env.supabase.url || !env.supabase.anonKey) {
    console.warn(
      '[FrameLearn Configuration Notice]: Supabase environment variables are missing in .env. Foundation mode active for Milestone 001.'
    );
    return false;
  }
  return true;
};
