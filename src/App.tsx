import React, { useState, useEffect } from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { MainLayout } from './app/layouts/MainLayout';
import { HomePage } from './app/routes/HomePage';
import { PortfolioPreviewPage } from './app/routes/PortfolioPreviewPage';
import { ServicesPreviewPage } from './app/routes/ServicesPreviewPage';
import { LearningPreviewPage } from './app/routes/LearningPreviewPage';
import { AboutPage } from './app/routes/AboutPage';
import { ContactPage } from './app/routes/ContactPage';
import { DesignSystemShowcase } from './app/routes/DesignSystemShowcase';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentRoute(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    switch (currentRoute) {
      case 'portfolio':
        return <PortfolioPreviewPage />;
      case 'services':
        return <ServicesPreviewPage />;
      case 'learning':
        return <LearningPreviewPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'design-system':
      case 'docs':
      case 'components':
      case 'tokens':
      case 'states':
      case 'ui-components':
      case 'app-states':
      case 'image-foundation':
      case 'architecture-docs':
        return <DesignSystemShowcase />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <AppProvider>
      <MainLayout currentRoute={currentRoute} onNavigate={(route) => setCurrentRoute(route)}>
        {renderRoute()}
      </MainLayout>
    </AppProvider>
  );
};

export default App;
