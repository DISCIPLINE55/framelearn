import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PROJECT_METADATA } from '../../constants/project';
import { ArrowLeft, Camera, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <Container size="lg" className="flex flex-col gap-12 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="#home">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}>
            Back to Home
          </Button>
        </a>
        <Badge variant="navy" size="md">
          Milestone 001 Vision Overview
        </Badge>
      </div>

      <SectionHeading
        eyebrow="Project Purpose & Vision"
        title="About FrameLearn"
        subtitle="Unifying photography practice, client service delivery, and skills education under one modern web platform."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4 text-body font-medium text-navy-950 leading-relaxed">
          <p>
            FrameLearn is a final-year BSc Information Technology Education project developed for an independent professional photographer in Ghana.
          </p>
          <p>
            The project addresses a dual need in the local photography landscape: providing clients with an accessible, high-quality channel to discover services and view private galleries, while serving as a practical educational hub for aspiring photographers seeking real-world skills.
          </p>

          <div className="p-6 bg-cream rounded-frame border-2 border-navy-800 flex flex-col gap-2 my-2">
            <span className="font-bold text-navy flex items-center gap-2">
              <Camera className="w-5 h-5 stroke-[2.5]" /> Core Platform Equation
            </span>
            <p className="text-small font-bold text-navy-950">
              Photography Services + Client Session Journey + Practical Education = FrameLearn
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-frame border-2 border-sage-300 shadow-subtle flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-navy stroke-[2.5]" />
            <h3 className="text-h3 font-bold text-navy">Project Team</h3>
          </div>
          <ul className="space-y-3 text-body font-medium text-navy-950">
            {PROJECT_METADATA.team.map((member) => (
              <li key={member.name} className="flex flex-col">
                <span className="font-bold text-navy">{member.name}</span>
                <span className="text-small text-navy-800">{member.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
};
