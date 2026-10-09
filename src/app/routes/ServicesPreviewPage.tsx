import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ImageContainer } from '../../components/media/ImageContainer';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const ServicesPreviewPage: React.FC = () => {
  const services = [
    { title: 'Graduation Photography', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80', description: 'Cap and gown portraits, family photos, and ceremony documentation.' },
    { title: 'Wedding & Event Storytelling', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', description: 'Cinematic wedding coverage, couple portraits, and reception highlights.' },
    { title: 'Outdoor & Lifestyle Portraits', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', description: 'Natural light personal portrait sessions in scenic outdoor environments.' },
    { title: 'Birthday & Special Occasions', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', description: 'Milestone birthday celebrations and private party documentation.' },
    { title: 'Product & Commercial Photography', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', description: 'E-commerce product shots, menu imagery, and commercial branding.' },
    { title: 'Photo Editing & Retouching', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80', description: 'High-end color grading, retouching, and asset preparation.' },
    { title: 'Photography Training & Masterclasses', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', description: 'Hands-on technical camera training and group workshops.' },
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
          Services Catalog
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Photography Offerings"
        title="Services Catalog"
        subtitle="Overview of photography service packages designed for the FrameLearn platform."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => (
          <Card key={idx} className="bg-white border-2 border-sage-300">
            <ImageContainer src={s.image} alt={s.title} aspectRatio="3:2" className="rounded-b-none border-b-2 border-sage-300" />
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-small text-navy-950 font-medium">{s.description}</CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-navy">Custom Bookings & Scheduling</span>
          <span className="text-small text-navy-950 font-medium">Direct online session booking, package customization, and availability calendar scheduling will be available in future platform updates.</span>
        </div>
        <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4" />}>
          Platform Roadmap
        </Badge>
      </div>
    </Container>
  );
};
