import React, { useState, useEffect } from 'react';
import { PUBLIC_NAV_ITEMS } from '../../constants/navigation';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Menu, X, Camera, ShieldCheck, ArrowRight } from 'lucide-react';

export interface HeaderProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute = 'home', onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(currentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveHash(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const route = href.replace('#', '');
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-elevated border-b-2 border-navy-950">
      <Container size="lg">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Product Concept */}
          <a
            href="#home"
            onClick={() => handleLinkClick('#home')}
            className="flex items-center gap-3 group focus-visible:ring-offset-navy"
          >
            <div className="w-10 h-10 rounded-frame bg-sage flex items-center justify-center text-navy font-bold shadow-subtle group-hover:bg-cream transition-colors">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-h3 tracking-tight text-white font-bold group-hover:text-sage transition-colors">
                FRAMELEARN
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/90 tracking-wider uppercase font-semibold">
                Photography • Experience • Learning
              </span>
            </div>
          </a>

          {/* Product Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = activeHash === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`px-3.5 py-2 rounded-frame text-small font-bold transition-all ${
                    isActive
                      ? 'bg-navy-800 text-sage border border-sage/40'
                      : 'text-white hover:text-sage hover:bg-navy-800'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Primary CTA & Lecturer Review Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#design-system" onClick={() => handleLinkClick('#design-system')}>
              <Badge variant="cream" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Review Area
              </Badge>
            </a>
            <a href="#portfolio" onClick={() => handleLinkClick('#portfolio')}>
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}>
                Explore Portfolio
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-frame text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-sage"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Product Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-navy-800 bg-navy animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="px-4 py-3 rounded-frame text-body font-bold text-white hover:bg-navy-800 hover:text-sage transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-navy-800 flex flex-col gap-2 px-2">
                <a href="#portfolio" onClick={() => handleLinkClick('#portfolio')} className="w-full">
                  <Button variant="secondary" size="md" fullWidth>
                    Explore Portfolio
                  </Button>
                </a>
                <a href="#design-system" onClick={() => handleLinkClick('#design-system')} className="w-full">
                  <Badge variant="cream" size="md" className="w-full justify-center py-2">
                    Review Area (Design System)
                  </Badge>
                </a>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};
