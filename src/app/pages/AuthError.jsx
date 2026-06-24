import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function AuthError() {
  const navigate = useNavigate();
  const location = useLocation();
  const message =
    location.state?.message ||
    'Ocurrio un problema al completar el inicio de sesion social.';

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-1 border border-hairline rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <h1 className="text-xl font-bold">Error de autenticacion</h1>
        <p className="text-sm text-ink-muted">{message}</p>
        <Button variant="primary" onClick={() => navigate('/login', { replace: true })} className="w-full">
          Volver a login
        </Button>
      </div>
    </div>
  );
}
