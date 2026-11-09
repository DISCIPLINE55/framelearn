import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  fetchActiveServices,
  fetchAllServices,
  fetchServicePackages,
  toggleServiceActive,
} from '../../src/features/services';
import { ServicesPreviewPage } from '../../src/app/routes/ServicesPreviewPage';
import { supabase } from '../../src/lib/database/supabase';
import * as servicesApi from '../../src/features/services';

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
    it('retrieves service packages sorted by sort_order and created_at', async () => {
      const mockOrder2 = vi.fn().mockResolvedValue({
        data: [
          { id: 'pkg-1', service_id: 's1', name: 'Standard Session', price_amount: 500, currency: 'GHS' },
        ],
        error: null,
      });
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 });

      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({ order: mockOrder1 }),
      } as any);

      const res = await fetchServicePackages();

      expect(res.data.length).toBe(1);
      expect(res.data[0].price_amount).toBe(500);
      expect(res.error).toBeNull();
    });

    it('filters by service_id when provided', async () => {
      const mockOrder2 = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder1 });

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

  describe('Public Services Catalog UI Integration (ServicesPreviewPage)', () => {
    it('renders active services and active packages with deliverables, featured badges, and pricing', async () => {
      vi.spyOn(servicesApi, 'fetchActiveServices').mockResolvedValue({
        data: [
          {
            id: 'srv-1',
            name: 'Portrait Photography',
            slug: 'portrait-photography',
            category: 'Portraiture',
            description: 'Professional portrait studio sessions.',
            icon_name: 'camera',
            cover_image_url: null,
            is_active: true,
            sort_order: 1,
            created_at: '2026-10-20T00:00:00Z',
            updated_at: '2026-10-20T00:00:00Z',
          },
        ],
        error: null,
      });

      vi.spyOn(servicesApi, 'fetchServicePackages').mockResolvedValue({
        data: [
          {
            id: 'pkg-1',
            service_id: 'srv-1',
            name: 'Executive Studio Portrait',
            slug: 'executive-studio-portrait',
            description: 'Professional headshots for executive profiles.',
            price_amount: 850,
            currency: 'GHS',
            duration_minutes: 60,
            deliverables: ['15 Retouched High-Res Photos', 'Private Proofing Gallery'],
            is_featured: true,
            is_active: true,
            sort_order: 1,
            created_at: '2026-10-20T00:00:00Z',
            updated_at: '2026-10-20T00:00:00Z',
          },
          {
            id: 'pkg-2',
            service_id: 'srv-1',
            name: 'Custom Creative Commission',
            slug: 'custom-creative-commission',
            description: 'Bespoke fine art photography.',
            price_amount: null, // Custom quotation
            currency: 'GHS',
            duration_minutes: 120,
            deliverables: ['Custom Art Print'],
            is_featured: false,
            is_active: true,
            sort_order: 2,
            created_at: '2026-10-20T00:00:00Z',
            updated_at: '2026-10-20T00:00:00Z',
          },
          {
            id: 'pkg-3',
            service_id: 'srv-1',
            name: 'Draft Hidden Package',
            slug: 'draft-hidden-package',
            description: 'Not yet available.',
            price_amount: 200,
            currency: 'GHS',
            duration_minutes: 30,
            deliverables: [],
            is_featured: false,
            is_active: false, // Inactive: must never be displayed
            sort_order: 3,
            created_at: '2026-10-20T00:00:00Z',
            updated_at: '2026-10-20T00:00:00Z',
          },
        ],
        error: null,
      });

      render(<ServicesPreviewPage />);

      await waitFor(() => {
        expect(screen.getByText('Portrait Photography')).toBeDefined();
        expect(screen.getByText('Executive Studio Portrait')).toBeDefined();
        expect(screen.getByText('GHS 850')).toBeDefined();
        expect(screen.getByText('15 Retouched High-Res Photos')).toBeDefined();
        expect(screen.getByText('Featured')).toBeDefined();
      });

      // Verify custom quotation displays "Inquire for a Quote"
      expect(screen.getByText('Custom Creative Commission')).toBeDefined();
      expect(screen.getByText('Inquire for a Quote')).toBeDefined();

      // Verify inactive package is not visible
      expect(screen.queryByText('Draft Hidden Package')).toBeNull();

      // Verify null/NaN/0 does not leak
      expect(screen.queryByText('GHS 0')).toBeNull();
      expect(screen.queryByText('null')).toBeNull();
      expect(screen.queryByText('undefined')).toBeNull();
      expect(screen.queryByText('NaN')).toBeNull();
    });
  });
});
