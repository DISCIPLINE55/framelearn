import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { BookingRequestWithService } from '../../bookings';
import { BookingStatus } from '../../../types/database';

export interface BookingDetailsModalProps {
  booking: BookingRequestWithService | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, toStatus: BookingStatus, fromStatus: BookingStatus) => Promise<void>;
  isLoading?: boolean;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
  isLoading = false,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    toStatus: BookingStatus;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'primary' | 'warning';
  } | null>(null);

  if (!booking) return null;

  const currentStatus = booking.status;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="cream" size="md">New Inquiry (Pending)</Badge>;
      case 'under_review':
        return <Badge variant="cream" size="md">Under Review</Badge>;
      case 'confirmed':
        return <Badge variant="sage" size="md">Confirmed Session</Badge>;
      case 'completed':
        return <Badge variant="navy" size="md">Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" size="md" className="text-red-700 border-red-300 bg-red-50">Declined</Badge>;
      case 'cancelled':
        return <Badge variant="outline" size="md" className="text-gray-700 border-gray-300 bg-gray-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline" size="md">{status}</Badge>;
    }
  };

  const handleActionClick = (
    toStatus: BookingStatus,
    title: string,
    message: string,
    confirmLabel: string,
    variant: 'primary' | 'warning' = 'primary'
  ) => {
    setConfirmDialog({
      toStatus,
      title,
      message,
      confirmLabel,
      variant,
    });
  };

  const handleExecuteStatusChange = async () => {
    if (!confirmDialog) return;
    const targetStatus = confirmDialog.toStatus;
    setConfirmDialog(null);
    await onUpdateStatus(booking.id, targetStatus, currentStatus);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Booking Inquiry Details"
        description={`Inquiry from ${booking.client_name}`}
        size="lg"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Close Details
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              {/* Actions based on current status */}
              {(currentStatus === 'submitted' || currentStatus === 'under_review') && (
                <>
                  {currentStatus === 'submitted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleActionClick(
                          'under_review',
                          'Mark Inquiry Under Review',
                          `Place the inquiry from "${booking.client_name}" into review status while coordinating availability?`,
                          'Put Under Review',
                          'primary'
                        )
                      }
                      isLoading={isLoading}
                    >
                      Put Under Review
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleActionClick(
                        'confirmed',
                        'Confirm Booking Session',
                        `Confirm the booking with "${booking.client_name}" for ${booking.services?.name || 'this service'}?`,
                        'Confirm Booking',
                        'primary'
                      )
                    }
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    isLoading={isLoading}
                  >
                    Confirm Booking
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleActionClick(
                        'declined',
                        'Decline Booking Inquiry',
                        `Decline this inquiry from "${booking.client_name}"? You can reopen it later if plans change.`,
                        'Decline Inquiry',
                        'warning'
                      )
                    }
                    className="text-red-700 border-red-300 hover:bg-red-50"
                    isLoading={isLoading}
                  >
                    Decline
                  </Button>
                </>
              )}

              {currentStatus === 'confirmed' && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleActionClick(
                        'completed',
                        'Mark Session as Completed',
                        `Mark the photography session for "${booking.client_name}" as completed and delivered?`,
                        'Mark as Completed',
                        'primary'
                      )
                    }
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    isLoading={isLoading}
                  >
                    Mark as Completed
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleActionClick(
                        'cancelled',
                        'Cancel Confirmed Booking',
                        `Are you sure you want to cancel the confirmed session for "${booking.client_name}"?`,
                        'Cancel Booking',
                        'warning'
                      )
                    }
                    className="text-red-700 border-red-300 hover:bg-red-50"
                    isLoading={isLoading}
                  >
                    Cancel Booking
                  </Button>
                </>
              )}

              {(currentStatus === 'declined' || currentStatus === 'cancelled') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleActionClick(
                      'under_review',
                      'Reopen Inquiry',
                      `Reopen the inquiry from "${booking.client_name}" and restore it to active review?`,
                      'Reopen Inquiry',
                      'primary'
                    )
                  }
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  isLoading={isLoading}
                >
                  Reopen Inquiry
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-frame bg-cream border border-sage-300 gap-3">
            <div>
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider block">
                Current Status
              </span>
              <div className="mt-1">{getStatusBadge(currentStatus)}</div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-caption font-semibold text-navy/70 block">
                Inquiry Received
              </span>
              <span className="text-small font-bold text-navy">
                {new Date(booking.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
                Client Name
              </span>
              <p className="text-body font-bold text-navy">{booking.client_name}</p>
            </div>

            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
                Requested Service
              </span>
              <p className="text-body font-bold text-navy">
                {booking.services?.name || 'General Inquiry'}
              </p>
            </div>

            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
                Email Address
              </span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sage flex-shrink-0" />
                <a
                  href={`mailto:${booking.client_email}`}
                  className="text-small font-bold text-navy hover:text-sage transition-colors underline break-all"
                >
                  {booking.client_email}
                </a>
              </div>
            </div>

            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider">
                Phone Number
              </span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sage flex-shrink-0" />
                <a
                  href={`tel:${booking.client_phone}`}
                  className="text-small font-bold text-navy hover:text-sage transition-colors underline font-mono"
                >
                  {booking.client_phone}
                </a>
              </div>
            </div>
          </div>

          {/* Schedule & Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sage" />
                Preferred Date & Time
              </span>
              <p className="text-small font-medium text-navy">
                {booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : 'Flexible / Not specified'}
                {booking.preferred_time ? ` at ${booking.preferred_time}` : ''}
              </p>
            </div>

            <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-1">
              <span className="text-caption font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sage" />
                Location & Venue Notes
              </span>
              <p className="text-small font-medium text-navy">
                {booking.location_notes || 'Studio / Location to be coordinated'}
              </p>
            </div>
          </div>

          {/* Client Message */}
          <div className="p-4 rounded-frame bg-white border border-sage-200 space-y-2">
            <span className="text-caption font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-sage" />
              Client Requirements & Message
            </span>
            <div className="p-3 bg-cream/40 rounded-frame border border-sage-200/60 text-small text-navy leading-relaxed whitespace-pre-wrap font-medium">
              {booking.message}
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Status Transitions */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel="Keep Unchanged"
          variant={confirmDialog.variant}
          isLoading={isLoading}
          onConfirm={handleExecuteStatusChange}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </>
  );
};

