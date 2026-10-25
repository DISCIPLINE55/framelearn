import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../../src/features/auth/components/ProtectedRoute';
import * as AuthContextModule from '../../src/features/auth/context/AuthContext';
import { AppProvider } from '../../src/app/providers/AppProvider';

describe('ProtectedRoute Guard Component', () => {
  it('renders login form when user is not authenticated', async () => {
    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /photographer portal/i })).toBeInTheDocument();
  });

  it('renders custom fallback when provided and user is not authenticated', async () => {
    render(
      <AppProvider>
        <ProtectedRoute fallback={<div data-testid="custom-fallback">Access Denied</div>}>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(await screen.findByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('renders protected children when authenticated as a genuine authorized administrator', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'admin-user-id',
        app_metadata: {},
        user_metadata: { full_name: 'Arafat Nabuku Jansu' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: {
        id: 'admin-user-id',
        role: 'admin',
        full_name: 'Arafat Nabuku Jansu',
        email: 'photographer@framelearn.com',
        phone: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      session: {
        access_token: 'fake-token',
        refresh_token: 'fake-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {} as any,
      },
      role: 'admin',
      isAdmin: true,
      isAuthenticated: true,
      isLoading: false,
      isProfileLoading: false,
      profileError: null,
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('denies access when user has user_metadata.role = "admin" but no verified administrator profile (client role in DB)', () => {
    // Malicious or crafted signup metadata claims admin, but database profile has role 'client'
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'malicious-client-id',
        email: 'attacker@example.com',
        app_metadata: {},
        user_metadata: { role: 'admin', full_name: 'Attacker' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: {
        id: 'malicious-client-id',
        role: 'client', // Database authoritative role
        full_name: 'Attacker',
        email: 'attacker@example.com',
        phone: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      session: {
        access_token: 'client-token',
        refresh_token: 'client-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {} as any,
      },
      role: 'client',
      isAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isProfileLoading: false,
      profileError: null,
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    // Protected content must NOT be displayed
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Must show explicit access restricted notice
    expect(screen.getByText(/unauthorized account/i)).toBeInTheDocument();
    expect(screen.getByText(/attacker@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry authorization/i })).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('denies access when a profile-fetch error occurs', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'error-user-id',
        email: 'user@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: null,
      session: {} as any,
      role: null,
      isAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isProfileLoading: false,
      profileError: 'Network failure fetching profile row.',
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/unauthorized account/i)).toBeInTheDocument();
    expect(screen.getByText(/network failure fetching profile row/i)).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('denies access when profile is missing from database', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'missing-profile-user-id',
        email: 'ghost@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: null,
      session: {} as any,
      role: null,
      isAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isProfileLoading: false,
      profileError: 'No profile record found in the database for this user.',
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/unauthorized account/i)).toBeInTheDocument();
    expect(screen.getByText(/no profile record found/i)).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('denies access to an ordinary authenticated user without administrator privileges', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'client-user-id',
        email: 'client@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: {
        id: 'client-user-id',
        role: 'client',
        full_name: 'Client Customer',
        email: 'client@example.com',
        phone: '1234567890',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      session: {} as any,
      role: 'client',
      isAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isProfileLoading: false,
      profileError: null,
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/unauthorized account/i)).toBeInTheDocument();
    expect(screen.getByText(/client@example.com/i)).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('asynchronous session restoration does not create a temporary unauthorized access window', () => {
    // Both during auth initialization or profile loading
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      profile: null,
      session: null,
      role: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: true, // Asynchronous hydration in flight
      isProfileLoading: false,
      profileError: null,
      isConfigured: true,
      connectionStatus: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    render(
      <AppProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Photographer Workspace</div>
        </ProtectedRoute>
      </AppProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/verifying authorization/i)).toBeInTheDocument();
    expect(screen.getByText(/checking photographer session/i)).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
