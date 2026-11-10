import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generatePackageSlug,
  validatePackageInput,
  normalizeDeliverables,
  createServicePackage,
  updateServicePackage,
  togglePackageActive,
  togglePackageFeatured,
  updatePackageSortOrder,
  deleteServicePackage,
  fetchAllServicePackages,
} from '../../src/features/services/packagesApi';
import { fetchServicePackages } from '../../src/features/services/api';
import { supabase } from '../../src/lib/database/supabase';

describe('Photography Packages API & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('generatePackageSlug', () => {
    it('converts package name to lowercase with hyphens', () => {
      expect(generatePackageSlug('Gold Wedding Package')).toBe('gold-wedding-package');
      expect(generatePackageSlug('Express Portrait (30 mins!)')).toBe('express-portrait-30-mins');
    });

    it('strips leading and trailing hyphens and special characters', () => {
      expect(generatePackageSlug('---VIP Studio Session---')).toBe('vip-studio-session');
      expect(generatePackageSlug('@#$%')).toBe('');
    });
  });

  describe('validatePackageInput', () => {
    it('requires name and service_id for package creation', () => {
      expect(validatePackageInput({ name: '', service_id: 'srv-1' }, false)).toBe('Package name is required.');
      expect(validatePackageInput({ name: 'Gold', service_id: '' }, false)).toBe('Associated photography service is required.');
    });

    it('allows partial fields when updating', () => {
      expect(validatePackageInput({ name: 'Updated Gold' }, true)).toBeNull();
      expect(validatePackageInput({ price_amount: 500 }, true)).toBeNull();
    });

    it('validates price amounts and rejects negative values', () => {
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', price_amount: -50 }, false)).toBe(
        'Package price cannot be negative.'
      );
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', price_amount: 0 }, false)).toBeNull();
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', price_amount: null }, false)).toBeNull();
    });

    it('validates duration minutes and rejects non-positive values', () => {
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', duration_minutes: 0 }, false)).toBe(
        'Duration must be a positive number of minutes.'
      );
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', duration_minutes: -10 }, false)).toBe(
        'Duration must be a positive number of minutes.'
      );
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', duration_minutes: 60 }, false)).toBeNull();
    });

    it('validates sort order', () => {
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', sort_order: -1 }, false)).toBe(
        'Sort order must be a non-negative number.'
      );
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', sort_order: 2 }, false)).toBeNull();
    });

    it('validates description length', () => {
      const longDesc = 'a'.repeat(2001);
      expect(validatePackageInput({ name: 'Gold', service_id: 'srv-1', description: longDesc }, false)).toBe(
        'Description cannot exceed 2000 characters.'
      );
    });
  });

  describe('normalizeDeliverables', () => {
    it('handles string array', () => {
      expect(normalizeDeliverables(['20 Photos', '1 Photo Book'])).toEqual(['20 Photos', '1 Photo Book']);
    });

    it('handles JSON string of array', () => {
      expect(normalizeDeliverables('["20 Photos", "1 Photo Book"]')).toEqual(['20 Photos', '1 Photo Book']);
    });

    it('handles newline separated string', () => {
      expect(normalizeDeliverables('20 Photos\n1 Photo Book')).toEqual(['20 Photos', '1 Photo Book']);
    });

    it('returns empty array on invalid or empty inputs', () => {
      expect(normalizeDeliverables(null)).toEqual([]);
      expect(normalizeDeliverables('')).toEqual([]);
    });
  });

  describe('createServicePackage', () => {
    it('creates package record with sanitized values and default currency GHS', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'pkg-1',
          service_id: 'srv-1',
          name: 'Executive Headshots',
          slug: 'executive-headshots',
          price_amount: 450,
          currency: 'GHS',
          is_active: true,
          is_featured: true,
        },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const res = await createServicePackage({
        service_id: 'srv-1',
        name: 'Executive Headshots',
        price_amount: 450,
        is_featured: true,
        deliverables: ['10 Retouched Images', '1 Hour Session'],
      });

      expect(res.data).not.toBeNull();
      expect(res.data?.name).toBe('Executive Headshots');
      expect(res.error).toBeNull();
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Executive Headshots',
          slug: 'executive-headshots',
          price_amount: 450,
          currency: 'GHS',
          is_featured: true,
          deliverables: ['10 Retouched Images', '1 Hour Session'],
        }),
      ]);
    });

    it('supports custom quotation packages with null price_amount', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'pkg-2',
          service_id: 'srv-1',
          name: 'Bespoke Campaign',
          price_amount: null,
          currency: 'GHS',
        },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const res = await createServicePackage({
        service_id: 'srv-1',
        name: 'Bespoke Campaign',
        price_amount: null,
      });

      expect(res.data?.price_amount).toBeNull();
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          price_amount: null,
        }),
      ]);
    });

    it('translates duplicate slug error to user-friendly message', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'duplicate key value violates unique constraint "uq_service_package_slug"' },
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const res = await createServicePackage({
        service_id: 'srv-1',
        name: 'Duplicate Package',
      });

      expect(res.data).toBeNull();
      expect(res.error).toBe('A package with this name or slug already exists for the selected service.');
    });
  });

  describe('updateServicePackage', () => {
    it('updates package fields', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: 'pkg-1', name: 'Updated Package', price_amount: 600 },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await updateServicePackage('pkg-1', {
        name: 'Updated Package',
        price_amount: 600,
      });

      expect(res.data?.name).toBe('Updated Package');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Package',
          price_amount: 600,
        })
      );
    });
  });

  describe('togglePackageActive and togglePackageFeatured', () => {
    it('toggles package active status', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await togglePackageActive('pkg-1', false);
      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: false })
      );
    });

    it('toggles package featured status', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await togglePackageFeatured('pkg-1', true);
      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ is_featured: true })
      );
    });
  });

  describe('updatePackageSortOrder and deleteServicePackage', () => {
    it('updates package sort order with positive integer', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await updatePackageSortOrder('pkg-1', 5);
      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 5 })
      );
    });

    it('deletes package record', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        delete: mockDelete,
      } as any);

      const res = await deleteServicePackage('pkg-1');
      expect(res.success).toBe(true);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'pkg-1');
    });
  });

  describe('fetchAllServicePackages and fetchServicePackages', () => {
    it('retrieves all service packages sorted by sort_order and created_at', async () => {
      const mockOrder2 = vi.fn().mockResolvedValue({
        data: [{ id: 'p1', name: 'Pkg 1' }],
        error: null,
      });
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder1 });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const res = await fetchAllServicePackages();
      expect(res.data.length).toBe(1);
      expect(res.error).toBeNull();
    });

    it('fetchServicePackages supports filtering by onlyActive', async () => {
      const mockOrder2 = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 });
      const mockEqActive = vi.fn().mockReturnValue({ order: mockOrder1 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqActive });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      await fetchServicePackages(undefined, true);
      expect(mockEqActive).toHaveBeenCalledWith('is_active', true);
    });
  });
});

