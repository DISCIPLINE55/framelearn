import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PhotographerPortalPage } from '../../src/app/routes/PhotographerPortalPage';
import * as AuthContextModule from '../../src/features/auth/context/AuthContext';
import * as BookingsModule from '../../src/features/bookings';
import * as ServicesModule from '../../src/features/services';
import { AppProvider } from '../../src/app/providers/AppProvider';

describe('PhotographerPortalPage Component and Business View', () => {
  it('renders photographer login form when user is not authenticated', async () => {
    render(
      <AppProvider>
        <PhotographerPortalPage />
      </AppProvider>
    );

    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders full photographer control center when authenticated as admin', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();

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
        phone: '+233241234567',
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
      resetPasswordForEmail: vi.fn(),
      signOut: mockSignOut,
      refreshProfile: vi.fn(),
      testConnection: vi.fn(),
    });

    vi.spyOn(BookingsModule, 'fetchBookingRequests').mockResolvedValue({
      data: [
        {
          id: 'b-1',
          client_name: 'Ama Serwaa',
          client_email: 'ama@example.com',
          client_phone: '+233201234567',
          service_id: 's-1',
          package_id: null,
          preferred_date: '2026-11-20',
          preferred_time: '14:00',
          location_notes: 'Kumasi',
          message: 'Looking for a graduation photoshoot session.',
          status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          services: { name: 'Graduation Photography', slug: 'graduation-photography' },
        },
      ],
      error: null,
    });

    vi.spyOn(ServicesModule, 'fetchAllServices').mockResolvedValue({
      data: [
        {
          id: 's-1',
          name: 'Graduation Photography',
          category: 'Academic',
          description: 'Commemorate your academic milestone with professional portraiture.',
          slug: 'graduation-photography',
          icon_name: null,
          cover_image_url: null,
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      error: null,
    });

    render(
      <AppProvider>
        <PhotographerPortalPage />
      </AppProvider>
    );

    // Verify Photographer welcome header in Overview
    expect(await screen.findByRole('heading', { name: /welcome back, arafat nabuku jansu/i })).toBeInTheDocument();

    // Verify 4 Dashboard statistics cards
    expect(screen.getByText(/total inquiries/i)).toBeInTheDocument();
    expect(screen.getByText(/pending inquiries/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmed bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/completed bookings/i)).toBeInTheDocument();

    // Verify Navigation Sidebar items
    expect(screen.getByRole('button', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /booking inquiries/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /photography services/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my profile/i })).toBeInTheDocument();

    // Navigate to Booking Inquiries
    const bookingsNavBtn = screen.getByRole('button', { name: /booking inquiries/i });
    await user.click(bookingsNavBtn);

    expect(screen.getByRole('heading', { name: /booking inquiries/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by client/i)).toBeInTheDocument();

    // Navigate to Photography Services
    const servicesNavBtn = screen.getByRole('button', { name: /photography services/i });
    await user.click(servicesNavBtn);

    expect(screen.getByRole('heading', { name: /photography services/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new service/i })).toBeInTheDocument();

    // Navigate to My Profile
    const profileNavBtn = screen.getByRole('button', { name: /^my profile$/i });
    await user.click(profileNavBtn);

    expect(screen.getByRole('heading', { name: /^my profile$/i })).toBeInTheDocument();
    expect(screen.getAllByText(/arafat nabuku jansu/i).length).toBeGreaterThan(0);

    // Trigger Log Out from Sidebar
    const logoutBtn = screen.getByRole('button', { name: /^log out$/i });
    await user.click(logoutBtn);

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/confirm session termination/i)).toBeInTheDocument();

    // Confirm logout within dialog
    const confirmLogoutBtn = within(dialog).getByRole('button', { name: /^log out$/i });
    await user.click(confirmLogoutBtn);
    expect(mockSignOut).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
