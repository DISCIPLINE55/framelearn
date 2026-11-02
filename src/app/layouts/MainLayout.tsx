import React, { useEffect } from 'react';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/navigation/Footer';
import { BackToTop } from '../../components/navigation/BackToTop';

export interface MainLayoutProps {
  children: React.ReactNode;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentRoute, onNavigate }) => {
  const isAdminRoute = ['photographer-portal', 'portal', 'admin'].includes(currentRoute || '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : ('instant' as ScrollBehavior),
      });
    }
  }, [currentRoute]);

  // When inside the dedicated photographer administration portal, omit public marketing header & footer
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-navy font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-navy font-sans antialiased">
      <Header currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className="flex-1 py-8 sm:py-12">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};
