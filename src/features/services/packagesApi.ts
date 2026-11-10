import { supabase, isSupabaseConfigured } from '../../lib/database/supabase';
import { Database, ServicePackage } from '../../types/database';

export interface CreatePackageInput {
  service_id: string;
  name: string;
  slug?: string;
  description?: string | null;
  price_amount?: number | null;
  currency?: string;
  duration_minutes?: number | null;
  deliverables?: string[] | unknown;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdatePackageInput {
  service_id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  price_amount?: number | null;
  currency?: string;
  duration_minutes?: number | null;
  deliverables?: string[] | unknown;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Generates a clean URL-friendly slug from a package name.
 */
export function generatePackageSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates package inputs for creation and modification.
 */
export function validatePackageInput(
  input: Partial<CreatePackageInput>,
  isUpdate = false
): string | null {
  if (!isUpdate || input.name !== undefined) {
    if (!input.name || !input.name.trim()) {
      return 'Package name is required.';
    }
  }

  if (!isUpdate || input.service_id !== undefined) {
    if (!input.service_id || !input.service_id.trim()) {
      return 'Associated photography service is required.';
    }
  }

  if (input.price_amount !== undefined && input.price_amount !== null) {
    const priceNum = Number(input.price_amount);
    if (isNaN(priceNum) || priceNum < 0) {
      return 'Package price cannot be negative.';
    }
  }

  if (input.duration_minutes !== undefined && input.duration_minutes !== null) {
    const durNum = Number(input.duration_minutes);
    if (isNaN(durNum) || durNum <= 0) {
      return 'Duration must be a positive number of minutes.';
    }
  }

  if (input.sort_order !== undefined && input.sort_order !== null) {
    const sortNum = Number(input.sort_order);
    if (isNaN(sortNum) || sortNum < 0) {
      return 'Sort order must be a non-negative number.';
    }
  }

  if (input.description && input.description.length > 2000) {
    return 'Description cannot exceed 2000 characters.';
  }

  return null;
}

/**
 * Normalizes deliverables into structured JSON array.
 */
export function normalizeDeliverables(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === 'string' ? item.trim() : JSON.stringify(item)))
      .filter((s) => s.length > 0);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return normalizeDeliverables(parsed);
      }
    } catch {
      // Split on newlines or commas if plain text
      return raw
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  }
  return [];
}

/**
 * Translates PostgreSQL errors into clear, friendly error messages.
 */
function translatePackageError(error: { message: string; code?: string }): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('unique') || msg.includes('duplicate key') || msg.includes('uq_service_package_slug')) {
    return 'A package with this name or slug already exists for the selected service.';
  }
  if (msg.includes('foreign key') || msg.includes('service_packages_service_id_fkey')) {
    return 'The selected photography service does not exist.';
  }
  if (msg.includes('permission denied') || msg.includes('row-level security') || msg.includes('rls')) {
    return 'Unauthorized operation: Administrative credentials required to manage packages.';
  }
  return 'A database error occurred while processing the package operation.';
}

/**
 * Fetches all service packages in the system.
 * Used by the photographer management dashboard.
 */
export async function fetchAllServicePackages(): Promise<{
  data: ServicePackage[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Studio catalog service is currently unavailable.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('service_packages')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return { data: [], error: translatePackageError(error) };
    }

    return { data: (data as ServicePackage[]) || [], error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to query service packages.';
    return { data: [], error: msg };
  }
}

/**
 * Creates a new photography package.
 * Requires authenticated administrative access under RLS.
 */
export async function createServicePackage(
  input: CreatePackageInput
): Promise<{
  data: ServicePackage | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Studio database service is currently unavailable.',
    };
  }

  const validationError = validatePackageInput(input, false);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const name = input.name.trim();
  const service_id = input.service_id.trim();
  const slug = (input.slug && input.slug.trim()) ? generatePackageSlug(input.slug) : generatePackageSlug(name);
  const description = input.description ? input.description.trim() : null;
  const price_amount =
    input.price_amount !== undefined && input.price_amount !== null && !isNaN(Number(input.price_amount))
      ? Number(input.price_amount)
      : null;
  const currency = (input.currency || 'GHS').toUpperCase().trim();
  const duration_minutes =
    input.duration_minutes !== undefined && input.duration_minutes !== null && !isNaN(Number(input.duration_minutes))
      ? Math.round(Number(input.duration_minutes))
      : null;
  const deliverables = normalizeDeliverables(input.deliverables);
  const is_featured = input.is_featured ?? false;
  const is_active = input.is_active ?? true;
  const sort_order =
    input.sort_order !== undefined && input.sort_order !== null && !isNaN(Number(input.sort_order))
      ? Number(input.sort_order)
      : 0;

  try {
    const { data, error } = await supabase
      .from('service_packages')
      .insert([
        {
          service_id,
          name,
          slug,
          description,
          price_amount,
          currency,
          duration_minutes,
          deliverables,
          is_featured,
          is_active,
          sort_order,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: translatePackageError(error) };
    }

    return { data: (data as ServicePackage) || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error creating package.';
    return { data: null, error: msg };
  }
}

/**
 * Updates an existing photography package.
 * Requires authenticated administrative access under RLS.
 */
export async function updateServicePackage(
  packageId: string,
  input: UpdatePackageInput
): Promise<{
  data: ServicePackage | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!packageId || !packageId.trim()) {
    return { data: null, error: 'Package identifier is required.' };
  }

  const validationError = validatePackageInput(input, true);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const payload: Database['public']['Tables']['service_packages']['Update'] = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    payload.name = input.name.trim();
  }
  if (input.service_id !== undefined) {
    payload.service_id = input.service_id.trim();
  }
  if (input.slug !== undefined) {
    payload.slug = input.slug.trim() ? generatePackageSlug(input.slug) : undefined;
  }
  if (input.description !== undefined) {
    payload.description = input.description ? input.description.trim() : null;
  }
  if (input.price_amount !== undefined) {
    payload.price_amount =
      input.price_amount !== null && !isNaN(Number(input.price_amount))
        ? Number(input.price_amount)
        : null;
  }
  if (input.currency !== undefined) {
    payload.currency = (input.currency || 'GHS').toUpperCase().trim();
  }
  if (input.duration_minutes !== undefined) {
    payload.duration_minutes =
      input.duration_minutes !== null && !isNaN(Number(input.duration_minutes))
        ? Math.round(Number(input.duration_minutes))
        : null;
  }
  if (input.deliverables !== undefined) {
    payload.deliverables = normalizeDeliverables(input.deliverables);
  }
  if (input.is_featured !== undefined) {
    payload.is_featured = Boolean(input.is_featured);
  }
  if (input.is_active !== undefined) {
    payload.is_active = Boolean(input.is_active);
  }
  if (input.sort_order !== undefined) {
    payload.sort_order =
      input.sort_order !== null && !isNaN(Number(input.sort_order))
        ? Number(input.sort_order)
        : 0;
  }

  try {
    const { data, error } = await supabase
      .from('service_packages')
      .update(payload)
      .eq('id', packageId)
      .select()
      .single();

    if (error) {
      return { data: null, error: translatePackageError(error) };
    }

    return { data: (data as ServicePackage) || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error updating package.';
    return { data: null, error: msg };
  }
}

/**
 * Toggles package active status.
 */
export async function togglePackageActive(
  packageId: string,
  isActive: boolean
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!packageId || !packageId.trim()) {
    return { success: false, error: 'Package identifier is required.' };
  }

  try {
    const { error } = await supabase
      .from('service_packages')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packageId);

    if (error) {
      return { success: false, error: translatePackageError(error) };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update package availability.';
    return { success: false, error: msg };
  }
}

/**
 * Toggles package featured status.
 */
export async function togglePackageFeatured(
  packageId: string,
  isFeatured: boolean
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!packageId || !packageId.trim()) {
    return { success: false, error: 'Package identifier is required.' };
  }

  try {
    const { error } = await supabase
      .from('service_packages')
      .update({
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packageId);

    if (error) {
      return { success: false, error: translatePackageError(error) };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update featured status.';
    return { success: false, error: msg };
  }
}

/**
 * Updates package display sort order.
 */
export async function updatePackageSortOrder(
  packageId: string,
  sortOrder: number
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!packageId || !packageId.trim()) {
    return { success: false, error: 'Package identifier is required.' };
  }

  if (isNaN(sortOrder) || sortOrder < 0) {
    return { success: false, error: 'Sort order must be a non-negative number.' };
  }

  try {
    const { error } = await supabase
      .from('service_packages')
      .update({
        sort_order: Math.round(sortOrder),
        updated_at: new Date().toISOString(),
      })
      .eq('id', packageId);

    if (error) {
      return { success: false, error: translatePackageError(error) };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update display order.';
    return { success: false, error: msg };
  }
}

/**
 * Deletes a package from the database.
 */
export async function deleteServicePackage(
  packageId: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Studio database service is currently unavailable.',
    };
  }

  if (!packageId || !packageId.trim()) {
    return { success: false, error: 'Package identifier is required.' };
  }

  try {
    const { error } = await supabase
      .from('service_packages')
      .delete()
      .eq('id', packageId);

    if (error) {
      return { success: false, error: translatePackageError(error) };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete package.';
    return { success: false, error: msg };
  }
}

