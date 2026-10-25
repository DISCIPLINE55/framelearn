import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PhotographerLoginForm } from './PhotographerLoginForm';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const {
    isLoading,
    isProfileLoading,
    isAuthenticated,
    isAdmin,
    user,
    profileError,
    refreshProfile,
    signOut,
  } = useAuth();

  // Asynchronous session restoration and profile loading guard
  if (isLoading || isProfileLoading) {
    return (
      <Container size="sm" className="py-16">
        <LoadingState
          title="Verifying Authorization"
          message="Checking photographer session and database permissions..."
        />
      </Container>
    );
  }

  // Not authenticated at all
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Container size="sm" className="py-12">
        <PhotographerLoginForm />
      </Container>
    );
  }

  // Authenticated, but not authorized as administrator (failed authorization check)
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Container size="sm" className="py-12">
        <Card variant="default" className="p-6 sm:p-8 bg-surface-light border-2 border-red-300 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>

          <Badge variant="outline" size="sm" className="mb-2 text-red-800 border-red-300 bg-red-50">
            Access Restricted
          </Badge>

          <h2 className="text-h3 font-display font-bold text-navy mb-2">
            Unauthorized Account
          </h2>

          <p className="text-small text-navy-800 mb-4 leading-relaxed max-w-md mx-auto">
            You are signed in as <strong className="font-mono text-navy-950">{user?.email}</strong>, but this account does not possess verified administrator privileges required to access the Photographer Portal.
          </p>

          {profileError && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-frame bg-red-50 border border-red-200 text-red-900 text-xs font-mono text-left"
            >
              <span className="font-bold block mb-0.5">Authorization Error:</span>
              {profileError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshProfile()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Authorization
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut()}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out & Switch Account
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // User is authenticated and possesses verified 'admin' role from database
  return <>{children}</>;
};
