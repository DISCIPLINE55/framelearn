import React from 'react';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from '../../features/auth/context/AuthContext';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
};
