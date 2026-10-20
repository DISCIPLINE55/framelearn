import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, checkSupabaseConnection, SupabaseConnectionStatus } from '../../../lib/database/supabase';
import { Profile, ProfileRole } from '../../../types/database';
import { AuthState } from '../types';
import { useToast } from '../../../app/providers/ToastContext';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<ProfileRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus | null>(null);

  const configured = isSupabaseConfigured();
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string, userMetaRole?: string): Promise<Profile | null> => {
    if (!configured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[FrameLearn Auth] Could not fetch profile from database:', error.message);
      }

      const userProfile = data as Profile | null;

      if (userProfile) {
        setProfile(userProfile);
        setRole(userProfile.role);
        return userProfile;
      }

      // Fallback role assignment from user metadata if database row is initializing
      const fallbackRole = (userMetaRole as ProfileRole) || 'admin';
      setRole(fallbackRole);
      return null;
    } catch (err) {
      console.warn('[FrameLearn Auth] Unexpected error fetching profile:', err);
      return null;
    }
  }, [configured]);

  // Initial session restoration and auth listener
  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[FrameLearn Auth] getSession error:', error.message);
        }

        if (isMounted) {
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            await fetchProfile(data.session.user.id, data.session.user.user_metadata?.role);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.warn('[FrameLearn Auth] Initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.user_metadata?.role);
        } else {
          setProfile(null);
          setRole(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  const testConnection = useCallback(async (): Promise<SupabaseConnectionStatus> => {
    const status = await checkSupabaseConnection();
    setConnectionStatus(status);
    return status;
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!configured) {
      const errorMsg =
        'Supabase backend credentials are not configured in environment variables. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      toast.error(errorMsg, {
        title: 'Backend Configuration Missing',
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message, {
          title: 'Sign In Failed',
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, data.user.user_metadata?.role);
        toast.success(`Authenticated as ${data.user.email}. Welcome back.`, {
          title: 'Photographer Access Verified',
        });
      }

      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during authentication.';
      toast.error(errorMsg, {
        title: 'Authentication Error',
      });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[FrameLearn Auth] Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    toast.info('Your management session has been terminated securely.', {
      title: 'Photographer Signed Out',
    });
  };

  const isAdmin = role === 'admin';
  const isAuthenticated = !!user;

  const value: AuthState = {
    user,
    profile,
    session,
    role,
    isAdmin,
    isAuthenticated,
    isLoading,
    isConfigured: configured,
    connectionStatus,
    signInWithEmail,
    signOut,
    refreshProfile,
    testConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    // Safe fallback for isolated components or testing environments
    return {
      user: null,
      profile: null,
      session: null,
      role: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: false,
      isConfigured: false,
      connectionStatus: null,
      signInWithEmail: async () => ({ success: false, error: 'Auth context not available' }),
      signOut: async () => {},
      refreshProfile: async () => {},
      testConnection: async () => ({
        configured: false,
        connected: false,
        message: 'Auth context not available',
      }),
    };
  }
  return context;
};
