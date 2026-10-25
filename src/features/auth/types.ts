import { User, Session } from '@supabase/supabase-js';
import { Profile, ProfileRole } from '../../types/database';
import { SupabaseConnectionStatus } from '../../lib/database/supabase';

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: ProfileRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  isConfigured: boolean;
  connectionStatus: SupabaseConnectionStatus | null;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  testConnection: () => Promise<SupabaseConnectionStatus>;
}
