import React from 'react';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};
