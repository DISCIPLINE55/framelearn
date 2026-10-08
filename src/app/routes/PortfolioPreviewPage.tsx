import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ImageContainer } from '../../components/media/ImageContainer';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const PortfolioPreviewPage: React.FC = () => {
  const portfolioItems = [
    { id: '1', category: 'Portraits', title: 'Studio Lighting Portrait', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
    { id: '2', category: 'Weddings', title: 'Ceremony Ring Exchange', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
    { id: '3', category: 'Graduation', title: 'Academic Success Celebration', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80' },
    { id: '4', category: 'Events', title: 'Evening Celebration Lights', src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80' },
    { id: '5', category: 'Portraits', title: 'Golden Hour Outdoor Portrait', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { id: '6', category: 'Product Photography', title: 'Commercial Camera Gear', src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <Container size="lg" className="flex flex-col gap-12 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <Badge variant="navy" size="md">
          Milestone 001 Portfolio Scope Preview
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Photography Showcase"
        title="Portfolio Preview"
        subtitle="Explore curated photography work across portraits, weddings, graduation sessions, events, and product photography."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <ImageContainer
            key={item.id}
            src={item.src}
            alt={item.title}
            aspectRatio="3:2"
            caption={`${item.category} • ${item.title}`}
          />
        ))}
      </div>

      <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-navy">Planned Milestone 003 Feature</span>
          <span className="text-small text-navy-950 font-medium">Interactive portfolio filter tabs, lightbox zoom, and category management will be enabled in Milestone 003.</span>
        </div>
        <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4" />}>
          Milestone 003
        </Badge>
      </div>
    </Container>
  );
};
