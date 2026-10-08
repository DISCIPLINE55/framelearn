import React from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { MainLayout } from './app/layouts/MainLayout';
import { DesignSystemShowcase } from './app/routes/DesignSystemShowcase';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout>
        <DesignSystemShowcase />
      </MainLayout>
    </AppProvider>
  );
};

export default App;
