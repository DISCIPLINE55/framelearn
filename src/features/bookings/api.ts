import { supabase, isSupabaseConfigured } from '../../lib/database/supabase';
import { BookingRequest, BookingStatus, BookingStatusHistory } from '../../types/database';

export interface BookingSubmissionInput {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id?: string | null;
  package_id?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  location_notes?: string | null;
  message: string;
}

export interface BookingRequestWithService extends BookingRequest {
  services?: {
    name: string;
    slug: string;
  } | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Validates booking submission inputs against database schema constraints.
 */
export function validateBookingInput(input: BookingSubmissionInput): ValidationResult {
  const errors: Record<string, string> = {};

  const name = (input.client_name || '').trim();
  if (!name) {
    errors.client_name = 'Your name is required.';
  }

  const email = (input.client_email || '').trim();
  if (!email) {
    errors.client_email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.client_email = 'Please provide a valid email address (e.g. name@example.com).';
  }

  const phone = (input.client_phone || '').trim();
  if (!phone) {
    errors.client_phone = 'Phone number is required.';
  } else if (phone.length < 7) {
    errors.client_phone = 'Phone number must be at least 7 characters.';
  }

  const message = (input.message || '').trim();
  if (!message) {
    errors.message = 'Please provide details or questions regarding your session inquiry.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submits a client booking inquiry to PostgreSQL booking_requests.
 * Publicly accessible via RLS; does not expose private records.
 */
export async function submitBookingRequest(
  input: BookingSubmissionInput
): Promise<{
  success: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
}> {
  const validation = validateBookingInput(input);
  if (!validation.isValid) {
    return {
      success: false,
      error: 'Please correct the highlighted fields before submitting.',
      validationErrors: validation.errors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'The studio booking service is currently unavailable. Please try again later.',
    };
  }

  try {
    const payload = {
      client_name: input.client_name.trim(),
      client_email: input.client_email.trim(),
      client_phone: input.client_phone.trim(),
      service_id: input.service_id || null,
      package_id: input.package_id || null,
      preferred_date: input.preferred_date || null,
      preferred_time: input.preferred_time || null,
      location_notes: input.location_notes ? input.location_notes.trim() : null,
      message: input.message.trim(),
      status: 'submitted' as BookingStatus,
    };

    // Public RLS allows INSERT but forbids SELECT to protect client PII.
    // We execute insert without .select() so the operation succeeds.
    const { error } = await supabase.from('booking_requests').insert([payload]);

    if (error) {
      console.warn('[FrameLearn Bookings] Insert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving inquiry.';
    console.warn('[FrameLearn Bookings] Submission exception:', err);
    return { success: false, error: msg };
  }
}

/**
 * Fetches all booking requests for authorized photographer.
 * Requires administrator role in public.profiles.
 */
export async function fetchBookingRequests(): Promise<{
  data: BookingRequestWithService[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'The studio booking service is currently unavailable. Please try again later.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*, services(name, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as unknown as BookingRequestWithService[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve booking requests.';
    return { data: [], error: msg };
  }
}

/**
 * Permitted status transitions matrix for FrameLearn bookings.
 */
export const PERMITTED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  submitted: ['under_review', 'confirmed', 'declined', 'cancelled'],
  under_review: ['confirmed', 'declined', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  declined: ['under_review'],
  completed: ['confirmed'],
  cancelled: ['submitted', 'under_review'],
};

/**
 * Updates a booking status and records immutable transition in booking_status_history.
 * Enforces business workflow and authorized administrator access.
 */
export async function updateBookingStatus(
  bookingId: string,
  toStatus: BookingStatus,
  fromStatus: BookingStatus,
  note?: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'The studio booking service is currently unavailable. Please try again later.',
    };
  }

  const allowedTransitions = PERMITTED_STATUS_TRANSITIONS[fromStatus] || [];
  if (!allowedTransitions.includes(toStatus)) {
    return {
      success: false,
      error: `Status transition from "${fromStatus}" to "${toStatus}" is not permitted.`,
    };
  }

  try {
    // 1. Update booking request status
    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: toStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 2. Insert audit transition record
    const { error: historyError } = await supabase
      .from('booking_status_history')
      .insert([
        {
          booking_request_id: bookingId,
          from_status: fromStatus,
          to_status: toStatus,
          note: note ? note.trim() : `Status transitioned from ${fromStatus} to ${toStatus}.`,
        },
      ]);

    if (historyError) {
      console.warn('[FrameLearn Bookings] History logging notice:', historyError.message);
      // Status update already succeeded, log warning
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update booking status.';
    return { success: false, error: msg };
  }
}

/**
 * Retrieves audit status history for a specific booking request.
 */
export async function fetchBookingStatusHistory(
  bookingId: string
): Promise<{
  data: BookingStatusHistory[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'The studio booking service is currently unavailable. Please try again later.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('booking_status_history')
      .select('*')
      .eq('booking_request_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as BookingStatusHistory[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to query status history.';
    return { data: [], error: msg };
  }
}

