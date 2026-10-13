import React from 'react';
import { ToastProvider } from './ToastContext';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
