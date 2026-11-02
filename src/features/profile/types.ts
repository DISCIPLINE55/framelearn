import { Profile, ProfileRole } from '../../types/database';

export interface ProfileUpdateInput {
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ProfileOperationResult {
  success: boolean;
  data?: Profile;
  error?: string;
  validationErrors?: Record<string, string>;
}

export type { Profile, ProfileRole };
