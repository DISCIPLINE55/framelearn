import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PhotographerPortalPage } from '../../src/app/routes/PhotographerPortalPage';
import * as AuthContextModule from '../../src/features/auth/context/AuthContext';
import { AppProvider } from '../../src/app/providers/AppProvider';

describe('PhotographerPortalPage Component and Business View', () => {
  it('renders photographer login form when user is not authenticated', async () => {
    render(
      <AppProvider>
        <PhotographerPortalPage />
      </AppProvider>
    );

    expect(await screen.findByRole('heading', { name: /photographer portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders full photographer control center when authenticated as admin', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();
    const mockTestConnection = vi.fn().mockResolvedValue({
      configured: true,
      connected: true,
      message: 'Supabase backend verified.',
    });

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'arafat-admin-id',
        email: 'arafat@framelearn.com',
        app_metadata: {},
        user_metadata: { full_name: 'Arafat Nabuku Jansu' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any,
      profile: {
        id: 'arafat-admin-id',
        role: 'admin',
        full_name: 'Arafat Nabuku Jansu',
        email: 'arafat@framelearn.com',
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
      signOut: mockSignOut,
      refreshProfile: vi.fn(),
      testConnection: mockTestConnection,
    });

    render(
      <AppProvider>
        <PhotographerPortalPage />
      </AppProvider>
    );

    // Verify Photographer header
    expect(screen.getByRole('heading', { name: /arafat nabuku jansu/i })).toBeInTheDocument();
    expect(screen.getByText(/photographer access verified/i)).toBeInTheDocument();

    // Verify Database Schema entities
    expect(screen.getByText(/database schema \(m002\)/i)).toBeInTheDocument();
    expect(screen.getByText(/5 entities/i)).toBeInTheDocument();

    // Verify canonical services are rendered
    expect(screen.getByText(/portrait photography/i)).toBeInTheDocument();
    expect(screen.getByText(/weddings & event photography/i)).toBeInTheDocument();
    expect(screen.getByText(/graduation photography/i)).toBeInTheDocument();

    // Verify End Session triggers confirmation dialog
    const endSessionBtn = screen.getByRole('button', { name: /end session/i });
    await user.click(endSessionBtn);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/confirm session termination/i)).toBeInTheDocument();

    // Confirm logout
    const confirmLogoutBtn = screen.getByRole('button', { name: /^log out$/i });
    await user.click(confirmLogoutBtn);
    expect(mockSignOut).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
