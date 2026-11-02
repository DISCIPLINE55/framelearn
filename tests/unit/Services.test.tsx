import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchActiveServices,
  fetchAllServices,
  fetchServicePackages,
  toggleServiceActive,
} from '../../src/features/services';
import { supabase } from '../../src/lib/database/supabase';

describe('Photography Services and Packages Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchActiveServices', () => {
    it('queries public.services filtered by is_active = true and sorted by sort_order', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          { id: 's1', name: 'Portrait Photography', slug: 'portrait-photography', is_active: true, sort_order: 1 },
          { id: 's2', name: 'Graduation Photography', slug: 'graduation-photography', is_active: true, sort_order: 2 },
        ],
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const res = await fetchActiveServices();

      expect(res.data.length).toBe(2);
      expect(res.error).toBeNull();
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOrder).toHaveBeenCalledWith('sort_order', { ascending: true });
    });

    it('returns empty list and error message when query fails', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Failed to fetch services from database' },
            }),
          }),
        }),
      } as any);

      const res = await fetchActiveServices();

      expect(res.data).toEqual([]);
      expect(res.error).toBe('Failed to fetch services from database');
    });
  });

  describe('fetchAllServices', () => {
    it('retrieves all services for administration without is_active filter', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          { id: 's1', name: 'Portrait Photography', is_active: true, sort_order: 1 },
          { id: 's2', name: 'Special Event', is_active: false, sort_order: 2 },
        ],
        error: null,
      });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({ order: mockOrder }),
      } as any);

      const res = await fetchAllServices();

      expect(res.data.length).toBe(2);
      expect(res.error).toBeNull();
    });
  });

  describe('fetchServicePackages', () => {
    it('retrieves service packages sorted by sort_order', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          { id: 'pkg-1', service_id: 's1', name: 'Standard Session', price_amount: 500, currency: 'GHS' },
        ],
        error: null,
      });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({ order: mockOrder }),
      } as any);

      const res = await fetchServicePackages();

      expect(res.data.length).toBe(1);
      expect(res.data[0].price_amount).toBe(500);
      expect(res.error).toBeNull();
    });

    it('filters by service_id when provided', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      } as any);

      await fetchServicePackages('service-uuid-123');

      expect(mockEq).toHaveBeenCalledWith('service_id', 'service-uuid-123');
    });
  });

  describe('toggleServiceActive', () => {
    it('persists is_active update to PostgreSQL services table', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

      vi.spyOn(supabase, 'from').mockReturnValue({
        update: mockUpdate,
      } as any);

      const res = await toggleServiceActive('service-123', false);

      expect(res.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: false })
      );
      expect(mockEq).toHaveBeenCalledWith('id', 'service-123');
    });

    it('returns error when update fails', async () => {
      vi.spyOn(supabase, 'from').mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Unauthorized permission' },
          }),
        }),
      } as any);

      const res = await toggleServiceActive('service-123', true);

      expect(res.success).toBe(false);
      expect(res.error).toBe('Unauthorized permission');
    });
  });
});

