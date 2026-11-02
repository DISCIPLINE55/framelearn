import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateBookingInput,
  submitBookingRequest,
  updateBookingStatus,
  PERMITTED_STATUS_TRANSITIONS,
} from '../../src/features/bookings';
import { supabase } from '../../src/lib/database/supabase';

describe('Booking Inquiries Integration & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Client Input Validation', () => {
    it('rejects an empty name', () => {
      const res = validateBookingInput({
        client_name: '   ',
        client_email: 'client@example.com',
        client_phone: '+233241234567',
        message: 'Looking for a graduation session',
      });

      expect(res.isValid).toBe(false);
      expect(res.errors.client_name).toBeDefined();
    });

    it('rejects an invalid email format', () => {
      const res = validateBookingInput({
        client_name: 'Ismail Mensah',
        client_email: 'not-an-email',
        client_phone: '+233241234567',
        message: 'Looking for a graduation session',
      });

      expect(res.isValid).toBe(false);
      expect(res.errors.client_email).toContain('valid email');
    });

    it('rejects a phone number shorter than 7 characters (schema constraint)', () => {
      const res = validateBookingInput({
        client_name: 'Ismail Mensah',
        client_email: 'client@example.com',
        client_phone: '12345',
        message: 'Looking for a graduation session',
      });

      expect(res.isValid).toBe(false);
      expect(res.errors.client_phone).toContain('at least 7');
    });

    it('rejects an empty inquiry message', () => {
      const res = validateBookingInput({
        client_name: 'Ismail Mensah',
        client_email: 'client@example.com',
        client_phone: '+233241234567',
        message: '   ',
      });

      expect(res.isValid).toBe(false);
      expect(res.errors.message).toBeDefined();
    });

    it('accepts completely valid submission inputs', () => {
      const res = validateBookingInput({
        client_name: 'Ismail Mensah',
        client_email: 'ismail@example.com',
        client_phone: '+233 24 123 4567',
        message: 'Graduation portrait session inquiry for next month.',
        service_id: 'srv-123',
        preferred_date: '2026-12-15',
      });

      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });
  });

  describe('submitBookingRequest Backend Integration', () => {
    it('returns validation errors immediately without executing network insert if input is invalid', async () => {
      const insertSpy = vi.spyOn(supabase, 'from');

      const res = await submitBookingRequest({
        client_name: '',
        client_email: 'bad-email',
        client_phone: '',
        message: '',
      });

      expect(res.success).toBe(false);
      expect(res.validationErrors).toBeDefined();
      expect(insertSpy).not.toHaveBeenCalled();
    });

    it('invokes Supabase insert and returns success on valid payload confirmation', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const res = await submitBookingRequest({
        client_name: 'Amina Osei',
        client_email: 'amina@example.com',
        client_phone: '+233201234567',
        message: 'Wedding storytelling package inquiry.',
      });

      expect(res.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          client_name: 'Amina Osei',
          client_email: 'amina@example.com',
          client_phone: '+233201234567',
          status: 'submitted',
        }),
      ]);
    });

    it('returns actionable error and does not claim success when Supabase insertion fails', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: { message: 'Database connection refused' },
        }),
      } as any);

      const res = await submitBookingRequest({
        client_name: 'Amina Osei',
        client_email: 'amina@example.com',
        client_phone: '+233201234567',
        message: 'Wedding storytelling package inquiry.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Database connection refused');
    });
  });

  describe('Booking Status Transitions & Audit History', () => {
    it('validates permitted status transitions according to business rules', () => {
      expect(PERMITTED_STATUS_TRANSITIONS.submitted).toContain('under_review');
      expect(PERMITTED_STATUS_TRANSITIONS.submitted).toContain('confirmed');
      expect(PERMITTED_STATUS_TRANSITIONS.submitted).toContain('declined');
      expect(PERMITTED_STATUS_TRANSITIONS.submitted).not.toContain('completed');

      expect(PERMITTED_STATUS_TRANSITIONS.confirmed).toContain('completed');
      expect(PERMITTED_STATUS_TRANSITIONS.confirmed).toContain('cancelled');
      expect(PERMITTED_STATUS_TRANSITIONS.confirmed).not.toContain('submitted');
    });

    it('rejects forbidden status transitions before calling the database', async () => {
      const fromSpy = vi.spyOn(supabase, 'from');

      const res = await updateBookingStatus('booking-123', 'completed', 'submitted');

      expect(res.success).toBe(false);
      expect(res.error).toContain('not permitted');
      expect(fromSpy).not.toHaveBeenCalled();
    });

    it('persists allowed status transitions and logs audit history', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockInsertHistory = vi.fn().mockResolvedValue({ error: null });

      vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
        if (table === 'booking_requests') {
          return { update: mockUpdate } as any;
        }
        if (table === 'booking_status_history') {
          return { insert: mockInsertHistory } as any;
        }
        return {} as any;
      });

      const res = await updateBookingStatus('booking-123', 'under_review', 'submitted', 'Reviewing schedule');

      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'under_review' })
      );
      expect(mockInsertHistory).toHaveBeenCalledWith([
        expect.objectContaining({
          booking_request_id: 'booking-123',
          from_status: 'submitted',
          to_status: 'under_review',
          note: 'Reviewing schedule',
        }),
      ]);
    });
  });
});

