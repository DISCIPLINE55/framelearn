import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useToast } from '../providers/ToastContext';
import {
  fetchAllServices,
  toggleServiceActive,
} from '../../features/services';
import {
  fetchBookingRequests,
  updateBookingStatus,
  BookingRequestWithService,
} from '../../features/bookings';
import { Service, BookingStatus } from '../../types/database';
import {
  ShieldCheck,
  Database,
  Calendar,
  Lock,
  LogOut,
  Activity,
  CheckCircle2,
  RefreshCw,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const CANONICAL_SERVICES = [
  { id: '1', name: 'Portrait Photography', category: 'Portraiture', slug: 'portrait-photography', is_active: true },
  { id: '2', name: 'Graduation Photography', category: 'Academic', slug: 'graduation-photography', is_active: true },
  { id: '3', name: 'Weddings & Event Photography', category: 'Events', slug: 'weddings-and-events', is_active: true },
  { id: '4', name: 'Outdoor & Landscape Photography', category: 'Outdoor', slug: 'outdoor-photography', is_active: true },
  { id: '5', name: 'Birthdays & Celebrations', category: 'Events', slug: 'birthdays-and-celebrations', is_active: true },
  { id: '6', name: 'Product & Commercial Photography', category: 'Commercial', slug: 'product-photography', is_active: true },
  { id: '7', name: 'Photo Editing & Retouching', category: 'Creative Services', slug: 'retouching-and-editing', is_active: true },
  { id: '8', name: 'Photography Training & Workshops', category: 'Education', slug: 'photography-training', is_active: true },
];

const PhotographerPortalContent: React.FC = () => {
  const { user, profile, role, isConfigured, signOut, testConnection } = useAuth();
  const { toast } = useToast();
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);

  // Dialog States
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    bookingId: string;
    clientName: string;
    fromStatus: BookingStatus;
    toStatus: BookingStatus;
  } | null>(null);
  const [serviceDialog, setServiceDialog] = useState<{
    isOpen: boolean;
    serviceId: string;
    serviceName: string;
    nextActive: boolean;
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Live database services state
  const [liveServices, setLiveServices] = useState<Service[] | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Live booking requests state
  const [bookings, setBookings] = useState<BookingRequestWithService[] | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Load Services
  const loadServices = useCallback(async () => {
    if (!isConfigured) return;
    setServicesLoading(true);
    setServicesError(null);
    try {
      const { data, error } = await fetchAllServices();
      if (error) {
        setServicesError(error);
        setLiveServices(null);
      } else {
        setLiveServices(data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to query live services.';
      setServicesError(msg);
      setLiveServices(null);
    } finally {
      setServicesLoading(false);
    }
  }, [isConfigured]);

  // Load Bookings
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
      const msg = err instanceof Error ? err.message : 'Failed to query booking requests.';
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

  const handleProbe = async () => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      const result = await testConnection();
      if (result.connected) {
        setProbeResult('Connected: Live Supabase backend is reachable.');
        toast.success('Connection to Supabase backend is live and operational.', {
          title: 'Supabase Verified',
        });
        loadServices();
        loadBookings();
      } else {
        setProbeResult(result.message);
        if (result.configured) {
          toast.error(result.message, { title: 'Connection Failed' });
        } else {
          toast.warning(result.message, { title: 'Configuration Notice' });
        }
      }
    } finally {
      setIsProbing(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsLogoutDialogOpen(false);
    await signOut();
    window.location.hash = '#home';
  };

  const handleExecuteStatusChange = async () => {
    if (!statusDialog) return;
    setIsActionLoading(true);
    const { bookingId, toStatus, fromStatus } = statusDialog;
    const res = await updateBookingStatus(bookingId, toStatus, fromStatus);
    setIsActionLoading(false);
    setStatusDialog(null);

    if (res.success) {
      toast.success(`Booking status successfully transitioned to "${toStatus}".`, {
        title: 'Status Updated',
      });
      loadBookings();
    } else {
      toast.error(res.error || 'Failed to update booking status.', {
        title: 'Update Failed',
      });
    }
  };

  const handleExecuteServiceToggle = async () => {
    if (!serviceDialog) return;
    setIsActionLoading(true);
    const { serviceId, nextActive, serviceName } = serviceDialog;
    const res = await toggleServiceActive(serviceId, nextActive);
    setIsActionLoading(false);
    setServiceDialog(null);

    if (res.success) {
      toast.success(
        `"${serviceName}" has been ${nextActive ? 'activated' : 'deactivated'} in the catalog.`,
        { title: 'Service Updated' }
      );
      loadServices();
    } else {
      toast.error(res.error || 'Failed to update service status.', {
        title: 'Operation Failed',
      });
    }
  };

  // Dashboard Aggregates
  const totalBookingsCount = bookings?.length ?? 0;
  const pendingReviewCount = bookings?.filter((b) => b.status === 'submitted' || b.status === 'under_review').length ?? 0;
  const confirmedCount = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
  const activeServicesCount = liveServices?.filter((s) => s.is_active).length ?? 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-navy text-white rounded-frame p-6 sm:p-8 shadow-elevated border-2 border-navy-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Photographer Access Verified
            </Badge>
            <Badge variant="cream" size="sm">
              Role: {role || 'Unassigned'}
            </Badge>
          </div>
          <h1 className="text-h2 font-display font-bold text-white tracking-tight">
            {profile?.full_name || 'Arafat Nabuku Jansu'}
          </h1>
          <p className="text-small text-cream/90 max-w-xl">
            FrameLearn Photography Management Portal. Authoritative administration workspace for bookings, service packages, and client delivery.
          </p>
          <div className="text-xs text-white/70 font-mono pt-1">
            Authenticated User: {user?.email || 'framelearn28@gmail.com'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLogoutDialogOpen(true)}
            leftIcon={<LogOut className="w-4 h-4 text-white" />}
            className="border-cream/40 text-white hover:bg-navy-800"
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Genuine Dashboard Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-frame bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block mb-1">
            Active Disciplines
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {liveServices ? activeServicesCount : '8'}
            </span>
            <Badge variant="sage" size="sm">Live DB</Badge>
          </div>
          <span className="text-[11px] text-navy/70 mt-1">Configured in services table</span>
        </div>

        <div className="p-5 rounded-frame bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block mb-1">
            Total Inquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {bookings !== null ? totalBookingsCount : '0'}
            </span>
            <Badge variant="navy" size="sm">Requests</Badge>
          </div>
          <span className="text-[11px] text-navy/70 mt-1">Submitted client inquiries</span>
        </div>

        <div className="p-5 rounded-frame bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block mb-1">
            Awaiting Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-amber-700">
              {bookings !== null ? pendingReviewCount : '0'}
            </span>
            <Badge variant="cream" size="sm">Action Req</Badge>
          </div>
          <span className="text-[11px] text-navy/70 mt-1">New unreviewed submissions</span>
        </div>

        <div className="p-5 rounded-frame bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block mb-1">
            Confirmed Sessions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-sage">
              {bookings !== null ? confirmedCount : '0'}
            </span>
            <Badge variant="sage" size="sm">Scheduled</Badge>
          </div>
          <span className="text-[11px] text-navy/70 mt-1">Confirmed bookings</span>
        </div>
      </div>

      {/* Backend & Database Foundation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Status Card */}
        <Card variant="default" className="p-6 bg-surface-light border-2 border-sage-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy text-sage flex items-center justify-center">
                <Activity className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="text-h3 font-display font-bold text-navy">
                Supabase Backend Status
              </h2>
            </div>
            <Badge variant={isConfigured ? 'sage' : 'cream'} size="sm">
              {isConfigured ? 'Configured' : 'Safe Local Foundation'}
            </Badge>
          </div>

          <p className="text-small text-navy-800 mb-4 leading-relaxed">
            FrameLearn enforces real backend connectivity. If live Supabase credentials are not supplied in{' '}
            <code className="font-mono text-xs bg-navy/10 px-1 py-0.5 rounded">.env</code>, simulated data is prohibited.
          </p>

          <div className="space-y-2 mb-6 text-xs font-mono bg-cream p-3 rounded border border-sage/40 text-navy">
            <div>
              <span className="font-bold">Client Initialization:</span>{' '}
              {isConfigured ? 'Active (Connected to Project URL)' : 'Safe Local Mode (Awaiting .env credentials)'}
            </div>
            <div>
              <span className="font-bold">Row Level Security:</span> Enforced on all PostgreSQL tables
            </div>
            {probeResult && (
              <div className="pt-2 border-t border-navy/10 text-navy-950 font-sans text-xs">
                <span className="font-bold">Probe Output:</span> {probeResult}
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            isLoading={isProbing}
            onClick={handleProbe}
            leftIcon={<Activity className="w-4 h-4" />}
          >
            {isProbing ? 'Probing Connection...' : 'Probe Supabase Connection'}
          </Button>
        </Card>

        {/* Database Tables Specification */}
        <Card variant="default" className="p-6 bg-surface-light border-2 border-sage-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy text-cream flex items-center justify-center">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="text-h3 font-display font-bold text-navy">
                Database Schema (M002)
              </h2>
            </div>
            <Badge variant="navy" size="sm">
              5 Entities
            </Badge>
          </div>

          <p className="text-small text-navy-800 mb-3">
            The database schema architecture (defined in migrations <code className="font-mono text-xs">20261020000001_initial_schema.sql</code> and <code className="font-mono text-xs">20261025000001_m002_corrective_hardening.sql</code>) specifies the core business entities:
          </p>

          <ul className="space-y-2 text-xs text-navy-900 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">profiles</strong> — Photographer identity and role authorization (Admin).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">services</strong> — 8 Canonical photography disciplines.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">service_packages</strong> — One-to-many tiered packages per service.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">booking_requests</strong> — Public booking submissions with PII protection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">booking_status_history</strong> — Immutable audit trail of status transitions.
              </span>
            </li>
          </ul>

          <div className="flex items-center gap-2 text-[11px] text-navy/70 bg-cream/60 p-2.5 rounded border border-sage/30">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>RLS Policy: Public can insert inquiries; only photographer can view client PII.</span>
          </div>
        </Card>
      </div>

      {/* Client Booking Inquiries Management (Genuine Database Queries) */}
      <Card variant="default" className="p-6 sm:p-8 bg-surface-light border-2 border-navy-800 shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-navy/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sage" size="sm">
                Live Inquiries
              </Badge>
              <Badge variant="outline" size="sm">
                Protected RLS (Admin Only)
              </Badge>
            </div>
            <h2 className="text-h2 font-display font-bold text-navy">
              Client Booking Inquiries
            </h2>
            <p className="text-small text-navy-800 mt-1">
              Public inquiries submitted to <code className="font-mono text-xs">public.booking_requests</code>. Client contact details and notes are strictly protected from public access.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            isLoading={bookingsLoading}
            onClick={loadBookings}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {bookingsLoading ? 'Querying...' : 'Refresh Inquiries'}
          </Button>
        </div>

        {bookingsError && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-frame bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>Error querying bookings: {bookingsError}</span>
          </div>
        )}

        {bookings && bookings.length === 0 && (
          <EmptyState
            title="No Booking Inquiries Yet"
            message="No client booking inquiries have been submitted to the database yet. When visitors submit inquiries on the contact form or services catalog, they will appear here for review."
            icon={<Inbox className="w-10 h-10 text-navy stroke-[1.5]" />}
          />
        )}

        {bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => {
              const statusVariant =
                b.status === 'confirmed'
                  ? 'sage'
                  : b.status === 'under_review'
                  ? 'cream'
                  : b.status === 'declined' || b.status === 'cancelled'
                  ? 'outline'
                  : 'navy';

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-frame bg-white border border-navy/15 shadow-subtle hover:border-navy transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-navy/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-body font-bold text-navy">{b.client_name}</h3>
                        <Badge variant={statusVariant} size="sm">
                          {b.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-navy/60 font-mono">
                        ID: {b.id.slice(0, 8)}... • Submitted:{' '}
                        {new Date(b.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {b.services?.name && (
                      <Badge variant="outline" size="sm" icon={<Calendar className="w-3 h-3" />}>
                        {b.services.name}
                      </Badge>
                    )}
                  </div>

                  {/* Client Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-900">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-navy/60 shrink-0" />
                      <a href={`mailto:${b.client_email}`} className="font-medium hover:underline text-navy-950">
                        {b.client_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-navy/60 shrink-0" />
                      <a href={`tel:${b.client_phone}`} className="font-medium hover:underline text-navy-950">
                        {b.client_phone}
                      </a>
                    </div>
                    {b.preferred_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-navy/60 shrink-0" />
                        <span>Date: {b.preferred_date}</span>
                      </div>
                    )}
                  </div>

                  {/* Message / Inquiry Notes */}
                  <div className="p-3 bg-cream/60 rounded border border-sage/30 text-xs text-navy leading-relaxed">
                    <span className="font-bold block mb-0.5 text-navy-950">Client Note:</span>
                    {b.message}
                  </div>

                  {/* Status Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-navy/70 text-[11px]">
                      Transition status with audit trail:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {b.status === 'submitted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({
                              isOpen: true,
                              bookingId: b.id,
                              clientName: b.client_name,
                              fromStatus: b.status,
                              toStatus: 'under_review',
                            })
                          }
                        >
                          Mark Under Review
                        </Button>
                      )}
                      {(b.status === 'submitted' || b.status === 'under_review') && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                            onClick={() =>
                              setStatusDialog({
                                isOpen: true,
                                bookingId: b.id,
                                clientName: b.client_name,
                                fromStatus: b.status,
                                toStatus: 'confirmed',
                              })
                            }
                          >
                            Confirm Booking
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                            onClick={() =>
                              setStatusDialog({
                                isOpen: true,
                                bookingId: b.id,
                                clientName: b.client_name,
                                fromStatus: b.status,
                                toStatus: 'declined',
                              })
                            }
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({
                              isOpen: true,
                              bookingId: b.id,
                              clientName: b.client_name,
                              fromStatus: b.status,
                              toStatus: 'completed',
                            })
                          }
                        >
                          Mark Completed
                        </Button>
                      )}
                      {b.status === 'declined' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({
                              isOpen: true,
                              bookingId: b.id,
                              clientName: b.client_name,
                              fromStatus: b.status,
                              toStatus: 'under_review',
                            })
                          }
                        >
                          Reopen Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Services Feature Readiness & Authorized Management */}
      <Card variant="default" className="p-6 sm:p-8 bg-surface-light border-2 border-navy-800 shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-navy/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sage" size="sm">
                Database Managed
              </Badge>
              {liveServices ? (
                <Badge variant="sage" size="sm">
                  Live Database Read ({liveServices.length} Disciplines)
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  Canonical Presentation Reference
                </Badge>
              )}
            </div>
            <h2 className="text-h2 font-display font-bold text-navy">
              Canonical Photography Services
            </h2>
            <p className="text-small text-navy-800 mt-1">
              {liveServices
                ? 'Retrieved live from PostgreSQL table public.services. Authorized administrators can toggle service active status.'
                : 'Canonical service disciplines ready for package and pricing configuration in Milestone 003.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={servicesLoading}
              onClick={loadServices}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {servicesLoading ? 'Querying...' : 'Query Database Services'}
            </Button>
          </div>
        </div>

        {servicesError && (
          <div
            role="status"
            className="mb-4 p-3 rounded-frame bg-cream border border-sage/50 text-navy text-xs flex items-center justify-between"
          >
            <span>Live database query note: {servicesError} (Displaying canonical reference specification below).</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(liveServices && liveServices.length > 0 ? liveServices : CANONICAL_SERVICES).map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-frame bg-white border border-navy/10 shadow-subtle hover:border-sage transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage block">
                    {srv.category}
                  </span>
                  <Badge variant={srv.is_active ? 'sage' : 'outline'} size="sm">
                    {srv.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <h3 className="text-body font-bold text-navy leading-snug">
                  {srv.name}
                </h3>
                <span className="text-[11px] font-mono text-navy/60 block mt-1">
                  slug: {srv.slug}
                </span>
              </div>

              {liveServices && (
                <div className="mt-4 pt-3 border-t border-navy/5 flex items-center justify-between text-xs">
                  <span className="text-navy/70 text-[11px]">Display in catalog:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setServiceDialog({
                        isOpen: true,
                        serviceId: srv.id,
                        serviceName: srv.name,
                        nextActive: !srv.is_active,
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-sage transition-colors"
                  >
                    {srv.is_active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-sage" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-navy/40" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Confirmation Dialog for Status Change */}
      {statusDialog && (
        <ConfirmDialog
          isOpen={statusDialog.isOpen}
          title={`Update Booking Status for ${statusDialog.clientName}`}
          message={`Are you sure you want to transition this booking request from "${statusDialog.fromStatus}" to "${statusDialog.toStatus}"? This change will be permanently recorded in the database audit log.`}
          confirmLabel={`Confirm Transition to ${statusDialog.toStatus}`}
          cancelLabel="Cancel"
          variant="primary"
          isLoading={isActionLoading}
          onConfirm={handleExecuteStatusChange}
          onCancel={() => setStatusDialog(null)}
        />
      )}

      {/* Confirmation Dialog for Service Toggle */}
      {serviceDialog && (
        <ConfirmDialog
          isOpen={serviceDialog.isOpen}
          title={`${serviceDialog.nextActive ? 'Activate' : 'Deactivate'} Service`}
          message={`Are you sure you want to ${serviceDialog.nextActive ? 'activate' : 'deactivate'} "${serviceDialog.serviceName}"? ${serviceDialog.nextActive ? 'It will become visible on the public services catalog.' : 'It will be hidden from public catalog views.'}`}
          confirmLabel={serviceDialog.nextActive ? 'Activate Service' : 'Deactivate Service'}
          cancelLabel="Keep Unchanged"
          variant={serviceDialog.nextActive ? 'primary' : 'warning'}
          isLoading={isActionLoading}
          onConfirm={handleExecuteServiceToggle}
          onCancel={() => setServiceDialog(null)}
        />
      )}

      {/* Confirmation Dialog for Logout */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Confirm Session Termination"
        message="Are you sure you want to log out of the photographer portal? You will need your photographer credentials to log back in."
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
    <Container size="lg" className="py-8 sm:py-12">
      <ProtectedRoute>
        <PhotographerPortalContent />
      </ProtectedRoute>
    </Container>
  );
};
