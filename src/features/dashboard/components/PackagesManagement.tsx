import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { PackageFormModal } from './PackageFormModal';
import {
  Service,
  ServicePackage,
} from '../../../types/database';
import {
  CreatePackageInput,
  UpdatePackageInput,
  createServicePackage,
  updateServicePackage,
  togglePackageActive,
  togglePackageFeatured,
  deleteServicePackage,
  normalizeDeliverables,
} from '../../services';
import { useToast } from '../../../app/providers/ToastContext';
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Star,
  Clock,
  Check,
  Search,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export interface PackagesManagementProps {
  packages: ServicePackage[] | null;
  services: Service[] | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreateWithService?: string;
}

export const PackagesManagement: React.FC<PackagesManagementProps> = ({
  packages,
  services,
  isLoading,
  error,
  onRefresh,
  onOpenCreateWithService,
}) => {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'FEATURED'>('ALL');

  // Modals & Dialogs
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<ServicePackage | null>(null);
  const [defaultServiceId, setDefaultServiceId] = useState<string | undefined>(onOpenCreateWithService);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status toggle confirmation
  const [toggleDialog, setToggleDialog] = useState<{
    pkg: ServicePackage;
    nextActive: boolean;
  } | null>(null);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<ServicePackage | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Map services for easy lookup
  const servicesMap = useMemo(() => {
    const map = new Map<string, Service>();
    (services || []).forEach((s) => map.set(s.id, s));
    return map;
  }, [services]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return (packages || []).filter((pkg) => {
      // Service filter
      if (selectedServiceFilter !== 'ALL' && pkg.service_id !== selectedServiceFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'ACTIVE' && !pkg.is_active) return false;
      if (statusFilter === 'INACTIVE' && pkg.is_active) return false;
      if (statusFilter === 'FEATURED' && !pkg.is_featured) return false;

      // Search query (name, description, deliverables)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const parentService = servicesMap.get(pkg.service_id);
        const serviceName = parentService ? parentService.name.toLowerCase() : '';
        const nameMatch = pkg.name.toLowerCase().includes(q);
        const descMatch = (pkg.description || '').toLowerCase().includes(q);
        const serviceMatch = serviceName.includes(q);
        return nameMatch || descMatch || serviceMatch;
      }

      return true;
    });
  }, [packages, selectedServiceFilter, statusFilter, searchQuery, servicesMap]);

  const handleOpenAddModal = (serviceId?: string) => {
    setPackageToEdit(null);
    setDefaultServiceId(serviceId || (services && services.length > 0 ? services[0].id : undefined));
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ServicePackage) => {
    setPackageToEdit(pkg);
    setDefaultServiceId(pkg.service_id);
    setIsFormModalOpen(true);
  };

  const handleSavePackage = async (
    payload: CreatePackageInput | UpdatePackageInput,
    packageId?: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (packageId) {
        const res = await updateServicePackage(packageId, payload as UpdatePackageInput);
        if (res.error) {
          toast.error(res.error, { title: 'Update Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully updated.`, {
          title: 'Package Updated',
        });
      } else {
        const res = await createServicePackage(payload as CreatePackageInput);
        if (res.error) {
          toast.error(res.error, { title: 'Creation Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully created and assigned to service.`, {
          title: 'Package Created',
        });
      }
      onRefresh();
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteToggle = async () => {
    if (!toggleDialog) return;
    const { pkg, nextActive } = toggleDialog;
    setIsToggleLoading(true);
    try {
      const res = await togglePackageActive(pkg.id, nextActive);
      if (res.success) {
        toast.success(
          `"${pkg.name}" is now ${nextActive ? 'active on the public catalog' : 'hidden from public view'}.`,
          { title: 'Status Updated' }
        );
        onRefresh();
      } else {
        toast.error(res.error || 'Failed to update package availability.', {
          title: 'Update Failed',
        });
      }
    } finally {
      setIsToggleLoading(false);
      setToggleDialog(null);
    }
  };

  const handleToggleFeatured = async (pkg: ServicePackage) => {
    const nextFeatured = !pkg.is_featured;
    const res = await togglePackageFeatured(pkg.id, nextFeatured);
    if (res.success) {
      toast.success(
        nextFeatured
          ? `"${pkg.name}" is now marked as a featured package.`
          : `"${pkg.name}" is no longer marked as featured.`,
        { title: 'Featured Status Updated' }
      );
      onRefresh();
    } else {
      toast.error(res.error || 'Failed to update featured status.', {
        title: 'Update Failed',
      });
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteDialog) return;
    setIsDeleteLoading(true);
    try {
      const res = await deleteServicePackage(deleteDialog.id);
      if (res.success) {
        toast.success(`"${deleteDialog.name}" was permanently removed.`, {
          title: 'Package Deleted',
        });
        onRefresh();
      } else {
        toast.error(res.error || 'Failed to delete package.', {
          title: 'Delete Failed',
        });
      }
    } finally {
      setIsDeleteLoading(false);
      setDeleteDialog(null);
    }
  };

  const serviceFilterOptions = [
    { value: 'ALL', label: 'All Photography Services' },
    ...(services || []).map((s) => ({
      value: s.id,
      label: s.name,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Filters, and New Package CTA */}
      <div className="bg-white p-4 rounded-frame border-2 border-sage-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search packages or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-navy/60" />}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Select
              options={serviceFilterOptions}
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
            />
          </div>

          <div className="flex items-center rounded-button border border-sage-300 p-0.5 bg-cream/40 text-xs font-bold text-navy">
            <button
              type="button"
              aria-label="Filter all packages"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1.5 rounded ${statusFilter === 'ALL' ? 'bg-navy text-white shadow-xs' : 'hover:bg-cream'}`}
            >
              All
            </button>
            <button
              type="button"
              aria-label="Filter active packages"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-2.5 py-1.5 rounded ${statusFilter === 'ACTIVE' ? 'bg-navy text-white shadow-xs' : 'hover:bg-cream'}`}
            >
              Active
            </button>
            <button
              type="button"
              aria-label="Filter hidden packages"
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-2.5 py-1.5 rounded ${statusFilter === 'INACTIVE' ? 'bg-navy text-white shadow-xs' : 'hover:bg-cream'}`}
            >
              Hidden
            </button>
            <button
              type="button"
              aria-label="Filter featured packages"
              onClick={() => setStatusFilter('FEATURED')}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1 ${statusFilter === 'FEATURED' ? 'bg-navy text-white shadow-xs' : 'hover:bg-cream'}`}
            >
              <Star className="w-3 h-3 fill-current text-sage" />
              Featured
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal()}
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            New Package
          </Button>
        </div>
      </div>

      {/* Package Content */}
      {isLoading && !packages ? (
        <LoadingState
          title="Loading Service Packages"
          message="Retrieving package options, pricing, and deliverables..."
        />
      ) : error ? (
        <Card variant="default" className="p-8 text-center bg-red-50 border-2 border-red-300">
          <p className="text-body font-bold text-red-900 mb-2">Unable to Load Packages</p>
          <p className="text-small text-red-800 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Try Again
          </Button>
        </Card>
      ) : filteredPackages.length === 0 ? (
        <EmptyState
          title={searchQuery || selectedServiceFilter !== 'ALL' || statusFilter !== 'ALL' ? 'No matching packages found' : 'No photography packages created yet'}
          message={
            searchQuery || selectedServiceFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter options to locate packages.'
              : 'Add your first photography package to offer structured tiers to prospective clients.'
          }
          actionLabel="Add Photography Package"
          onAction={() => handleOpenAddModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const parentService = servicesMap.get(pkg.service_id);
            const deliverablesList = normalizeDeliverables(pkg.deliverables);

            return (
              <Card
                key={pkg.id}
                variant="default"
                className={`p-5 bg-white border-2 flex flex-col justify-between shadow-subtle transition-all relative ${
                  pkg.is_featured
                    ? 'border-sage-400 ring-2 ring-sage-200/50'
                    : pkg.is_active
                      ? 'border-sage-200'
                      : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Service Tag & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      {parentService ? (
                        <Badge variant="sage" size="sm" className="font-bold">
                          {parentService.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          Unassigned
                        </Badge>
                      )}

                      <h3 className="text-body font-display font-bold text-navy pt-1 leading-snug">
                        {pkg.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(pkg)}
                        title={pkg.is_featured ? 'Featured (Click to unfeature)' : 'Click to feature'}
                        className={`p-1.5 rounded-full transition-colors ${
                          pkg.is_featured
                            ? 'bg-sage/20 text-navy hover:bg-sage/30'
                            : 'text-gray-400 hover:text-navy hover:bg-cream'
                        }`}
                        aria-label={pkg.is_featured ? 'Remove featured status' : 'Mark as featured'}
                      >
                        <Star className={`w-4 h-4 ${pkg.is_featured ? 'fill-sage text-sage' : ''}`} />
                      </button>

                      <Badge
                        variant={pkg.is_active ? 'navy' : 'outline'}
                        size="sm"
                        className={
                          pkg.is_active
                            ? 'bg-navy text-white text-[11px]'
                            : 'text-gray-600 border-gray-300 bg-gray-50 text-[11px]'
                        }
                      >
                        {pkg.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                    </div>
                  </div>

                  {/* Pricing and Duration Pills */}
                  <div className="p-3 bg-cream/50 rounded-frame border border-sage-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-navy/70 block uppercase tracking-wider">
                        Pricing Tier
                      </span>
                      <span className="text-body font-bold text-navy font-mono">
                        {pkg.price_amount !== null
                          ? `${pkg.currency} ${pkg.price_amount.toLocaleString()}`
                          : 'Custom Quotation'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-navy/70 block uppercase tracking-wider">
                        Session Length
                      </span>
                      <span className="text-xs font-semibold text-navy flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sage" />
                        {pkg.duration_minutes ? `${pkg.duration_minutes} mins` : 'Flexible'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-xs text-navy-800 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>
                  )}

                  {/* Deliverables List Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-sage-200/80">
                    <span className="text-[11px] font-bold text-navy/70 uppercase tracking-wider block flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-sage" />
                      Deliverables ({deliverablesList.length})
                    </span>

                    {deliverablesList.length === 0 ? (
                      <span className="text-xs text-navy/50 italic">None specified</span>
                    ) : (
                      <ul className="space-y-1">
                        {deliverablesList.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="text-xs text-navy flex items-start gap-1.5">
                            <span className="text-sage font-bold">•</span>
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {deliverablesList.length > 3 && (
                          <li className="text-[11px] font-bold text-sage">
                            +{deliverablesList.length - 3} more items...
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-sage-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditModal(pkg)}
                      leftIcon={<Pencil className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      onClick={() => setDeleteDialog(pkg)}
                      className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete package"
                      aria-label={`Delete ${pkg.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pkg.is_active
                        ? setToggleDialog({ pkg, nextActive: false })
                        : setToggleDialog({ pkg, nextActive: true })
                    }
                    className={
                      pkg.is_active
                        ? 'text-navy hover:text-red-700'
                        : 'text-sage-800 hover:text-navy'
                    }
                    leftIcon={
                      pkg.is_active ? (
                        <ToggleRight className="w-4 h-4 text-sage" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                      )
                    }
                  >
                    {pkg.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Package Form Modal */}
      {isFormModalOpen && (
        <PackageFormModal
          isOpen={isFormModalOpen}
          packageToEdit={packageToEdit}
          services={services || []}
          defaultServiceId={defaultServiceId}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleSavePackage}
          isLoading={isSubmitting}
        />
      )}

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(toggleDialog)}
        title={toggleDialog?.nextActive ? 'Activate Photography Package?' : 'Hide Package from Public Catalog?'}
        message={
          toggleDialog?.nextActive
            ? `Making "${toggleDialog?.pkg.name}" active will immediately publish it to visitors viewing its photography discipline on the public website.`
            : `Hiding "${toggleDialog?.pkg.name}" will make it invisible to prospective clients on the public website. Existing inquiries will not be affected.`
        }
        confirmLabel={toggleDialog?.nextActive ? 'Activate Package' : 'Hide Package'}
        cancelLabel="Keep Current Status"
        variant={toggleDialog?.nextActive ? 'primary' : 'danger'}
        isLoading={isToggleLoading}
        onConfirm={handleExecuteToggle}
        onCancel={() => setToggleDialog(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteDialog)}
        title={`Permanently Delete "${deleteDialog?.name}"?`}
        message={`Are you sure you want to delete this photography package? This action removes the package configuration permanently.`}
        confirmLabel="Delete Package"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleteLoading}
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
};
