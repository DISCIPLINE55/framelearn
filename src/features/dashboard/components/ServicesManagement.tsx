import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { ServiceFormModal } from './ServiceFormModal';
import { PackageFormModal } from './PackageFormModal';
import { PackagesManagement } from './PackagesManagement';
import {
  Camera,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  PackageCheck,
  Package as PackageIcon,
  Star,
} from 'lucide-react';
import { Service, ServicePackage } from '../../../types/database';
import {
  CreateServiceInput,
  UpdateServiceInput,
  createService,
  updateService,
  toggleServiceActive,
  fetchAllServicePackages,
  createServicePackage,
  updateServicePackage,
  CreatePackageInput,
  UpdatePackageInput,
} from '../../services';
import { useToast } from '../../../app/providers/ToastContext';

export interface ServicesManagementProps {
  services: Service[] | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  initialSubTab?: 'services' | 'packages';
}

export const ServicesManagement: React.FC<ServicesManagementProps> = ({
  services,
  isLoading,
  error,
  onRefresh,
  initialSubTab = 'services',
}) => {
  const { toast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'packages'>(initialSubTab);

  // Service form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Status toggle confirmation dialog
  const [toggleDialog, setToggleDialog] = useState<{
    service: Service;
    nextActive: boolean;
  } | null>(null);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  // All Packages state
  const [allPackages, setAllPackages] = useState<ServicePackage[] | null>(null);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packagesError, setPackagesError] = useState<string | null>(null);

  // Quick Package modal from service card
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<ServicePackage | null>(null);
  const [defaultServiceId, setDefaultServiceId] = useState<string | undefined>(undefined);
  const [isPackageSubmitting, setIsPackageSubmitting] = useState(false);

  // Load packages
  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    setPackagesError(null);
    try {
      const { data, error: pkgErr } = await fetchAllServicePackages();
      if (pkgErr) {
        setPackagesError(pkgErr);
        setAllPackages([]);
      } else {
        setAllPackages(data || []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to query packages.';
      setPackagesError(msg);
      setAllPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Packages map: serviceId -> packages
  const packagesMap = React.useMemo(() => {
    const map: Record<string, ServicePackage[]> = {};
    (allPackages || []).forEach((pkg) => {
      if (!map[pkg.service_id]) {
        map[pkg.service_id] = [];
      }
      map[pkg.service_id].push(pkg);
    });
    return map;
  }, [allPackages]);

  const handleRefreshAll = () => {
    onRefresh();
    loadPackages();
  };

  const handleOpenAddServiceModal = () => {
    setServiceToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditServiceModal = (service: Service) => {
    setServiceToEdit(service);
    setIsFormModalOpen(true);
  };

  const handleOpenAddPackageForService = (serviceId: string) => {
    setPackageToEdit(null);
    setDefaultServiceId(serviceId);
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackageFromCard = (pkg: ServicePackage) => {
    setPackageToEdit(pkg);
    setDefaultServiceId(pkg.service_id);
    setIsPackageModalOpen(true);
  };

  const handleSaveService = async (
    payload: CreateServiceInput | UpdateServiceInput,
    serviceId?: string
  ): Promise<boolean> => {
    setIsFormSubmitting(true);
    try {
      if (serviceId) {
        const res = await updateService(serviceId, payload as UpdateServiceInput);
        if (res.error) {
          toast.error(res.error, { title: 'Update Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully updated.`, {
          title: 'Service Updated',
        });
      } else {
        const res = await createService(payload as CreateServiceInput);
        if (res.error) {
          toast.error(res.error, { title: 'Creation Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully created and added to the studio catalog.`, {
          title: 'Service Created',
        });
      }
      handleRefreshAll();
      return true;
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleSavePackageFromModal = async (
    payload: CreatePackageInput | UpdatePackageInput,
    pkgId?: string
  ): Promise<boolean> => {
    setIsPackageSubmitting(true);
    try {
      if (pkgId) {
        const res = await updateServicePackage(pkgId, payload as UpdatePackageInput);
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
        toast.success(`"${payload.name}" was created successfully.`, {
          title: 'Package Created',
        });
      }
      loadPackages();
      return true;
    } finally {
      setIsPackageSubmitting(false);
    }
  };

  const handleExecuteToggle = async () => {
    if (!toggleDialog) return;
    const { service, nextActive } = toggleDialog;
    setIsToggleLoading(true);
    try {
      const res = await toggleServiceActive(service.id, nextActive);
      if (res.success) {
        toast.success(
          `"${service.name}" is now ${nextActive ? 'active on the public catalog' : 'hidden from public view'}.`,
          { title: 'Status Updated' }
        );
        handleRefreshAll();
      } else {
        toast.error(res.error || 'Failed to update service status.', {
          title: 'Status Update Failed',
        });
      }
    } finally {
      setIsToggleLoading(false);
      setToggleDialog(null);
    }
  };

  const servicesCount = services ? services.length : 0;
  const packagesCount = allPackages ? allPackages.length : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-display font-bold text-navy">
            Photography Services
          </h1>
          <p className="text-small text-navy-800 mt-1">
            Manage your studio offerings, package pricing, deliverables, and public catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            isLoading={isLoading || packagesLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>

          {activeSubTab === 'services' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddServiceModal}
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            >
              Add New Service
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPackageToEdit(null);
                setDefaultServiceId(services && services.length > 0 ? services[0].id : undefined);
                setIsPackageModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            >
              Add New Package
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="border-b border-sage-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('services')}
            className={`pb-3 px-3 text-body font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeSubTab === 'services'
                ? 'border-navy text-navy'
                : 'border-transparent text-navy/60 hover:text-navy hover:border-sage-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photography Services</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cream text-navy font-bold border border-sage-300">
              {servicesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('packages')}
            className={`pb-3 px-3 text-body font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeSubTab === 'packages'
                ? 'border-navy text-navy'
                : 'border-transparent text-navy/60 hover:text-navy hover:border-sage-300'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Packages & Pricing</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sage/20 text-navy font-bold border border-sage/40">
              {packagesCount}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Photography Services Catalog */}
      {activeSubTab === 'services' && (
        <>
          {isLoading && !services ? (
            <LoadingState
              title="Loading Photography Services"
              message="Retrieving studio disciplines and package offerings..."
            />
          ) : error ? (
            <Card variant="default" className="p-8 text-center bg-red-50 border-2 border-red-300">
              <p className="text-body font-bold text-red-900 mb-2">Unable to Load Services</p>
              <p className="text-small text-red-800 mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefreshAll}>
                Try Again
              </Button>
            </Card>
          ) : !services || services.length === 0 ? (
            <EmptyState
              title="No photography services found"
              message="Define your first studio offering to showcase your work to prospective clients."
              actionLabel="Add Your First Service"
              onAction={handleOpenAddServiceModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => {
                const packages = packagesMap[service.id] || [];

                return (
                  <Card
                    key={service.id}
                    variant="default"
                    className={`p-6 bg-white border-2 flex flex-col justify-between shadow-subtle transition-all ${
                      service.is_active ? 'border-sage-300' : 'border-gray-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="sage" size="sm">
                              {service.category}
                            </Badge>
                            <Badge
                              variant={service.is_active ? 'navy' : 'outline'}
                              size="sm"
                              className={
                                service.is_active
                                  ? 'bg-navy text-white'
                                  : 'text-gray-600 border-gray-300 bg-gray-50'
                              }
                            >
                              {service.is_active ? 'Public Catalog' : 'Hidden'}
                            </Badge>
                          </div>
                          <h3 className="text-h3 font-display font-bold text-navy pt-1">
                            {service.name}
                          </h3>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-cream text-navy flex items-center justify-center flex-shrink-0 border border-sage-200">
                          <Camera className="w-5 h-5 stroke-[2.2]" />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-small text-navy-800 leading-relaxed font-medium">
                        {service.description}
                      </p>

                      {/* Available Packages */}
                      <div className="pt-3 border-t border-sage-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
                            <PackageCheck className="w-3.5 h-3.5 text-sage" />
                            Tiered Packages ({packages.length})
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenAddPackageForService(service.id)}
                            className="text-xs font-bold text-sage hover:text-navy flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            Add Package
                          </button>
                        </div>

                        {packages.length === 0 ? (
                          <div className="p-3 rounded bg-cream/30 border border-dashed border-sage-300 text-xs text-navy/70 text-center">
                            No packages configured yet.{' '}
                            <button
                              type="button"
                              onClick={() => handleOpenAddPackageForService(service.id)}
                              className="font-bold text-navy underline hover:text-sage"
                            >
                              Create package
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {packages.map((pkg) => (
                              <div
                                key={pkg.id}
                                className="p-2.5 rounded bg-cream/40 border border-sage-200/80 flex items-center justify-between text-xs font-medium text-navy hover:bg-cream/70 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {pkg.is_featured && (
                                    <Star className="w-3.5 h-3.5 fill-sage text-sage flex-shrink-0" />
                                  )}
                                  <span className="font-bold truncate">{pkg.name}</span>
                                  {!pkg.is_active && (
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.2 rounded border border-gray-200">
                                      Hidden
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <span className="font-bold font-mono text-navy">
                                    {pkg.price_amount !== null
                                      ? `${pkg.currency} ${pkg.price_amount}`
                                      : 'Custom Quote'}
                                  </span>

                                  {pkg.duration_minutes && (
                                    <span className="text-navy/60 hidden sm:inline">
                                      • {pkg.duration_minutes}m
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditPackageFromCard(pkg)}
                                    className="p-1 hover:text-sage text-navy/70 rounded"
                                    title="Edit package"
                                    aria-label={`Edit ${pkg.name}`}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-5 mt-4 border-t border-sage-200 flex items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditServiceModal(service)}
                        leftIcon={<Pencil className="w-3.5 h-3.5" />}
                      >
                        Edit Service
                      </Button>

                      <Button
                        variant={service.is_active ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() =>
                          setToggleDialog({
                            service,
                            nextActive: !service.is_active,
                          })
                        }
                        leftIcon={
                          service.is_active ? (
                            <ToggleLeft className="w-4 h-4 text-amber-600" />
                          ) : (
                            <ToggleRight className="w-4 h-4 text-navy" />
                          )
                        }
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Sub-Tab 2: Packages & Pricing Comprehensive View */}
      {activeSubTab === 'packages' && (
        <PackagesManagement
          packages={allPackages}
          services={services}
          isLoading={packagesLoading}
          error={packagesError}
          onRefresh={loadPackages}
        />
      )}

      {/* Service Add/Edit Modal */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        serviceToEdit={serviceToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveService}
        isLoading={isFormSubmitting}
      />

      {/* Package Form Modal (from Card or Top Bar) */}
      {isPackageModalOpen && (
        <PackageFormModal
          isOpen={isPackageModalOpen}
          packageToEdit={packageToEdit}
          services={services || []}
          defaultServiceId={defaultServiceId}
          onClose={() => setIsPackageModalOpen(false)}
          onSubmit={handleSavePackageFromModal}
          isLoading={isPackageSubmitting}
        />
      )}

      {/* Activate / Deactivate Service Confirmation Dialog */}
      {toggleDialog && (
        <ConfirmDialog
          isOpen={true}
          title={`${toggleDialog.nextActive ? 'Activate' : 'Deactivate'} Service`}
          message={
            toggleDialog.nextActive
              ? `Make "${toggleDialog.service.name}" active? It will immediately appear on the public website catalog for clients to browse and book.`
              : `Deactivate "${toggleDialog.service.name}"? It will be hidden from the public website catalog. Existing booking inquiries will remain intact.`
          }
          confirmLabel={toggleDialog.nextActive ? 'Activate Service' : 'Deactivate Service'}
          cancelLabel="Keep Unchanged"
          variant={toggleDialog.nextActive ? 'primary' : 'warning'}
          isLoading={isToggleLoading}
          onConfirm={handleExecuteToggle}
          onCancel={() => setToggleDialog(null)}
        />
      )}
    </div>
  );
};
