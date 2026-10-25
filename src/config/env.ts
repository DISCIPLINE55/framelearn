export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'FrameLearn',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
} as const;

export const isSupabaseConfigured = (): boolean => {
  const url = (env.supabase.url || '').trim();
  const anonKey = (env.supabase.anonKey || '').trim();

  if (!url || !anonKey) return false;
  if (url.includes('your-supabase-project-id') || url.includes('placeholder-framelearn')) return false;
  if (anonKey.includes('your-supabase-anon-key') || anonKey.includes('placeholder-anon-key')) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateEnv = (): boolean => {
  if (!isSupabaseConfigured()) {
    console.warn(
      '[FrameLearn Configuration Notice]: Real Supabase credentials are not configured in environment variables. Safe local mode is active; live backend authentication and database operations will be withheld until valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided.'
    );
    return false;
  }
  return true;
};

