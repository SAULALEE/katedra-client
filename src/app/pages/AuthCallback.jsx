import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../utils/roleUtils';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { handleOAuthCallback, user, error } = useAuth();

  useEffect(() => {
    const success = handleOAuthCallback();

    if (success) {
      navigate(getDefaultRoute(user), { replace: true });
      return;
    }

    navigate('/auth/error', {
      replace: true,
      state: { message: error || 'No se pudo completar el inicio de sesion social.' }
    });
  }, [handleOAuthCallback, user, navigate, error]);

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">Procesando acceso...</span>
      </div>
    </div>
  );
}
