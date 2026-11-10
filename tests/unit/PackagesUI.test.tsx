import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PackageFormModal } from '../../src/features/dashboard/components/PackageFormModal';
import { PackagesManagement } from '../../src/features/dashboard/components/PackagesManagement';
import { ToastProvider } from '../../src/app/providers/ToastContext';
import { Service, ServicePackage } from '../../src/types/database';
import * as servicesApi from '../../src/features/services';

const mockServices: Service[] = [
  {
    id: 'srv-1',
    name: 'Portrait Photography',
    slug: 'portrait-photography',
    category: 'Portraiture',
    description: 'Professional studio portraits.',
    icon_name: 'camera',
    cover_image_url: null,
    is_active: true,
    sort_order: 1,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'srv-2',
    name: 'Weddings & Celebrations',
    slug: 'weddings-and-events',
    category: 'Events',
    description: 'Full-day wedding photography.',
    icon_name: 'camera',
    cover_image_url: null,
    is_active: true,
    sort_order: 2,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
];

const mockPackages: ServicePackage[] = [
  {
    id: 'pkg-1',
    service_id: 'srv-1',
    name: 'Standard Portrait Session',
    slug: 'standard-portrait-session',
    description: 'Perfect for LinkedIn or personal branding.',
    price_amount: 500,
    currency: 'GHS',
    duration_minutes: 60,
    deliverables: ['10 Edited Photos', 'Online Gallery'],
    is_featured: true,
    is_active: true,
    sort_order: 1,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'pkg-2',
    service_id: 'srv-1',
    name: 'Bespoke Executive Portfolio',
    slug: 'bespoke-executive-portfolio',
    description: 'Tailored on-location executive session.',
    price_amount: null, // Custom quotation
    currency: 'GHS',
    duration_minutes: 180,
    deliverables: ['Full Day Studio Access', 'Hairstyling Support'],
    is_featured: false,
    is_active: true,
    sort_order: 2,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'pkg-3',
    service_id: 'srv-2',
    name: 'Archived Wedding Package',
    slug: 'archived-wedding-package',
    description: 'Inactive package tier.',
    price_amount: 3500,
    currency: 'GHS',
    duration_minutes: 480,
    deliverables: ['Photo Album'],
    is_featured: false,
    is_active: false,
    sort_order: 3,
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
];

describe('PackageFormModal Component', () => {
  it('renders package creation form with all expected fields', () => {
    render(
      <ToastProvider>
        <PackageFormModal
          isOpen={true}
          packageToEdit={null}
          services={mockServices}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </ToastProvider>
    );

    expect(screen.getByRole('heading', { name: /create photography package/i })).toBeDefined();
    expect(screen.getByLabelText(/package name/i)).toBeDefined();
    expect(screen.getByLabelText(/associated photography service/i)).toBeDefined();
    expect(screen.getByLabelText(/price amount/i)).toBeDefined();
    expect(screen.getByLabelText(/custom quotation/i)).toBeDefined();
    expect(screen.getByLabelText(/duration/i)).toBeDefined();
    expect(screen.getByText(/mark as featured package/i)).toBeDefined();
    expect(screen.getByText(/package active/i)).toBeDefined();
  });

  it('validates required fields on submit and displays inline errors', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(true);

    render(
      <ToastProvider>
        <PackageFormModal
          isOpen={true}
          packageToEdit={null}
          services={mockServices}
          onClose={vi.fn()}
          onSubmit={mockSubmit}
        />
      </ToastProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /create package/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/please provide a package name/i)).toBeDefined();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables price amount input when custom quotation checkbox is selected', () => {
    render(
      <ToastProvider>
        <PackageFormModal
          isOpen={true}
          packageToEdit={null}
          services={mockServices}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </ToastProvider>
    );

    const customQuoteCheckbox = screen.getByLabelText(/custom quotation/i);
    const priceInput = screen.getByLabelText(/price amount/i) as HTMLInputElement;

    expect(priceInput.disabled).toBe(false);

    fireEvent.click(customQuoteCheckbox);

    expect(priceInput.disabled).toBe(true);
    expect(priceInput.value).toBe('');
  });

  it('allows adding and removing deliverables dynamically', () => {
    render(
      <ToastProvider>
        <PackageFormModal
          isOpen={true}
          packageToEdit={null}
          services={mockServices}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </ToastProvider>
    );

    const deliverableInput = screen.getByPlaceholderText(/20 high-resolution edited images/i);
    const addBtn = screen.getByRole('button', { name: /^add$/i });

    fireEvent.change(deliverableInput, { target: { value: 'High-Res Digital USB' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('High-Res Digital USB')).toBeDefined();

    // Remove deliverable
    const removeBtn = screen.getByLabelText(/remove deliverable high-res digital usb/i);
    fireEvent.click(removeBtn);

    expect(screen.queryByText('High-Res Digital USB')).toBeNull();
  });

  it('pre-populates fields when packageToEdit is provided', () => {
    render(
      <ToastProvider>
        <PackageFormModal
          isOpen={true}
          packageToEdit={mockPackages[0]}
          services={mockServices}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </ToastProvider>
    );

    expect(screen.getByRole('heading', { name: /edit photography package/i })).toBeDefined();
    expect((screen.getByLabelText(/package name/i) as HTMLInputElement).value).toBe(
      'Standard Portrait Session'
    );
    expect((screen.getByLabelText(/price amount/i) as HTMLInputElement).value).toBe('500');
    expect(screen.getByText('10 Edited Photos')).toBeDefined();
  });
});

describe('PackagesManagement Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders package cards with names, pricing, duration, and status badges', () => {
    render(
      <ToastProvider>
        <PackagesManagement
          packages={mockPackages}
          services={mockServices}
          isLoading={false}
          error={null}
          onRefresh={vi.fn()}
        />
      </ToastProvider>
    );

    expect(screen.getByText('Standard Portrait Session')).toBeDefined();
    expect(screen.getByText('GHS 500')).toBeDefined();
    expect(screen.getByText('Custom Quotation')).toBeDefined();
    expect(screen.getByText('Archived Wedding Package')).toBeDefined();
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hidden').length).toBeGreaterThan(0);
  });

  it('filters packages by status when clicking filter pills', () => {
    render(
      <ToastProvider>
        <PackagesManagement
          packages={mockPackages}
          services={mockServices}
          isLoading={false}
          error={null}
          onRefresh={vi.fn()}
        />
      </ToastProvider>
    );

    // Click 'Hidden' filter
    const hiddenPill = screen.getByLabelText(/filter hidden packages/i);
    fireEvent.click(hiddenPill);

    expect(screen.getByText('Archived Wedding Package')).toBeDefined();
    expect(screen.queryByText('Standard Portrait Session')).toBeNull();

    // Click 'Featured' filter
    const featuredPill = screen.getByLabelText(/filter featured packages/i);
    fireEvent.click(featuredPill);

    expect(screen.getByText('Standard Portrait Session')).toBeDefined();
    expect(screen.queryByText('Archived Wedding Package')).toBeNull();
  });

  it('searches packages by search query text', () => {
    render(
      <ToastProvider>
        <PackagesManagement
          packages={mockPackages}
          services={mockServices}
          isLoading={false}
          error={null}
          onRefresh={vi.fn()}
        />
      </ToastProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search packages or services/i);
    fireEvent.change(searchInput, { target: { value: 'Bespoke' } });

    expect(screen.getByText('Bespoke Executive Portfolio')).toBeDefined();
    expect(screen.queryByText('Standard Portrait Session')).toBeNull();
  });

  it('toggles package active status and calls togglePackageActive API', async () => {
    const mockToggle = vi.spyOn(servicesApi, 'togglePackageActive').mockResolvedValue({
      success: true,
      error: null,
    });
    const mockRefresh = vi.fn();

    render(
      <ToastProvider>
        <PackagesManagement
          packages={mockPackages}
          services={mockServices}
          isLoading={false}
          error={null}
          onRefresh={mockRefresh}
        />
      </ToastProvider>
    );

    // Package 3 is inactive, clicking Activate triggers confirm dialog
    const activateBtn = screen.getByRole('button', { name: /^activate$/i });
    fireEvent.click(activateBtn);

    // Confirm dialog appears
    const confirmBtn = screen.getByRole('button', { name: /activate package/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockToggle).toHaveBeenCalledWith('pkg-3', true);
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('toggles featured status when star icon is clicked', async () => {
    const mockFeatured = vi.spyOn(servicesApi, 'togglePackageFeatured').mockResolvedValue({
      success: true,
      error: null,
    });
    const mockRefresh = vi.fn();

    render(
      <ToastProvider>
        <PackagesManagement
          packages={mockPackages}
          services={mockServices}
          isLoading={false}
          error={null}
          onRefresh={mockRefresh}
        />
      </ToastProvider>
    );

    const starBtn = screen.getByLabelText(/remove featured status/i);
    fireEvent.click(starBtn);

    await waitFor(() => {
      expect(mockFeatured).toHaveBeenCalledWith('pkg-1', false);
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
