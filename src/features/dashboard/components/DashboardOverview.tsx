import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Inbox,
  ArrowRight,
  Camera,
  User,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Plus,
  Eye,
} from 'lucide-react';
import { BookingRequestWithService } from '../../bookings';
import { Service } from '../../../types/database';

export interface DashboardOverviewProps {
  photographerName: string;
  photographerPhone?: string | null;
  photographerEmail?: string;
  bookings: BookingRequestWithService[] | null;
  services: Service[] | null;
  onNavigateTab: (tab: 'bookings' | 'services' | 'profile') => void;
  onSelectBooking?: (booking: BookingRequestWithService) => void;
  onAddNewService?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  photographerName,
  photographerPhone,
  photographerEmail,
  bookings,
  services,
  onNavigateTab,
  onSelectBooking,
  onAddNewService,
}) => {
  // Live formatted current date: e.g. "Monday, November 2, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const isBookingsLoaded = bookings !== null;
  const isServicesLoaded = services !== null;

  // Genuine statistics derived strictly from real database records
  const totalInquiries = bookings?.length ?? 0;
  const pendingInquiries =
    bookings?.filter((b) => b.status === 'submitted' || b.status === 'under_review').length ?? 0;
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
  const completedBookings = bookings?.filter((b) => b.status === 'completed').length ?? 0;
  const activeServices = services?.filter((s) => s.is_active) ?? [];

  // Pending queue for immediate photographer attention
  const pendingQueue = (bookings || []).filter(
    (b) => b.status === 'submitted' || b.status === 'under_review'
  );

  // Recent 4 overall inquiries
  const recentInquiries = (bookings || []).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Executive Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-frame bg-navy text-white border-2 border-navy-950 shadow-elevated relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-sage/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sage" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Studio Workspace
              </Badge>
              <span className="text-caption font-semibold text-white/80">
                {formattedDate}
              </span>
            </div>
            <h1 className="text-h2 font-display font-bold text-white tracking-tight">
              Welcome back, {photographerName}
            </h1>
            <p className="text-small text-white/90 leading-relaxed font-medium">
              {!isBookingsLoaded ? (
                <span>Loading studio inquiries and scheduled sessions...</span>
              ) : (
                <>
                  You have{' '}
                  <strong className="text-sage font-bold">
                    {pendingInquiries} {pendingInquiries === 1 ? 'inquiry' : 'inquiries'}
                  </strong>{' '}
                  requiring review and{' '}
                  <strong className="text-white font-bold">{confirmedBookings} confirmed</strong> photography{' '}
                  {confirmedBookings === 1 ? 'session' : 'sessions'} scheduled.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('bookings')}
              leftIcon={<Inbox className="w-4 h-4 stroke-[2.2]" />}
            >
              View Inquiries ({isBookingsLoaded ? totalInquiries : '…'})
            </Button>
            {onAddNewService && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddNewService}
                leftIcon={<Plus className="w-4 h-4 text-white" />}
                className="border-white/40 text-white hover:bg-navy-800"
              >
                Add Service
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Interactive Statistics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Inquiries */}
        <Card
          variant="default"
          onClick={() => onNavigateTab('bookings')}
          className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between hover:border-navy hover:shadow-elevated transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-full bg-slate-100 text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-sage transition-colors">
              <Inbox className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {isBookingsLoaded ? totalInquiries : '—'}
            </span>
            <Badge variant="outline" size="sm" className="text-navy-800 border-navy/20">
              {isBookingsLoaded ? 'All-Time' : 'Loading…'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-caption text-navy/70 mt-2 font-medium">
            <span>All incoming client inquiries</span>
            <ChevronRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>

        {/* Pending Inquiries */}
        <Card
          variant="default"
          onClick={() => onNavigateTab('bookings')}
          className="p-5 bg-white border-2 border-amber-300 shadow-subtle flex flex-col justify-between hover:border-amber-600 hover:shadow-elevated transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-amber-900 uppercase tracking-wider">
              Pending Inquiries
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-amber-700">
              {isBookingsLoaded ? pendingInquiries : '—'}
            </span>
            <Badge variant="cream" size="sm" className="border-amber-400 text-amber-900 bg-amber-50 font-bold">
              {isBookingsLoaded ? (pendingInquiries > 0 ? 'Action Needed' : 'Clear') : 'Loading…'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-caption text-amber-800 mt-2 font-medium">
            <span>Awaiting your confirmation</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>

        {/* Confirmed Bookings */}
        <Card
          variant="default"
          onClick={() => onNavigateTab('bookings')}
          className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between hover:border-sage-600 hover:shadow-elevated transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-9 h-9 rounded-full bg-sage/20 text-navy flex items-center justify-center group-hover:bg-sage group-hover:text-navy transition-colors">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-sage">
              {isBookingsLoaded ? confirmedBookings : '—'}
            </span>
            <Badge variant="sage" size="sm">
              {isBookingsLoaded ? 'Scheduled' : 'Loading…'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-caption text-navy/70 mt-2 font-medium">
            <span>Active studio sessions</span>
            <ChevronRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>

        {/* Completed Bookings */}
        <Card
          variant="default"
          onClick={() => onNavigateTab('bookings')}
          className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between hover:border-navy hover:shadow-elevated transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Completed Bookings
            </span>
            <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {isBookingsLoaded ? completedBookings : '—'}
            </span>
            <Badge variant="navy" size="sm">
              {isBookingsLoaded ? 'Fulfilled' : 'Loading…'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-caption text-navy/70 mt-2 font-medium">
            <span>Delivered client projects</span>
            <ChevronRight className="w-3.5 h-3.5 text-navy/40 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Card>
      </div>

      {/* Main Two-Column Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Immediate Action Desk & Recent Inquiries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pending Inquiries Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-h3 font-display font-bold text-navy">
                  Inquiries Awaiting Action ({pendingQueue.length})
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('bookings')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                All Inquiries
              </Button>
            </div>

            {!isBookingsLoaded ? (
              <Card variant="default" className="p-6 text-center bg-white border border-sage-200">
                <p className="text-small font-medium text-navy/70">Loading inquiries awaiting action...</p>
              </Card>
            ) : pendingQueue.length === 0 ? (
              <Card variant="default" className="p-6 text-center bg-white border-2 border-sage-200">
                <CheckCircle2 className="w-10 h-10 text-sage mx-auto mb-2 opacity-80" />
                <p className="text-small font-bold text-navy">All Caught Up!</p>
                <p className="text-caption text-navy/70 mt-1 max-w-sm mx-auto">
                  There are no pending inquiries requiring immediate review. All incoming requests have been reviewed or scheduled.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingQueue.slice(0, 3).map((inquiry) => (
                  <Card
                    key={inquiry.id}
                    variant="default"
                    onClick={() => {
                      if (onSelectBooking) onSelectBooking(inquiry);
                      else onNavigateTab('bookings');
                    }}
                    className="p-4 bg-white border-2 border-amber-300 hover:border-navy shadow-subtle hover:shadow-elevated transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy text-small truncate">
                          {inquiry.client_name}
                        </span>
                        <Badge variant="cream" size="sm" className="bg-amber-100 text-amber-900 border-amber-300 text-[10px]">
                          {inquiry.status === 'submitted' ? 'New Submission' : 'Under Review'}
                        </Badge>
                      </div>
                      <p className="text-caption font-semibold text-sage truncate">
                        {inquiry.services?.name || 'General Session'} • {inquiry.client_phone}
                      </p>
                      <p className="text-caption text-navy/70 truncate italic">
                        "{inquiry.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end flex-shrink-0">
                      <span className="text-[11px] text-navy/60 font-medium">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectBooking) onSelectBooking(inquiry);
                          else onNavigateTab('bookings');
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs py-1"
                      >
                        Review
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries List */}
          <div className="space-y-3 pt-2">
            <h2 className="text-h3 font-display font-bold text-navy">
              Recent Studio Activity
            </h2>

            {!isBookingsLoaded ? (
              <Card variant="default" className="p-6 text-center bg-white border border-sage-200">
                <p className="text-small font-medium text-navy/70">Loading recent studio activity...</p>
              </Card>
            ) : recentInquiries.length === 0 ? (
              <Card variant="default" className="p-6 text-center bg-white border border-sage-200">
                <Inbox className="w-8 h-8 text-sage mx-auto mb-2 opacity-50" />
                <p className="text-small font-medium text-navy/70">No booking requests submitted yet.</p>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {recentInquiries.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => {
                      if (onSelectBooking) onSelectBooking(booking);
                      else onNavigateTab('bookings');
                    }}
                    className="p-3.5 rounded-frame bg-white border border-slate-200 hover:border-navy hover:shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-navy font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {booking.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-small font-bold text-navy truncate">
                          {booking.client_name}
                        </span>
                        <span className="text-caption text-slate-500 truncate">
                          {booking.services?.name || 'General Inquiry'} • {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={booking.status === 'confirmed' ? 'sage' : booking.status === 'completed' ? 'navy' : 'outline'}
                        size="sm"
                        className="text-[10px] capitalize"
                      >
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Offerings & Profile Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Services Showcase Card */}
          <Card variant="default" className="p-6 bg-white border-2 border-sage-300 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sage/20 text-navy flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-body font-bold text-navy">Photography Services</h3>
                  <span className="text-caption text-slate-500">Live Studio Offerings</span>
                </div>
              </div>
              <Badge variant="sage" size="sm">
                {isServicesLoaded ? `${activeServices.length} Active` : 'Loading…'}
              </Badge>
            </div>

            <p className="text-small text-navy-800 leading-relaxed font-medium">
              {!isServicesLoaded
                ? 'Loading studio service offerings...'
                : `FrameLearn currently has ${activeServices.length} photography offerings displayed in the public catalog.`}
            </p>

            <div className="space-y-2">
              {activeServices.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="p-2.5 rounded bg-cream/40 border border-sage-200/80 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-navy truncate">{service.name}</span>
                  <Badge variant="outline" size="sm" className="text-[10px] bg-white">
                    {service.category}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onNavigateTab('services')}
              >
                Manage Services
              </Button>
              {onAddNewService && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onAddNewService}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add
                </Button>
              )}
            </div>
          </Card>

          {/* Studio Profile & Availability Card */}
          <Card variant="default" className="p-6 bg-white border-2 border-sage-300 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center font-bold">
                  <User className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-body font-bold text-navy">Studio Profile</h3>
                  <span className="text-caption text-slate-500">Contact & Information</span>
                </div>
              </div>
              <Badge variant="cream" size="sm">
                Studio Owner
              </Badge>
            </div>

            <div className="space-y-2 text-small text-navy-800">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sage flex-shrink-0" />
                <span className="truncate font-semibold">
                  {photographerEmail || 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sage flex-shrink-0" />
                <span className="truncate font-semibold">
                  {photographerPhone || 'Not specified in profile'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sage flex-shrink-0" />
                <span className="text-xs text-slate-600">Kumasi & Accra, Ghana</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onNavigateTab('profile')}
              >
                Edit Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
