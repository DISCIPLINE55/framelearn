import { supabase, isSupabaseConfigured } from '../../lib/database/supabase';
import { Database, Service, ServicePackage } from '../../types/database';

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

export interface CreateServiceInput {
  name: string;
  category: string;
  description: string;
  slug?: string;
  icon_name?: string | null;
  cover_image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateServiceInput {
  name?: string;
  category?: string;
  description?: string;
  slug?: string;
  icon_name?: string | null;
  cover_image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Creates a new photography service in Supabase.
 * Authorized for administrator profiles under RLS policies.
 */
export async function createService(
  input: CreateServiceInput
): Promise<{
  data: Service | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Studio database service is currently unavailable.',
    };
  }

  const name = (input.name || '').trim();
  const category = (input.category || '').trim();
  const description = (input.description || '').trim();

  if (!name) return { data: null, error: 'Service name is required.' };
  if (!category) return { data: null, error: 'Service category is required.' };
  if (!description) return { data: null, error: 'Service description is required.' };

  const slug = (input.slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          name,
          category,
          description,
          slug,
          icon_name: input.icon_name || null,
          cover_image_url: input.cover_image_url || null,
          is_active: input.is_active !== undefined ? input.is_active : true,
          sort_order: input.sort_order !== undefined ? input.sort_order : 0,
        },
      ])
      .select()
      .single();

    if (error) {
      const friendly = error.message.includes('unique')
        ? 'A service with this name or slug already exists.'
        : 'Failed to create new photography service.';
      return { data: null, error: friendly };
    }

    return { data: (data as Service) || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error creating service.';
    return { data: null, error: msg };
  }
}

/**
 * Updates an existing photography service in Supabase.
 * Authorized for administrator profiles under RLS policies.
 */
export async function updateService(
  serviceId: string,
  input: UpdateServiceInput
): Promise<{
  data: Service | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!serviceId) {
    return { data: null, error: 'Service identifier is required.' };
  }

  const payload: Database['public']['Tables']['services']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.category !== undefined) payload.category = input.category.trim();
  if (input.description !== undefined) payload.description = input.description.trim();
  if (input.slug !== undefined) payload.slug = input.slug.trim();
  if (input.icon_name !== undefined) payload.icon_name = input.icon_name;
  if (input.cover_image_url !== undefined) payload.cover_image_url = input.cover_image_url;
  if (input.is_active !== undefined) payload.is_active = input.is_active;
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;

  try {
    const { data, error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      return { data: null, error: 'Failed to update service details.' };
    }

    return { data: (data as Service) || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error updating service.';
    return { data: null, error: msg };
  }
}
