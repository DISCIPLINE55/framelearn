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

  it('renders protected children when authenticated as admin', () => {
    // Mock useAuth to return an authenticated admin user
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
});
