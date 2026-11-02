import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '../../components/layout/Container';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useToast } from '../providers/ToastContext';
import { fetchAllServices } from '../../features/services';
import {
  fetchBookingRequests,
  updateBookingStatus,
  BookingRequestWithService,
} from '../../features/bookings';
import { ProfileManagementCard } from '../../features/profile';
import { Service, BookingStatus } from '../../types/database';
import {
  DashboardSidebar,
  DashboardOverview,
  BookingsManagement,
  ServicesManagement,
  DashboardTab,
} from '../../features/dashboard';
import { Menu, Camera, LogOut } from 'lucide-react';

const PhotographerPortalContent: React.FC = () => {
  const { user, profile, signOut, isConfigured } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
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

  // Handle Session Termination
  const handleConfirmLogout = async () => {
    setIsLogoutDialogOpen(false);
    await signOut();
    toast.info('You have been logged out of the photographer portal.', {
      title: 'Session Ended',
    });
    window.location.hash = '#home';
  };

  const photographerName = profile?.full_name || 'Arafat Nabuku Jansu';
  const photographerEmail = profile?.email || user?.email || 'framelearn28@gmail.com';
  const pendingCount =
    bookings?.filter((b) => b.status === 'submitted' || b.status === 'under_review').length ?? 0;

  return (
    <div className="min-h-[800px] flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
      {/* Mobile Top App Bar */}
      <div className="w-full md:hidden flex items-center justify-between p-4 bg-navy text-white rounded-frame shadow-elevated">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 text-white hover:bg-navy-800 rounded-frame focus:outline-none focus:ring-2 focus:ring-sage"
            aria-label="Open Studio Navigation Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sage" />
            <span className="font-display font-bold text-white text-small">
              FrameLearn Studio
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLogoutDialogOpen(true)}
          className="p-2 text-white/80 hover:text-white rounded hover:bg-navy-800 text-xs font-semibold flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4 text-sage" />
          <span>Exit</span>
        </button>
      </div>

      {/* Dashboard Sidebar (Desktop Persistent & Mobile Drawer) */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedBookingId(null);
        }}
        pendingBookingsCount={pendingCount}
        photographerName={photographerName}
        photographerEmail={photographerEmail}
        onLogout={() => setIsLogoutDialogOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Management Workspace */}
      <main className="flex-1 w-full min-w-0" role="region" aria-label="Dashboard Workspace">
        {activeTab === 'overview' && (
          <DashboardOverview
            photographerName={photographerName}
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
    <Container size="lg" className="py-6 sm:py-10">
      <ProtectedRoute>
        <PhotographerPortalContent />
      </ProtectedRoute>
    </Container>
  );
};
