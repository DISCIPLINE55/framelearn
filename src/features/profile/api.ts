import { supabase, isSupabaseConfigured } from '../../lib/database/supabase';
import { Profile } from '../../types/database';
import { ProfileUpdateInput, ProfileValidationResult, ProfileOperationResult } from './types';

const URL_REGEX = /^(https?:\/\/|\/)/i;

/**
 * Validates profile fields against business rules and database constraints.
 */
export function validateProfileInput(input: ProfileUpdateInput): ProfileValidationResult {
  const errors: Record<string, string> = {};

  const fullName = (input.full_name || '').trim();
  if (!fullName) {
    errors.full_name = 'Full name is required.';
  } else if (fullName.length < 2) {
    errors.full_name = 'Full name must be at least 2 characters.';
  } else if (fullName.length > 100) {
    errors.full_name = 'Full name must not exceed 100 characters.';
  }

  if (input.phone !== undefined && input.phone !== null && input.phone.trim() !== '') {
    const cleanPhone = input.phone.trim();
    if (cleanPhone.length < 7) {
      errors.phone = 'Phone number must be at least 7 characters.';
    } else if (cleanPhone.length > 30) {
      errors.phone = 'Phone number must not exceed 30 characters.';
    }
  }

  if (input.avatar_url !== undefined && input.avatar_url !== null && input.avatar_url.trim() !== '') {
    const cleanUrl = input.avatar_url.trim();
    if (!URL_REGEX.test(cleanUrl)) {
      errors.avatar_url = 'Avatar URL must start with http://, https://, or /';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Retrieves the profile for a specific user from Supabase PostgreSQL.
 * Respects Row Level Security (own profile or administrator).
 */
export async function fetchPhotographerProfile(
  userId: string
): Promise<{ data: Profile | null; error: string | null }> {
  if (!userId || !userId.trim()) {
    return { data: null, error: 'User identifier is required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[FrameLearn Profile] Fetch error:', error.message);
      return { data: null, error: error.message };
    }

    return { data: (data as Profile) || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error fetching profile.';
    console.warn('[FrameLearn Profile] Fetch exception:', err);
    return { data: null, error: msg };
  }
}

/**
 * Updates editable profile fields in Supabase public.profiles table.
 * 
 * Security Guard:
 * Strictly updates only full_name, phone, and avatar_url.
 * Never passes role, id, or email in update payload to prevent privilege escalation.
 */
export async function updatePhotographerProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<ProfileOperationResult> {
  if (!userId || !userId.trim()) {
    return {
      success: false,
      error: 'Cannot update profile without an authenticated user ID.',
    };
  }

  const validation = validateProfileInput(input);
  if (!validation.isValid) {
    return {
      success: false,
      error: 'Please correct the highlighted errors before saving.',
      validationErrors: validation.errors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    // Whitelist only safe, authorized editable fields.
    // Omit role, email, and id completely.
    const payload = {
      full_name: input.full_name.trim(),
      phone: input.phone && input.phone.trim() ? input.phone.trim() : null,
      avatar_url: input.avatar_url && input.avatar_url.trim() ? input.avatar_url.trim() : null,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.warn('[FrameLearn Profile] Update error:', error.message);
      return { success: false, error: error.message };
    }

    if (!data) {
      return {
        success: false,
        error: 'Profile record not found in the database. Account provisioning is required.',
      };
    }

    return {
      success: true,
      data: data as Profile,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving profile changes.';
    console.warn('[FrameLearn Profile] Update exception:', err);
    return { success: false, error: msg };
  }
}

