import { supabase, isSupabaseConfigured } from '../../lib/database/supabase';
import { Service, ServicePackage } from '../../types/database';

export interface ServiceWithPackages extends Service {
  packages?: ServicePackage[];
}

/**
 * Retrieves active photography disciplines from Supabase.
 * Respects RLS (accessible by public and authenticated visitors).
 */
export async function fetchActiveServices(): Promise<{
  data: Service[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as Service[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to query active services.';
    return { data: [], error: msg };
  }
}

/**
 * Retrieves all photography disciplines (both active and inactive).
 * Used by photographer portal administrator.
 */
export async function fetchAllServices(): Promise<{
  data: Service[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as Service[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to query services.';
    return { data: [], error: msg };
  }
}

/**
 * Retrieves service packages from Supabase.
 * If serviceId is supplied, filters for that specific service.
 */
export async function fetchServicePackages(
  serviceId?: string
): Promise<{
  data: ServicePackage[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    let query = supabase.from('service_packages').select('*');

    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as ServicePackage[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to query service packages.';
    return { data: [], error: msg };
  }
}

/**
 * Toggles the is_active status of a service record.
 * Authorized for administrator profiles under RLS policies.
 */
export async function toggleServiceActive(
  serviceId: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend credentials are not configured.',
    };
  }

  try {
    const { error } = await supabase
      .from('services')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update service status.';
    return { success: false, error: msg };
  }
}
