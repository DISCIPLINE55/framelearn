import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PortfolioGallery } from '../../features/portfolio';
import { ArrowLeft } from 'lucide-react';

export const PortfolioPreviewPage: React.FC = () => {
  return (
    <Container size="lg" className="flex flex-col gap-10 py-8">
      {/* Top Breadcrumb / Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <div className="flex items-center gap-2">
          <Badge variant="sage" size="md">
            Interactive Portfolio Active
          </Badge>
          <Badge variant="navy" size="md">
            Curated Showcase
          </Badge>
        </div>
      </div>

      <SectionHeading
        eyebrow="Photography Showcase"
        title="Interactive Portfolio"
        subtitle="Explore curated photography work across portraits, graduation, weddings & events, outdoor landscapes, and product disciplines."
      />

      {/* Main Interactive Gallery Feature */}
      <PortfolioGallery />
    </Container>
  );
};
