import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../../config/env';
import { Database } from '../../types/database';

export interface SupabaseConnectionStatus {
  configured: boolean;
  connected: boolean;
  message: string;
  error?: string;
  url?: string;
}

/**
 * Single source of truth Supabase client instance.
 * Strongly typed against our PostgreSQL database schema.
 */
const supabaseUrl = isSupabaseConfigured()
  ? env.supabase.url
  : 'https://framelearn-unconfigured.supabase.co';

const supabaseAnonKey = isSupabaseConfigured()
  ? env.supabase.anonKey
  : 'unconfigured-anon-key';

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Actively probes connection to Supabase backend.
 * Never claims success unless an actual response is received.
 */
export const checkSupabaseConnection = async (): Promise<SupabaseConnectionStatus> => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      message:
        'Supabase backend credentials are not configured. Safe local foundation mode is active.',
    };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return {
        configured: true,
        connected: false,
        url: env.supabase.url,
        message: 'Supabase project responded with an authentication service error.',
        error: error.message,
      };
    }

    return {
      configured: true,
      connected: true,
      url: env.supabase.url,
      message: 'Supabase backend connection verified successfully.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      url: env.supabase.url,
      message: 'Network request to Supabase endpoint failed.',
      error: message,
    };
  }
};

export { isSupabaseConfigured };
