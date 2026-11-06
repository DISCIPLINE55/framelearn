import React, { useState, useEffect, useCallback } from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useToast } from '../providers/ToastContext';
import {
  fetchAllServices,
  createService,
  CreateServiceInput,
} from '../../features/services';
import {
  fetchBookingRequests,
  updateBookingStatus,
  BookingRequestWithService,
} from '../../features/bookings';
import { ProfileManagementCard } from '../../features/profile';
import { Service, BookingStatus } from '../../types/database';
import {
  DashboardSidebar,
  DashboardTopBar,
  DashboardOverview,
  BookingsManagement,
  ServicesManagement,
  ServiceFormModal,
  DashboardTab,
} from '../../features/dashboard';

const PhotographerPortalContent: React.FC = () => {
  const { user, profile, signOut, isConfigured, isProfileLoading, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Live services state
  const [services, setServices] = useState<Service[] | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Live booking requests state
  const [bookings, setBookings] = useState<BookingRequestWithService[] | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Load Services from Supabase
  const loadServices = useCallback(async () => {
    if (!isConfigured) return;
    setServicesLoading(true);
    setServicesError(null);
    try {
      const { data, error } = await fetchAllServices();
      if (error) {
        setServicesError(error);
        setServices(null);
      } else {
        setServices(data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to query services.';
      setServicesError(msg);
      setServices(null);
    } finally {
      setServicesLoading(false);
    }
  }, [isConfigured]);

  // Load Bookings from Supabase
  const loadBookings = useCallback(async () => {
    if (!isConfigured) return;
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const { data, error } = await fetchBookingRequests();
      if (error) {
        setBookingsError(error);
        setBookings(null);
      } else {
        setBookings(data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to query booking inquiries.';
      setBookingsError(msg);
      setBookings(null);
    } finally {
      setBookingsLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    if (isConfigured) {
      loadServices();
      loadBookings();
    }
  }, [isConfigured, loadServices, loadBookings]);

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (
    bookingId: string,
    toStatus: BookingStatus,
    fromStatus: BookingStatus
  ) => {
    const res = await updateBookingStatus(bookingId, toStatus, fromStatus);
    if (res.success) {
      toast.success(`Booking status successfully transitioned to "${toStatus.replace('_', ' ')}".`, {
        title: 'Status Updated',
      });
      loadBookings();
    } else {
      toast.error(res.error || 'Failed to update booking status.', {
        title: 'Update Failed',
      });
    }
  };

  // Handle Direct Service Creation from Quick Action
  const handleCreateNewService = async (payload: any): Promise<boolean> => {
    setIsCreatingService(true);
    try {
      const res = await createService(payload as CreateServiceInput);
      if (res.error) {
        toast.error(res.error, { title: 'Service Creation Failed' });
        return false;
      }
      toast.success(`"${payload.name}" was successfully added to studio offerings.`, {
        title: 'Service Created',
      });
      loadServices();
      setIsNewServiceModalOpen(false);
      return true;
    } finally {
      setIsCreatingService(false);
    }
  };

  // Handle Session Termination
  const handleConfirmLogout = async () => {
    setIsLogoutDialogOpen(false);
    await signOut();
    toast.info('You have signed out of the photographer portal.', {
      title: 'Session Ended',
    });
    window.location.hash = '#home';
  };

  // Handle Unified Dashboard Refresh (Refreshes bookings, services, and profile)
  const handleRefreshDashboard = useCallback(async () => {
    await Promise.all([
      loadBookings(),
      loadServices(),
      refreshProfile(),
    ]);
  }, [loadBookings, loadServices, refreshProfile]);

  const photographerName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'Photographer');
  const photographerEmail = profile?.email || user?.email || '';
  const photographerPhone = profile?.phone || null;
  const pendingCount =
    bookings?.filter((b) => b.status === 'submitted' || b.status === 'under_review').length ?? 0;
  const activeServicesCount = services?.filter((s) => s.is_active).length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-navy">
      {/* Desktop Persistent Sidebar & Mobile Drawer Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedBookingId(null);
        }}
        pendingBookingsCount={pendingCount}
        activeServicesCount={activeServicesCount}
        photographerName={photographerName}
        photographerEmail={photographerEmail}
        onLogout={() => setIsLogoutDialogOpen(true)}
        onAddNewService={() => setIsNewServiceModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar Navigation */}
        <DashboardTopBar
          activeTab={activeTab}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onLogout={() => setIsLogoutDialogOpen(true)}
          onRefresh={handleRefreshDashboard}
          isRefreshing={bookingsLoading || servicesLoading || isProfileLoading}
          photographerName={photographerName}
          photographerEmail={photographerEmail}
        />

        {/* Dynamic Section Content */}
        <main
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
          role="region"
          aria-label="Dashboard Workspace"
        >
          {activeTab === 'overview' && (
            <DashboardOverview
              photographerName={photographerName}
              photographerPhone={photographerPhone}
              photographerEmail={photographerEmail}
              bookings={bookings}
              services={services}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setSelectedBookingId(null);
              }}
              onSelectBooking={(booking) => {
                setSelectedBookingId(booking.id);
                setActiveTab('bookings');
              }}
              onAddNewService={() => setIsNewServiceModalOpen(true)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsManagement
              bookings={bookings}
              isLoading={bookingsLoading}
              error={bookingsError}
              onRefresh={loadBookings}
              onUpdateStatus={handleUpdateBookingStatus}
              selectedBookingId={selectedBookingId}
            />
          )}

          {activeTab === 'services' && (
            <ServicesManagement
              services={services}
              isLoading={servicesLoading}
              error={servicesError}
              onRefresh={loadServices}
            />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-h2 font-display font-bold text-navy">
                  My Profile
                </h1>
                <p className="text-small text-navy-800 mt-1">
                  Manage your public photographer profile, studio contact information, and account details.
                </p>
              </div>
              <ProfileManagementCard />
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Service Modal */}
      <ServiceFormModal
        isOpen={isNewServiceModalOpen}
        serviceToEdit={null}
        onClose={() => setIsNewServiceModalOpen(false)}
        onSubmit={handleCreateNewService}
        isLoading={isCreatingService}
      />

      {/* Confirmation Dialog for Session Termination */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Confirm Session Termination"
        message="Are you sure you want to log out of the photographer portal? You will need your credentials to sign back in."
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        variant="warning"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  );
};

export const PhotographerPortalPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <PhotographerPortalContent />
    </ProtectedRoute>
  );
};
