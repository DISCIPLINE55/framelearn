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
      const errorMsg = 'The studio authentication service is currently unavailable. Please try again later.';
      toast.error(errorMsg, {
        title: 'Service Unavailable',
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
        let displayError = error.message;
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          displayError = 'Invalid email address or password. Please check your credentials and try again.';
        }
        toast.error(displayError, {
          title: 'Sign In Failed',
        });
        return { success: false, error: displayError };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        const userProfile = await fetchProfile(data.user.id);

        if (userProfile && userProfile.role === 'admin') {
          toast.success(`Welcome back, ${userProfile.full_name || 'Arafat'}.`, {
            title: 'Sign In Successful',
          });
        } else if (userProfile) {
          toast.warning(
            'This account does not have administrator privileges to access the photographer portal.',
            {
              title: 'Access Restricted',
            }
          );
        } else {
          toast.error(
            'Unable to verify administrator profile. Please contact support.',
            {
              title: 'Verification Failed',
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

  const resetPasswordForEmail = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!configured) {
      const errorMsg = 'The studio authentication service is currently unavailable. Please try again later.';
      toast.error(errorMsg, {
        title: 'Service Unavailable',
      });
      return { success: false, error: errorMsg };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#portal`,
      });

      if (error) {
        toast.error(error.message, {
          title: 'Password Recovery Failed',
        });
        return { success: false, error: error.message };
      }

      toast.success(
        'Password recovery instructions have been sent to your email address if an account exists.',
        {
          title: 'Recovery Email Sent',
        }
      );
      return { success: true };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unexpected error occurred during password recovery.';
      toast.error(errorMsg, {
        title: 'Recovery Error',
      });
      return { success: false, error: errorMsg };
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
    resetPasswordForEmail,
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
      resetPasswordForEmail: async () => ({ success: false, error: 'Auth context not available' }),
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
