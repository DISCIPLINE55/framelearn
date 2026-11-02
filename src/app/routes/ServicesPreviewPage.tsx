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
import { fetchActiveServices, fetchServicePackages } from '../../features/services';
import { Service, ServicePackage } from '../../types/database';
import { ArrowLeft, Sparkles, Calendar, Camera } from 'lucide-react';

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
        fetchServicePackages(),
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
          if (!grouped[pkg.service_id]) {
            grouped[pkg.service_id] = [];
          }
          grouped[pkg.service_id].push(pkg);
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <Badge variant="navy" size="md">
          Live Services Catalog
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Photography Offerings"
        title="Services Catalog"
        subtitle="Genuine photography service disciplines retrieved live from the FrameLearn PostgreSQL backend."
      />

      {isLoading && (
        <LoadingState
          title="Loading Photography Services"
          message="Retrieving active photography disciplines from PostgreSQL..."
        />
      )}

      {!isLoading && error && (
        <ErrorState
          title="Could Not Load Services"
          message={error}
          actionLabel="Retry Database Query"
          onAction={loadServicesData}
        />
      )}

      {!isLoading && !error && services.length === 0 && (
        <EmptyState
          title="No Active Services Found"
          message="There are currently no active photography services configured in the database."
          actionLabel="Refresh Catalog"
          onAction={loadServicesData}
        />
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const servicePackages = packages[service.id] || [];
            const coverImage =
              service.cover_image_url ||
              SERVICE_IMAGE_MAP[service.slug] ||
              'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80';

            return (
              <Card key={service.id} className="bg-white border-2 border-sage-300 flex flex-col justify-between">
                <div>
                  <ImageContainer
                    src={coverImage}
                    alt={service.name}
                    aspectRatio="3:2"
                    className="rounded-b-none border-b-2 border-sage-300"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="sage" size="sm">
                        {service.category}
                      </Badge>
                      <span className="text-[11px] font-mono text-navy/60">
                        {service.slug}
                      </span>
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-small text-navy-950 font-medium space-y-3">
                    <p>{service.description}</p>

                    {servicePackages.length > 0 ? (
                      <div className="pt-2 border-t border-sage-200 space-y-2">
                        <span className="text-xs font-bold text-navy block">
                          Available Packages ({servicePackages.length}):
                        </span>
                        <div className="space-y-1.5">
                          {servicePackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="p-2 rounded bg-cream/60 border border-sage/30 text-xs flex items-center justify-between"
                            >
                              <span className="font-semibold text-navy">{pkg.name}</span>
                              <span className="font-mono text-navy font-bold">
                                {pkg.price_amount !== null
                                  ? `${pkg.currency} ${pkg.price_amount}`
                                  : 'Price on inquiry'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-sage-200 text-xs text-navy/70 italic flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-sage shrink-0" />
                        <span>Custom package quotes provided upon inquiry</span>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-6 pt-0 mt-4">
                  <a href="#contact" className="block w-full">
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
