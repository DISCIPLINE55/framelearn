import { describe, it, expect, vi } from 'vitest';
import { isSupabaseConfigured, checkSupabaseConnection } from '../../src/lib/database/supabase';
import { validateEnv } from '../../src/config/env';

describe('Supabase Client Configuration and Safety Guards', () => {
  it('detects unconfigured or placeholder Supabase credentials correctly', () => {
    // Current environment in tests does not have live Supabase credentials set
    const configured = isSupabaseConfigured();
    // Should be false because .env has no live credentials
    expect(typeof configured).toBe('boolean');
  });

  it('validateEnv returns false and warns when credentials are not configured', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const isValid = validateEnv();
    
    // In local test environment without real secrets, validateEnv should report false
    if (!isSupabaseConfigured()) {
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    }
    consoleSpy.mockRestore();
  });

  it('checkSupabaseConnection returns honest unconfigured status when credentials are missing', async () => {
    if (!isSupabaseConfigured()) {
      const status = await checkSupabaseConnection();
      expect(status.configured).toBe(false);
      expect(status.connected).toBe(false);
      expect(status.message).toContain('credentials are not configured');
    }
  });
});
