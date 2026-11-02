import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { ServiceFormModal } from './ServiceFormModal';
import {
  Camera,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  PackageCheck,
} from 'lucide-react';
import { Service, ServicePackage } from '../../../types/database';
import {
  CreateServiceInput,
  UpdateServiceInput,
  createService,
  updateService,
  toggleServiceActive,
  fetchServicePackages,
} from '../../services';
import { useToast } from '../../../app/providers/ToastContext';

export interface ServicesManagementProps {
  services: Service[] | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const ServicesManagement: React.FC<ServicesManagementProps> = ({
  services,
  isLoading,
  error,
  onRefresh,
}) => {
  const { toast } = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Status toggle confirmation dialog
  const [toggleDialog, setToggleDialog] = useState<{
    service: Service;
    nextActive: boolean;
  } | null>(null);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  // Service packages state map: serviceId -> packages
  const [packagesMap, setPackagesMap] = useState<Record<string, ServicePackage[]>>({});

  // Load packages for services
  useEffect(() => {
    let isMounted = true;
    const loadPackages = async () => {
      try {
        const { data } = await fetchServicePackages();
        if (isMounted && data) {
          const map: Record<string, ServicePackage[]> = {};
          data.forEach((pkg) => {
            if (!map[pkg.service_id]) {
              map[pkg.service_id] = [];
            }
            map[pkg.service_id].push(pkg);
          });
          setPackagesMap(map);
        }
      } catch {
        // Soft error for optional packages display
      }
    };

    loadPackages();
    return () => {
      isMounted = false;
    };
  }, [services]);

  const handleOpenAddModal = () => {
    setServiceToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setServiceToEdit(service);
    setIsFormModalOpen(true);
  };

  const handleSaveService = async (
    payload: CreateServiceInput | UpdateServiceInput,
    serviceId?: string
  ): Promise<boolean> => {
    setIsFormSubmitting(true);
    try {
      if (serviceId) {
        // Update existing service
        const res = await updateService(serviceId, payload as UpdateServiceInput);
        if (res.error) {
          toast.error(res.error, { title: 'Update Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully updated.`, {
          title: 'Service Updated',
        });
      } else {
        // Create new service
        const res = await createService(payload as CreateServiceInput);
        if (res.error) {
          toast.error(res.error, { title: 'Creation Failed' });
          return false;
        }
        toast.success(`"${payload.name}" was successfully created and added to the studio catalog.`, {
          title: 'Service Created',
        });
      }
      onRefresh();
      return true;
    } finally {
      setIsFormSubmitting(false);
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
        onRefresh();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-display font-bold text-navy">
            Photography Services
          </h1>
          <p className="text-small text-navy-800 mt-1">
            Manage your studio offerings, customize descriptions, and control public catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Add New Service
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading && !services ? (
        <LoadingState
          title="Loading Photography Services"
          message="Retrieving studio disciplines and package offerings..."
        />
      ) : error ? (
        <Card variant="default" className="p-8 text-center bg-red-50 border-2 border-red-300">
          <p className="text-body font-bold text-red-900 mb-2">Unable to Load Services</p>
          <p className="text-small text-red-800 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Try Again
          </Button>
        </Card>
      ) : !services || services.length === 0 ? (
        <EmptyState
          title="No photography services found"
          message="Define your first studio offering to showcase your work to prospective clients."
          actionLabel="Add Your First Service"
          onAction={handleOpenAddModal}
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
                  {packages.length > 0 && (
                    <div className="pt-3 border-t border-sage-200 space-y-2">
                      <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block flex items-center gap-1.5">
                        <PackageCheck className="w-3.5 h-3.5 text-sage" />
                        Available Packages ({packages.length})
                      </span>
                      <div className="space-y-1.5">
                        {packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="p-2.5 rounded bg-cream/40 border border-sage-200/80 flex items-center justify-between text-xs font-medium text-navy"
                          >
                            <span className="font-bold">{pkg.name}</span>
                            <div className="flex items-center gap-2">
                              {pkg.price_amount !== null && (
                                <span className="font-bold text-navy">
                                  {pkg.currency} {pkg.price_amount}
                                </span>
                              )}
                              {pkg.duration_minutes && (
                                <span className="text-navy/60">
                                  • {pkg.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-4 border-t border-sage-200 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(service)}
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

      {/* Service Add/Edit Modal */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        serviceToEdit={serviceToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveService}
        isLoading={isFormSubmitting}
      />

      {/* Activate / Deactivate Confirmation Dialog */}
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

