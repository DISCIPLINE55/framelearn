import React from 'react';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/navigation/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-navy font-sans antialiased">
      <Header />
      <main className="flex-1 py-8 sm:py-12">{children}</main>
      <Footer />
    </div>
  );
};
