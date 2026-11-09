import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ImageContainer } from '../../components/media/ImageContainer';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  fetchActiveServices,
  fetchServicePackages,
  normalizeDeliverables,
} from '../../features/services';
import { Service, ServicePackage } from '../../types/database';
import { ArrowLeft, Sparkles, Calendar, Camera, Clock, Check, Star } from 'lucide-react';

// Contextual fallback imagery mapped to canonical service slugs
const SERVICE_IMAGE_MAP: Record<string, string> = {
  'portrait-photography': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'graduation-photography': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  'weddings-and-events': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'outdoor-photography': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'birthdays-and-celebrations': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
  'product-photography': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  'retouching-and-editing': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
  'photography-training': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
};

export const ServicesPreviewPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Record<string, ServicePackage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServicesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [servicesRes, packagesRes] = await Promise.all([
        fetchActiveServices(),
        fetchServicePackages(undefined, true),
      ]);

      if (servicesRes.error) {
        setError(servicesRes.error);
        setServices([]);
      } else {
        setServices(servicesRes.data || []);
      }

      if (packagesRes.data) {
        const grouped: Record<string, ServicePackage[]> = {};
        packagesRes.data.forEach((pkg) => {
          // Strictly display only active packages on the public website
          if (!pkg.is_active) return;
          if (!grouped[pkg.service_id]) {
            grouped[pkg.service_id] = [];
          }
          grouped[pkg.service_id].push(pkg);
        });

        // Deterministic ordering: sort_order ASC, then name ASC
        Object.keys(grouped).forEach((sId) => {
          grouped[sId].sort((a, b) => {
            const orderA = a.sort_order ?? 0;
            const orderB = b.sort_order ?? 0;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
          });
        });

        setPackages(grouped);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to query services from backend.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  return (
    <Container size="lg" className="flex flex-col gap-12 py-8">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <Badge variant="navy" size="md">
          Services & Packages
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Photography Offerings"
        title="Services Catalog"
        subtitle="Explore our professional photography disciplines and tailored session packages designed for your special occasions."
      />

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          title="Loading Photography Services"
          message="Loading photography disciplines and session packages..."
        />
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          title="Could Not Load Services"
          message={error}
          actionLabel="Try Again"
          onAction={loadServicesData}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && services.length === 0 && (
        <EmptyState
          title="No Services Available Currently"
          message="There are currently no active photography packages listed. Please check back soon or reach out directly through our contact page."
          actionLabel="Refresh Catalog"
          onAction={loadServicesData}
        />
      )}

      {/* Services and Tiered Packages Grid */}
      {!isLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const servicePackages = packages[service.id] || [];
            const coverImage =
              service.cover_image_url ||
              SERVICE_IMAGE_MAP[service.slug] ||
              'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80';

            return (
              <Card
                key={service.id}
                className="bg-white border-2 border-sage-300 flex flex-col justify-between shadow-subtle hover:border-navy transition-all"
              >
                <div>
                  <ImageContainer
                    src={coverImage}
                    alt={service.name}
                    aspectRatio="3:2"
                    className="rounded-b-none border-b-2 border-sage-300"
                  />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="sage" size="sm">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-h3 font-display font-bold text-navy">
                      {service.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-small text-navy-950 font-medium space-y-4">
                    <p className="leading-relaxed text-navy-800">{service.description}</p>

                    {/* Available Packages Section */}
                    {servicePackages.length > 0 ? (
                      <div className="pt-3 border-t border-sage-200 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sage" />
                          Available Packages ({servicePackages.length})
                        </span>

                        <div className="space-y-3">
                          {servicePackages.map((pkg) => {
                            const deliverablesList = normalizeDeliverables(pkg.deliverables);

                            return (
                              <div
                                key={pkg.id}
                                className={`p-3.5 rounded-frame border-2 transition-all space-y-2.5 ${
                                  pkg.is_featured
                                    ? 'bg-cream/80 border-sage-400 shadow-xs ring-1 ring-sage-300'
                                    : 'bg-cream/30 border-sage-200'
                                }`}
                              >
                                {/* Package Title, Badges & Price */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-navy text-small leading-tight">
                                        {pkg.name}
                                      </span>
                                      {pkg.is_featured && (
                                        <Badge
                                          variant="sage"
                                          size="sm"
                                          className="text-[10px] px-1.5 py-0 font-bold flex items-center gap-1 bg-sage text-navy"
                                        >
                                          <Star className="w-2.5 h-2.5 fill-current" />
                                          Featured
                                        </Badge>
                                      )}
                                    </div>

                                    {pkg.duration_minutes && (
                                      <span className="text-[11px] text-navy/70 flex items-center gap-1 font-semibold">
                                        <Clock className="w-3 h-3 text-sage" />
                                        {pkg.duration_minutes} minutes
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-right flex-shrink-0">
                                    <span className="font-mono text-small font-bold text-navy block">
                                      {pkg.price_amount !== null && pkg.price_amount !== undefined
                                        ? `${pkg.currency} ${pkg.price_amount.toLocaleString()}`
                                        : 'Inquire for a Quote'}
                                    </span>
                                  </div>
                                </div>

                                {/* Package Description if provided */}
                                {pkg.description && (
                                  <p className="text-xs text-navy-800 leading-normal">
                                    {pkg.description}
                                  </p>
                                )}

                                {/* Deliverables Bullet List */}
                                {deliverablesList.length > 0 && (
                                  <div className="pt-2 border-t border-sage-200/60 space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy/70 block">
                                      Includes:
                                    </span>
                                    <ul className="space-y-1">
                                      {deliverablesList.map((item, idx) => (
                                        <li
                                          key={idx}
                                          className="text-xs text-navy flex items-start gap-1.5 leading-snug"
                                        >
                                          <Check className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-sage-200 text-xs text-navy/70 italic flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-sage shrink-0" />
                        <span>Custom package quotes provided upon inquiry</span>
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Primary Card CTA */}
                <div className="p-6 pt-2 mt-4">
                  <a href={`#contact?service=${encodeURIComponent(service.slug)}`} className="block w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      leftIcon={<Calendar className="w-4 h-4" />}
                    >
                      Inquire About {service.name}
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Session Booking Banner */}
      <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-navy">Direct Session Inquiries</span>
          <span className="text-small text-navy-950 font-medium">
            Ready to book a session? Submit your requirements through the contact channel to reach photographer Arafat Nabuku Jansu.
          </span>
        </div>
        <a href="#contact" className="shrink-0">
          <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-4 h-4" />}>
            Book a Session
          </Button>
        </a>
      </div>
    </Container>
  );
};
