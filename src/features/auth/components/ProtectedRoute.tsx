import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PhotographerLoginForm } from './PhotographerLoginForm';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Container } from '../../../components/layout/Container';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <Container size="sm" className="py-16">
        <LoadingState
          title="Verifying Authorization"
          message="Checking photographer session and security permissions..."
        />
      </Container>
    );
  }

  // Not authenticated or not an authorized photographer/admin
  if (!isAuthenticated || !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Container size="sm" className="py-12">
        <PhotographerLoginForm />
      </Container>
    );
  }

  // User is authenticated and possesses the 'admin' role
  return <>{children}</>;
};
