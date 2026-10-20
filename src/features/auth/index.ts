/**
 * Authentication Feature Boundary (Milestone 002)
 * Manages Supabase Auth, photographer sessions, protected routes, and security state.
 */

export * from './types';
export * from './context/AuthContext';
export * from './components/PhotographerLoginForm';
export * from './components/ProtectedRoute';

export const AUTH_FEATURE_CONFIG = {
  name: 'auth',
  status: 'implemented_milestone_002',
  version: '1.0.0',
} as const;
