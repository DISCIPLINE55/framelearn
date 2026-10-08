import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export const LearningPreviewPage: React.FC = () => {
  const modules = [
    { title: 'Camera Fundamentals', desc: 'Understanding camera controls, operation modes, lens selections, and sensor formats.' },
    { title: 'Exposure Triangle', desc: 'Mastering Aperture, Shutter Speed, and ISO for technical exposure control.' },
    { title: 'Composition Principles', desc: 'Rule of thirds, leading lines, negative space, and visual framing.' },
    { title: 'Lighting Techniques', desc: 'Natural daylight direction, diffusers, golden hour, and flash controls.' },
    { title: 'Portrait Posing & Directing', desc: 'Guiding subjects, posing techniques, and building client rapport.' },
    { title: 'Photo Editing & Post-Processing', desc: 'RAW processing, Lightroom workflows, color grading, and asset exports.' },
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
          Milestone 001 Learning Scope Preview
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Practical Education"
        title="Learning Hub Preview"
        subtitle="Practical photography education designed for aspiring photographers developing hands-on technical skills."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, idx) => (
          <Card key={idx} className="bg-white border-2 border-sage-300 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-navy font-bold mb-2">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <CardTitle>{m.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-small text-navy-950 font-medium">{m.desc}</CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-navy">Planned Milestone 006 Feature</span>
          <span className="text-small text-navy-950 font-medium">Interactive course modules, video guides, PDF downloads, and workshop registration will be enabled in Milestone 006.</span>
        </div>
        <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4" />}>
          Milestone 006
        </Badge>
      </div>
    </Container>
  );
};
