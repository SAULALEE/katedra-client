import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getOAuthErrorMessage } from '../services/authService';

export default function AuthError() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorCode = new URLSearchParams(location.search).get('error');
  const message =
    location.state?.message ||
    getOAuthErrorMessage(errorCode);

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-1 border border-hairline rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <h1 className="text-xl font-bold">Error de autenticación</h1>
        <p className="text-sm text-ink-muted" role="alert">{message}</p>
        <Button variant="primary" onClick={() => navigate('/login', { replace: true })} className="w-full">
          Volver al Login
        </Button>
      </div>
    </div>
  );
}
