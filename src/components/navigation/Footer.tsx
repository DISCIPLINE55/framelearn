import React from 'react';
import { FOOTER_NAV_ITEMS } from '../../constants/navigation';
import { PROJECT_METADATA } from '../../constants/project';
import { Container } from '../layout/Container';
import { Camera, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-cream pt-16 pb-12 border-t-2 border-navy-950">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b-2 border-navy-800">
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-frame bg-sage flex items-center justify-center text-navy font-bold shadow-subtle">
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display text-h3 tracking-tight font-bold text-cream">
                FRAMELEARN
              </span>
            </div>
            <p className="text-body text-cream/95 font-medium leading-relaxed max-w-md">
              {PROJECT_METADATA.title}. Built with a clean, photography-first design system utilizing approved brand identity tokens (#10212B Navy, #8FA464 Sage, #EFFBDD Cream).
            </p>
            <div className="inline-flex items-center gap-2 text-small font-bold text-sage bg-navy-800 px-3.5 py-1.5 rounded-full border border-sage/40 w-fit">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{PROJECT_METADATA.course}</span>
            </div>
          </div>

          {/* Project Team */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="text-small font-bold uppercase tracking-wider text-sage font-display">
              Project Development Team
            </h4>
            <ul className="flex flex-col gap-2.5 text-body text-cream/95">
              {PROJECT_METADATA.team.map((member) => (
                <li key={member.name} className="flex flex-col">
                  <span className="font-bold text-cream">{member.name}</span>
                  <span className="text-small text-cream/85 font-medium">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder Nav Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-small font-bold uppercase tracking-wider text-sage font-display">
              Foundation Links
            </h4>
            <ul className="flex flex-col gap-2 text-body text-cream/95">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="font-semibold hover:text-sage transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal Shell */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-small text-cream/90 font-medium">
          <p>© {new Date().getFullYear()} FrameLearn Project Team. All rights reserved.</p>
          <p className="font-semibold text-sage">Milestone 001 Foundation & Architecture Review Gate</p>
        </div>
      </Container>
    </footer>
  );
};
