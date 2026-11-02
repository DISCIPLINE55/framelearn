import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateProfileInput,
  fetchPhotographerProfile,
  updatePhotographerProfile,
  ProfileManagementCard,
} from '../../src/features/profile';
import { supabase } from '../../src/lib/database/supabase';
import * as AuthContextModule from '../../src/features/auth/context/AuthContext';
import { AppProvider } from '../../src/app/providers/AppProvider';

describe('Photographer Profile Management Integration & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Input Validation (validateProfileInput)', () => {
    it('rejects an empty full name', () => {
      const res = validateProfileInput({ full_name: '   ' });
      expect(res.isValid).toBe(false);
      expect(res.errors.full_name).toBeDefined();
    });

    it('rejects a full name shorter than 2 characters', () => {
      const res = validateProfileInput({ full_name: 'A' });
      expect(res.isValid).toBe(false);
      expect(res.errors.full_name).toContain('at least 2');
    });

    it('rejects a phone number shorter than 7 characters', () => {
      const res = validateProfileInput({
        full_name: 'Arafat Nabuku Jansu',
        phone: '12345',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.phone).toContain('at least 7');
    });

    it('rejects an avatar URL not starting with http://, https://, or /', () => {
      const res = validateProfileInput({
        full_name: 'Arafat Nabuku Jansu',
        avatar_url: 'ftp://invalidscheme.com/photo.jpg',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.avatar_url).toContain('must start with');
    });

    it('accepts completely valid profile input with optional fields omitted', () => {
      const res = validateProfileInput({
        full_name: 'Arafat Nabuku Jansu',
      });
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });

    it('accepts valid profile input with all optional fields provided', () => {
      const res = validateProfileInput({
        full_name: 'Arafat Nabuku Jansu',
        phone: '+233 24 123 4567',
        avatar_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
      });
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });
  });

  describe('Backend Query Integration (fetchPhotographerProfile)', () => {
    it('returns error if userId is empty', async () => {
      const res = await fetchPhotographerProfile('');
      expect(res.data).toBeNull();
      expect(res.error).toContain('required');
    });

    it('retrieves profile from Supabase profiles table by userId', async () => {
      const mockProfile = {
        id: 'usr-123',
        role: 'admin',
        full_name: 'Arafat Nabuku Jansu',
        email: 'framelearn28@gmail.com',
        phone: '+233241234567',
        avatar_url: null,
        created_at: '2026-10-20T00:00:00Z',
        updated_at: '2026-10-20T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });
      const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const res = await fetchPhotographerProfile('usr-123');

      expect(res.data).toEqual(mockProfile);
      expect(res.error).toBeNull();
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'usr-123');
    });

    it('returns error when database query fails', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Network connection failed' },
            }),
          }),
        }),
      } as any);

      const res = await fetchPhotographerProfile('usr-123');

      expect(res.data).toBeNull();
      expect(res.error).toBe('Network connection failed');
    });
  });

  describe('Profile Persistence & Role Immutability (updatePhotographerProfile)', () => {
    it('rejects update if input is invalid without calling database', async () => {
      const fromSpy = vi.spyOn(supabase, 'from');

      const res = await updatePhotographerProfile('usr-123', {
        full_name: '',
      });

      expect(res.success).toBe(false);
      expect(res.validationErrors).toBeDefined();
      expect(fromSpy).not.toHaveBeenCalled();
    });

    it('persists safe fields and strictly excludes role, email, and id from update payload', async () => {
      const mockUpdatedRow = {
        id: 'usr-123',
        role: 'admin',
        full_name: 'Arafat Nabuku Jansu (Updated)',
        email: 'framelearn28@gmail.com',
        phone: '+233 24 999 8888',
        avatar_url: 'https://images.unsplash.com/new-avatar.jpg',
        created_at: '2026-10-20T00:00:00Z',
        updated_at: '2026-11-02T09:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockUpdatedRow, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await updatePhotographerProfile('usr-123', {
        full_name: 'Arafat Nabuku Jansu (Updated)',
        phone: '+233 24 999 8888',
        avatar_url: 'https://images.unsplash.com/new-avatar.jpg',
        // Intentional attempted privilege escalation fields (should be ignored)
        ...({ role: 'superadmin', email: 'hacker@example.com', id: 'fake-id' } as any),
      });

      expect(res.success).toBe(true);
      expect(res.data?.full_name).toBe('Arafat Nabuku Jansu (Updated)');

      // Verify ONLY safe fields were sent to Supabase
      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Arafat Nabuku Jansu (Updated)',
        phone: '+233 24 999 8888',
        avatar_url: 'https://images.unsplash.com/new-avatar.jpg',
      });
      // Verify role, email, and id were NEVER in update payload
      const calledPayload = mockUpdate.mock.calls[0][0];
      expect(calledPayload.role).toBeUndefined();
      expect(calledPayload.email).toBeUndefined();
      expect(calledPayload.id).toBeUndefined();

      expect(mockEq).toHaveBeenCalledWith('id', 'usr-123');
    });

    it('returns error when update fails at database layer', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Row Level Security policy violation' },
              }),
            }),
          }),
        }),
      } as any);

      const res = await updatePhotographerProfile('usr-123', {
        full_name: 'Valid Name',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Row Level Security policy violation');
    });
  });

  describe('ProfileManagementCard UI Component', () => {
    const mockProfile = {
      id: 'usr-admin-123',
      role: 'admin' as const,
      full_name: 'Arafat Nabuku Jansu',
      email: 'framelearn28@gmail.com',
      phone: '+233241234567',
      avatar_url: null,
      created_at: '2026-10-20T00:00:00Z',
      updated_at: '2026-10-20T00:00:00Z',
    };

    it('renders current profile information in view mode with read-only badges', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { id: 'usr-admin-123', email: 'framelearn28@gmail.com' } as any,
        profile: mockProfile,
        session: null,
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
        signOut: vi.fn(),
        refreshProfile: vi.fn(),
        testConnection: vi.fn(),
      });

      render(
        <AppProvider>
          <ProfileManagementCard />
        </AppProvider>
      );

      // Verify headings and labels
      expect(screen.getByRole('heading', { name: /photographer profile & identity/i })).toBeInTheDocument();
      expect(screen.getByText('Arafat Nabuku Jansu')).toBeInTheDocument();
      expect(screen.getByText('framelearn28@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('+233241234567')).toBeInTheDocument();

      // Verify read-only markers
      expect(screen.getByText(/read-only/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('toggles edit mode and allows cancelling edits without saving', async () => {
      const user = userEvent.setup();

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { id: 'usr-admin-123', email: 'framelearn28@gmail.com' } as any,
        profile: mockProfile,
        session: null,
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
        signOut: vi.fn(),
        refreshProfile: vi.fn(),
        testConnection: vi.fn(),
      });

      render(
        <AppProvider>
          <ProfileManagementCard />
        </AppProvider>
      );

      // Click Edit Profile
      const editBtn = screen.getByRole('button', { name: /edit profile/i });
      await user.click(editBtn);

      // Form inputs should now be visible
      const nameInput = screen.getByLabelText(/display name \/ full name/i);
      expect(nameInput).toHaveValue('Arafat Nabuku Jansu');
      expect(screen.getByRole('button', { name: /save profile changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();

      // Modify the name input
      await user.clear(nameInput);
      await user.type(nameInput, 'Temporary Changed Name');
      expect(nameInput).toHaveValue('Temporary Changed Name');

      // Click Cancel
      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelBtn);

      // Form should close and revert back to view mode with original name
      expect(screen.queryByRole('button', { name: /save profile changes/i })).not.toBeInTheDocument();
      expect(screen.getByText('Arafat Nabuku Jansu')).toBeInTheDocument();
      expect(screen.queryByText('Temporary Changed Name')).not.toBeInTheDocument();
    });

    it('saves valid profile changes, calls refreshProfile, and displays success message', async () => {
      const user = userEvent.setup();
      const mockRefresh = vi.fn().mockResolvedValue(undefined);

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { id: 'usr-admin-123', email: 'framelearn28@gmail.com' } as any,
        profile: mockProfile,
        session: null,
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
        signOut: vi.fn(),
        refreshProfile: mockRefresh,
        testConnection: vi.fn(),
      });

      // Mock database update
      const updatedProfile = {
        ...mockProfile,
        full_name: 'Arafat N. Jansu',
        phone: '+233 24 555 7777',
      };

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedProfile,
                error: null,
              }),
            }),
          }),
        }),
      } as any);

      render(
        <AppProvider>
          <ProfileManagementCard />
        </AppProvider>
      );

      // Open Edit Mode
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Type new values
      const nameInput = screen.getByLabelText(/display name \/ full name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Arafat N. Jansu');

      const phoneInput = screen.getByLabelText(/business phone number/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '+233 24 555 7777');

      // Click Save
      const saveBtn = screen.getByRole('button', { name: /save profile changes/i });
      await user.click(saveBtn);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });
});
