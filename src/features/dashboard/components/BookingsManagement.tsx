import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { BookingDetailsModal } from './BookingDetailsModal';
import {
  Search,
  Calendar,
  Eye,
  RefreshCw,
  Mail,
  Phone,
} from 'lucide-react';
import { BookingRequestWithService } from '../../bookings';
import { BookingStatus } from '../../../types/database';

export interface BookingsManagementProps {
  bookings: BookingRequestWithService[] | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateStatus: (bookingId: string, toStatus: BookingStatus, fromStatus: BookingStatus) => Promise<void>;
  selectedBookingId?: string | null;
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export const BookingsManagement: React.FC<BookingsManagementProps> = ({
  bookings,
  isLoading,
  error,
  onRefresh,
  onUpdateStatus,
  selectedBookingId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeBooking, setActiveBooking] = useState<BookingRequestWithService | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Auto-open selected booking if requested
  React.useEffect(() => {
    if (selectedBookingId && bookings) {
      const found = bookings.find((b) => b.id === selectedBookingId);
      if (found) {
        setActiveBooking(found);
      }
    }
  }, [selectedBookingId, bookings]);

  // Status Filter Counts
  const counts = useMemo(() => {
    const list = bookings || [];
    return {
      all: list.length,
      pending: list.filter((b) => b.status === 'submitted' || b.status === 'under_review').length,
      confirmed: list.filter((b) => b.status === 'confirmed').length,
      completed: list.filter((b) => b.status === 'completed').length,
      cancelled: list.filter((b) => b.status === 'cancelled' || b.status === 'declined').length,
    };
  }, [bookings]);

  // Filtered & Searched Bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((b) => {
      // 1. Status Filter
      if (statusFilter === 'pending') {
        if (b.status !== 'submitted' && b.status !== 'under_review') return false;
      } else if (statusFilter === 'confirmed') {
        if (b.status !== 'confirmed') return false;
      } else if (statusFilter === 'completed') {
        if (b.status !== 'completed') return false;
      } else if (statusFilter === 'cancelled') {
        if (b.status !== 'cancelled' && b.status !== 'declined') return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const clientName = (b.client_name || '').toLowerCase();
        const clientEmail = (b.client_email || '').toLowerCase();
        const clientPhone = (b.client_phone || '').toLowerCase();
        const serviceName = (b.services?.name || '').toLowerCase();
        const message = (b.message || '').toLowerCase();

        return (
          clientName.includes(query) ||
          clientEmail.includes(query) ||
          clientPhone.includes(query) ||
          serviceName.includes(query) ||
          message.includes(query)
        );
      }

      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleExecuteStatusUpdate = async (
    bookingId: string,
    toStatus: BookingStatus,
    fromStatus: BookingStatus
  ) => {
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(bookingId, toStatus, fromStatus);
      // Update modal view in place
      if (activeBooking && activeBooking.id === bookingId) {
        setActiveBooking({ ...activeBooking, status: toStatus });
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="cream" size="sm" className="bg-amber-100 text-amber-900 border-amber-300">Pending</Badge>;
      case 'under_review':
        return <Badge variant="cream" size="sm" className="bg-amber-50 text-amber-800 border-amber-200">Under Review</Badge>;
      case 'confirmed':
        return <Badge variant="sage" size="sm">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="navy" size="sm">Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" size="sm" className="text-red-700 border-red-300 bg-red-50">Declined</Badge>;
      case 'cancelled':
        return <Badge variant="outline" size="sm" className="text-gray-600 border-gray-300 bg-gray-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-display font-bold text-navy">
            Booking Inquiries
          </h1>
          <p className="text-small text-navy-800 mt-1">
            Review client inquiries, coordinate photography sessions, and update booking statuses.
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
            Refresh Inquiries
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <Card variant="default" className="p-4 bg-white border-2 border-sage-300 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {(
              [
                { id: 'all', label: 'All Inquiries', count: counts.all },
                { id: 'pending', label: 'Pending', count: counts.pending },
                { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
                { id: 'completed', label: 'Completed', count: counts.completed },
                { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
              ] as const
            ).map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-frame text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-navy text-white shadow-subtle'
                      : 'bg-sage-50 text-navy hover:bg-sage-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-sage text-navy' : 'bg-navy/10 text-navy'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <Input
              type="search"
              placeholder="Search by client, service, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-navy/60" />}
              className="py-1.5 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Content Area: Loading / Error / Empty / Table */}
      {isLoading && !bookings ? (
        <LoadingState
          title="Loading Inquiries"
          message="Retrieving client bookings and session requests..."
        />
      ) : error ? (
        <Card variant="default" className="p-8 text-center bg-red-50 border-2 border-red-300">
          <p className="text-body font-bold text-red-900 mb-2">Unable to Load Inquiries</p>
          <p className="text-small text-red-800 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Try Again
          </Button>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No matching inquiries' : 'No inquiries in this category'}
          message={
            searchQuery
              ? `No inquiries match "${searchQuery}". Clear your search query to see all records.`
              : 'There are currently no inquiries in this status category.'
          }
          actionLabel={searchQuery ? 'Clear Search Filter' : undefined}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-frame border-2 border-sage-300 bg-white shadow-subtle">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sage-100/70 border-b-2 border-sage-300 text-caption font-bold text-navy-800 uppercase tracking-wider">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Requested Service</th>
                  <th className="py-3 px-4">Preferred Date</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-200">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-sage-50/50 transition-colors cursor-pointer"
                    onClick={() => setActiveBooking(booking)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-navy text-small">
                          {booking.client_name}
                        </span>
                        <div className="flex items-center gap-2 text-caption text-navy/70 mt-0.5">
                          <span>{booking.client_email}</span>
                          <span>•</span>
                          <span>{booking.client_phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-small font-semibold text-navy">
                      {booking.services?.name || 'General Inquiry'}
                    </td>
                    <td className="py-3.5 px-4 text-small text-navy">
                      {booking.preferred_date ? (
                        <span>{new Date(booking.preferred_date).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-navy/50 italic text-caption">Flexible</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-caption text-navy/70 font-medium">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBooking(booking);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs py-1 px-2.5"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                variant="default"
                onClick={() => setActiveBooking(booking)}
                className="p-4 bg-white border-2 border-sage-300 shadow-subtle space-y-3 cursor-pointer hover:border-navy transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-navy text-body">{booking.client_name}</h3>
                    <p className="text-small font-semibold text-sage mt-0.5">
                      {booking.services?.name || 'General Inquiry'}
                    </p>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="text-caption text-navy/80 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sage" />
                    <span>{booking.client_email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sage" />
                    <span>{booking.client_phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sage" />
                    <span>
                      {booking.preferred_date
                        ? `Preferred: ${new Date(booking.preferred_date).toLocaleDateString()}`
                        : 'Date: Flexible'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-cream/50 rounded border border-sage-200 text-caption text-navy italic line-clamp-2">
                  "{booking.message}"
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-sage-200">
                  <span className="text-[11px] text-navy/60">
                    Received {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBooking(booking);
                    }}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="text-xs py-1"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={activeBooking}
        isOpen={Boolean(activeBooking)}
        onClose={() => setActiveBooking(null)}
        onUpdateStatus={handleExecuteStatusUpdate}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
};

