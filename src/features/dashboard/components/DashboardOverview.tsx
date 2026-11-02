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
} from 'lucide-react';
import { BookingRequestWithService } from '../../bookings';
import { Service } from '../../../types/database';

export interface DashboardOverviewProps {
  photographerName: string;
  bookings: BookingRequestWithService[] | null;
  services: Service[] | null;
  onNavigateTab: (tab: 'bookings' | 'services' | 'profile') => void;
  onSelectBooking?: (booking: BookingRequestWithService) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  photographerName,
  bookings,
  services,
  onNavigateTab,
  onSelectBooking,
}) => {
  // Format current date: e.g. "Monday, November 2, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Genuine statistics derived strictly from real database records
  const totalInquiries = bookings?.length ?? 0;
  const pendingInquiries =
    bookings?.filter((b) => b.status === 'submitted' || b.status === 'under_review').length ?? 0;
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
  const completedBookings = bookings?.filter((b) => b.status === 'completed').length ?? 0;
  const activeServicesCount = services?.filter((s) => s.is_active).length ?? 0;

  // Recent 3 inquiries
  const recentInquiries = (bookings || []).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-frame bg-navy text-white border-2 border-navy-950 shadow-elevated relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-sage/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sage" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Studio Management
              </Badge>
              <span className="text-caption font-semibold text-white/80">
                {formattedDate}
              </span>
            </div>
            <h1 className="text-h2 font-display font-bold text-white tracking-tight">
              Welcome back, {photographerName}
            </h1>
            <p className="text-small text-white/90 leading-relaxed font-medium">
              Here is your photography studio activity overview. Track client booking inquiries, manage your service catalog, and coordinate upcoming photography sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('bookings')}
              leftIcon={<Inbox className="w-4 h-4 stroke-[2.2]" />}
            >
              View Inquiries
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('services')}
              leftIcon={<Camera className="w-4 h-4 text-white" />}
              className="border-white/30 text-white hover:bg-navy-800"
            >
              Services Catalog
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Genuine Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Inquiries */}
        <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-full bg-navy/5 text-navy flex items-center justify-center">
              <Inbox className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {bookings !== null ? totalInquiries : '—'}
            </span>
            <Badge variant="outline" size="sm" className="text-navy-800 border-navy/20">
              All-Time
            </Badge>
          </div>
          <span className="text-caption text-navy/70 mt-2 font-medium">
            Total incoming client requests
          </span>
        </Card>

        {/* Pending Inquiries */}
        <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Pending Inquiries
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-amber-700">
              {bookings !== null ? pendingInquiries : '—'}
            </span>
            <Badge variant="cream" size="sm" className="border-amber-300 text-amber-900 bg-amber-50 font-bold">
              Action Needed
            </Badge>
          </div>
          <span className="text-caption text-navy/70 mt-2 font-medium">
            Awaiting your confirmation
          </span>
        </Card>

        {/* Confirmed Bookings */}
        <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-8 h-8 rounded-full bg-sage/20 text-navy flex items-center justify-center">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-sage">
              {bookings !== null ? confirmedBookings : '—'}
            </span>
            <Badge variant="sage" size="sm">
              Scheduled
            </Badge>
          </div>
          <span className="text-caption text-navy/70 mt-2 font-medium">
            Agreed photography sessions
          </span>
        </Card>

        {/* Completed Bookings */}
        <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
              Completed Bookings
            </span>
            <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-h1 font-display font-bold text-navy">
              {bookings !== null ? completedBookings : '—'}
            </span>
            <Badge variant="navy" size="sm">
              Fulfilled
            </Badge>
          </div>
          <span className="text-caption text-navy/70 mt-2 font-medium">
            Delivered client projects
          </span>
        </Card>
      </div>

      {/* Overview Highlights & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Inquiries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-display font-bold text-navy">
                Recent Inquiries
              </h2>
              <p className="text-caption text-navy-800">
                Latest client messages and session booking requests
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('bookings')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              See All Inquiries
            </Button>
          </div>

          {recentInquiries.length === 0 ? (
            <Card variant="default" className="p-8 text-center bg-white border-2 border-sage-200">
              <Inbox className="w-10 h-10 text-sage mx-auto mb-2 opacity-60" />
              <p className="text-small font-bold text-navy">No inquiries recorded yet</p>
              <p className="text-caption text-navy/70 mt-1">
                When clients submit session inquiries through your website, they will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((booking) => {
                const isPending = booking.status === 'submitted' || booking.status === 'under_review';
                return (
                  <Card
                    key={booking.id}
                    variant="default"
                    onClick={() => {
                      if (onSelectBooking) {
                        onSelectBooking(booking);
                      } else {
                        onNavigateTab('bookings');
                      }
                    }}
                    className="p-4 bg-white border border-sage-300 hover:border-navy transition-all flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-navy text-small truncate">
                          {booking.client_name}
                        </span>
                        <Badge
                          variant={isPending ? 'cream' : booking.status === 'confirmed' ? 'sage' : 'navy'}
                          size="sm"
                          className="capitalize text-[10px]"
                        >
                          {booking.status === 'submitted' ? 'New' : booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-caption text-navy-800 truncate">
                        {booking.services?.name || 'General Inquiry'} • {booking.client_email}
                      </p>
                      <p className="text-caption text-navy/60 truncate mt-0.5 italic">
                        "{booking.message}"
                      </p>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0 text-right">
                      <span className="text-[11px] font-medium text-navy/70">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold text-navy flex items-center gap-1 mt-1 group-hover:text-sage">
                        Review <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Studio Services & Profile Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-h3 font-display font-bold text-navy">
            Studio Management
          </h2>

          <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-sage/20 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                <Camera className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-body font-bold text-navy">Photography Services</h3>
                  <Badge variant="sage" size="sm">
                    {activeServicesCount} Active
                  </Badge>
                </div>
                <p className="text-caption text-navy-800 mt-1 leading-relaxed">
                  Manage offered disciplines, adjust descriptions, and toggle public catalog visibility.
                </p>
                <div className="pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onNavigateTab('services')}
                  >
                    Manage Services
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-5 bg-white border-2 border-sage-300 shadow-subtle space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-body font-bold text-navy">Photographer Profile</h3>
                <p className="text-caption text-navy-800 mt-1 leading-relaxed">
                  Update your contact phone number, public display name, and studio details.
                </p>
                <div className="pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onNavigateTab('profile')}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

