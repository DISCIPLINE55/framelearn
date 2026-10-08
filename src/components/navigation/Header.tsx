import React, { useState } from 'react';
import { FOUNDATION_NAV_ITEMS } from '../../constants/navigation';
import { PROJECT_METADATA } from '../../constants/project';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Menu, X, Camera, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy text-cream shadow-elevated border-b border-navy-800">
      <Container size="lg">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3 group focus-visible:ring-offset-navy">
            <div className="w-10 h-10 rounded-frame bg-sage flex items-center justify-center text-navy shadow-subtle group-hover:bg-cream transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-h3 tracking-tight text-cream font-bold group-hover:text-sage transition-colors">
                FRAMELEARN
              </span>
              <span className="text-[10px] text-cream/70 tracking-wider uppercase font-medium">
                Photography & Learning
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {FOUNDATION_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="px-4 py-2 rounded-md text-small font-medium text-cream/90 hover:text-cream hover:bg-navy-800 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Shell & Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <Badge variant="sage" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
              Milestone 001
            </Badge>
            <Button variant="secondary" size="sm">
              Lecturer Review Mode
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-frame text-cream hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-sage"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1">
              {FOUNDATION_NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-frame text-body font-medium text-cream hover:bg-navy-800 transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-navy-800 flex flex-col gap-2 px-2">
                <Badge variant="sage" size="md" className="justify-center">
                  {PROJECT_METADATA.milestone}
                </Badge>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};
