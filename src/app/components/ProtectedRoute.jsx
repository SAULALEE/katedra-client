import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/roleUtils';

/**
 * Route protection wrapper component.
 * Verifies global authentication state and redirects to login if unauthenticated.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
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

  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
