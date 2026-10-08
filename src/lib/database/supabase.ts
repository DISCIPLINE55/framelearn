import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

/**
 * Isolated Supabase Client Foundation.
 * Note: Database tables will be connected in future approved feature milestones.
 * In Milestone 001, this client provides the single-source-of-truth initialization pattern.
 */
const supabaseUrl = env.supabase.url || 'https://placeholder-framelearn.supabase.co';
const supabaseAnonKey = env.supabase.anonKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
