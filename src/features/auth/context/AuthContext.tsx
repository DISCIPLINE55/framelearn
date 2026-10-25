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
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus | null>(null);

  const configured = isSupabaseConfigured();
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!configured) {
      setProfile(null);
      setRole(null);
      setProfileError(null);
      return null;
    }

    setIsProfileLoading(true);
    setProfileError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[FrameLearn Auth] Could not fetch profile from database:', error.message);
        setProfile(null);
        setRole(null);
        setProfileError(error.message);
        return null;
      }

      const userProfile = data as Profile | null;

      if (userProfile) {
        setProfile(userProfile);
        // Authoritative role originates strictly from database record
        setRole(userProfile.role);
        setProfileError(null);
        return userProfile;
      }

      // Missing profile: NEVER fallback to 'admin' or user_metadata
      setProfile(null);
      setRole(null);
      setProfileError('No profile record found in the database for this user.');
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error fetching profile.';
      console.warn('[FrameLearn Auth] Unexpected error fetching profile:', err);
      setProfile(null);
      setRole(null);
      setProfileError(msg);
      return null;
    } finally {
      setIsProfileLoading(false);
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
          if (data?.session?.user) {
            setSession(data.session);
            setUser(data.session.user);
            await fetchProfile(data.session.user.id);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole(null);
            setProfileError(null);
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
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setProfileError(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
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
        const userProfile = await fetchProfile(data.user.id);

        if (userProfile && userProfile.role === 'admin') {
          toast.success(`Authenticated as ${data.user.email}. Welcome back.`, {
            title: 'Photographer Access Verified',
          });
        } else if (userProfile) {
          toast.warning(
            `Authenticated as ${data.user.email}, but this account does not possess administrator privileges.`,
            {
              title: 'Access Restricted',
            }
          );
        } else {
          toast.error(
            `Authenticated as ${data.user.email}, but no verified administrator profile was found in the database.`,
            {
              title: 'Profile Verification Failed',
            }
          );
        }
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
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('[FrameLearn Auth] Sign out error:', error.message);
          toast.error(`Sign out failed: ${error.message}`, {
            title: 'Sign Out Error',
          });
          return;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during sign out.';
        console.warn('[FrameLearn Auth] Sign out exception:', err);
        toast.error(errorMsg, {
          title: 'Sign Out Error',
        });
        return;
      }
    }

    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setProfileError(null);
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
    isProfileLoading,
    profileError,
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
      isProfileLoading: false,
      profileError: null,
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
