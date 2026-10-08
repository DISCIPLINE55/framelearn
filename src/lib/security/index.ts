/**
 * Security & Authorization Boundary Foundation
 * Role-Based Access Control (RBAC) helpers will reside in this module.
 */
export type UserRoleType = 'admin' | 'client' | 'learner';

export const hasPermission = (userRole: UserRoleType | undefined, requiredRole: UserRoleType): boolean => {
  if (!userRole) return false;
  if (userRole === 'admin') return true; // Admin has full access
  return userRole === requiredRole;
};
