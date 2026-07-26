import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../utils/roleUtils';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    const session = handleOAuthCallback();

    if (session) {
      navigate(getDefaultRoute(session.user), { replace: true });
      return;
    }

    navigate('/auth/error', {
      replace: true,
      state: { message: 'No se pudo completar el acceso con Google. Inténtalo de nuevo.' }
    });
  }, [handleOAuthCallback, navigate]);

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">Procesando acceso...</span>
      </div>
    </div>
  );
}
