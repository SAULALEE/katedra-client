import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, getDefaultRoute } from '../utils/roleUtils';

/**
 * Route protection wrapper component.
 * Verifies global authentication state and redirects to the user's role home route if unauthorized.
 */
export default function ProtectedRoute({ children, allowedRoles, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();

  // If still restoring session or loading credentials
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas flex items-center justify-center text-ink select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
          <span className="text-[10px] uppercase tracking-wider text-ink-muted">Cargando Sesión...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const effectiveAllowedRoles = allowedRoles || (adminOnly ? ['ROLE_ADMIN'] : ['ROLE_PROFESOR']);
  const userRole = isAdmin(user) ? 'ROLE_ADMIN' : 'ROLE_PROFESOR';

  if (!effectiveAllowedRoles.includes(userRole)) {
    return <Navigate to={getDefaultRoute(user)} replace />;
  }

  return children;
}

