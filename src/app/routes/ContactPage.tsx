import React from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ArrowLeft, Mail, MapPin, Clock, Send, User } from 'lucide-react';

export const ContactPage: React.FC = () => {
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
        subtitle="Reach out regarding photography service inquiries or educational workshop information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-navy font-bold shrink-0">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Email Inquiry</span>
              <span className="text-body font-medium text-navy-950">info@framelearn.edu.gh</span>
              <span className="text-caption text-navy-800 mt-1">Project Contact Channel</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-navy font-bold shrink-0 border border-navy-800">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Location</span>
              <span className="text-body font-medium text-navy-950">Kumasi / Accra, Ghana</span>
              <span className="text-caption text-navy-800 mt-1">Project Service Area</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-small font-bold text-navy">Response Hours</span>
              <span className="text-body font-medium text-navy-950">Mon - Fri: 8:00 AM - 5:00 PM</span>
              <span className="text-caption text-navy-800 mt-1">Inquiry Support Window</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-frame border-2 border-sage-300 shadow-subtle flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 font-display font-bold text-navy">Send an Inquiry</h3>
            <Badge variant="sage" size="sm">Demonstration Form</Badge>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Your Name" placeholder="e.g. Ismail Mensah" leftIcon={<User className="w-4 h-4 text-navy-800" />} />
              <Input label="Email Address" type="email" placeholder="e.g. ismail@example.com" leftIcon={<Mail className="w-4 h-4 text-navy-800" />} />
            </div>
            <Textarea label="Inquiry Note" placeholder="Provide session details or questions..." rows={4} />
            <div className="pt-2 flex items-center justify-between">
              <span className="text-caption font-bold text-navy-800">* Demonstration Preview — Interactive submission active upon backend connection</span>
              <Button type="submit" variant="primary" rightIcon={<Send className="w-4 h-4 stroke-[2.5]" />}>
                Send Inquiry (Preview)
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};
