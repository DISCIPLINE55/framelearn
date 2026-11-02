import React, { useState, useEffect } from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select, SelectOption } from '../../components/ui/Select';
import { useToast } from '../providers/ToastContext';
import { submitBookingRequest, BookingSubmissionInput } from '../../features/bookings';
import { fetchActiveServices } from '../../features/services';
import { Service } from '../../types/database';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<BookingSubmissionInput>({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_id: '',
    preferred_date: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchActiveServices().then((res) => {
      if (isMounted && res.data) {
        setServices(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const serviceOptions: SelectOption[] = [
    { label: 'Select Photography Service (Optional)', value: '' },
    ...services.map((s) => ({
      label: `${s.name} (${s.category})`,
      value: s.id,
    })),
  ];

  const handleChange = (
    field: keyof BookingSubmissionInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    setIsSubmitting(true);
    const result = await submitBookingRequest(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      toast.success(
        'Your booking inquiry has been recorded successfully. The photographer will review your request.',
        {
          title: 'Inquiry Submitted',
        }
      );
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        service_id: '',
        preferred_date: '',
        message: '',
      });
    } else {
      if (result.validationErrors) {
        setFieldErrors(result.validationErrors);
      }
      setFormError(result.error || 'Failed to submit inquiry. Please try again.');
      toast.error(result.error || 'Failed to submit inquiry.', {
        title: 'Submission Failed',
      });
    }
  };

  return (
    <Container size="lg" className="flex flex-col gap-12 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <Badge variant="navy" size="md">
          Client Inquiry Channel
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Get in Touch"
        title="Contact FrameLearn"
        subtitle="Submit a session inquiry or photography consultation request directly to independent photographer Arafat Nabuku Jansu."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-navy font-bold shrink-0">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Official Business Email</span>
              <span className="text-body font-medium text-navy-950">framelearn28@gmail.com</span>
              <span className="text-caption text-navy-800 mt-1">Direct Photographer Inbox</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-navy font-bold shrink-0 border border-navy-800">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Service Location</span>
              <span className="text-body font-medium text-navy-950">Kumasi / Accra, Ghana</span>
              <span className="text-caption text-navy-800 mt-1">On-Location & Studio Sessions</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Response Window</span>
              <span className="text-body font-medium text-navy-950">Mon - Fri: 8:00 AM - 5:00 PM</span>
              <span className="text-caption text-navy-800 mt-1">Typically replies within 24-48 business hours</span>
            </div>
          </div>
        </div>

        {/* Real Booking Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-frame border-2 border-sage-300 shadow-subtle flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 font-display font-bold text-navy">Send a Session Inquiry</h3>
            <Badge variant="sage" size="sm">Direct Booking Channel</Badge>
          </div>

          {formError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3.5 rounded-frame bg-red-50 border border-red-300 text-red-900 text-small flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs">{formError}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="p-8 bg-cream rounded-frame border-2 border-sage-400 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-navy text-sage flex items-center justify-center shadow-subtle">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="text-h3 font-bold text-navy">Inquiry Received</h4>
              <p className="text-body font-medium text-navy-950 max-w-md leading-relaxed">
                Thank you. Your inquiry has been stored securely in our system. The photographer will review your request and reach out directly using your contact details.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsSubmitted(false)}
              >
                Submit Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. Ismail Mensah"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  errorText={fieldErrors.client_name}
                  leftIcon={<User className="w-4 h-4 text-navy-800" />}
                  required
                  fullWidth
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. ismail@example.com"
                  value={formData.client_email}
                  onChange={(e) => handleChange('client_email', e.target.value)}
                  errorText={fieldErrors.client_email}
                  leftIcon={<Mail className="w-4 h-4 text-navy-800" />}
                  required
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone / WhatsApp Number"
                  type="tel"
                  placeholder="e.g. +233 24 123 4567"
                  value={formData.client_phone}
                  onChange={(e) => handleChange('client_phone', e.target.value)}
                  errorText={fieldErrors.client_phone}
                  helperText="Required for scheduling confirmation"
                  leftIcon={<Phone className="w-4 h-4 text-navy-800" />}
                  required
                  fullWidth
                />
                <Input
                  label="Preferred Date (Optional)"
                  type="date"
                  value={formData.preferred_date || ''}
                  onChange={(e) => handleChange('preferred_date', e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4 text-navy-800" />}
                  fullWidth
                />
              </div>

              {services.length > 0 && (
                <Select
                  label="Requested Photography Service (Optional)"
                  options={serviceOptions}
                  value={formData.service_id || ''}
                  onChange={(e) => handleChange('service_id', e.target.value)}
                  fullWidth
                />
              )}

              <Textarea
                label="Session Details & Location Notes"
                placeholder="Describe your session goals, occasion, anticipated location, or questions..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                errorText={fieldErrors.message}
                required
              />

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-caption font-medium text-navy-800">
                  Client contact details are private and visible only to authorized photographer administration.
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  rightIcon={<Send className="w-4 h-4 stroke-[2.5]" />}
                  className="w-full sm:w-auto shrink-0"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Inquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
};
