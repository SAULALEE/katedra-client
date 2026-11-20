import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthCard, { AuthMessage } from '../components/AuthCard';
import { inputStyle, labelStyle, linkStyle, submitStyle } from '../components/authCardStyles';
import { resetPassword, validatePasswordReset } from '../services/passwordRecoveryService';

const INVALID_LINK = 'El enlace no es válido o ya venció. Solicita uno nuevo.';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromLink = searchParams.get('token') || '';
  // Kept only in memory: never persisted, and removed from the address bar below.
  const [token, setToken] = useState(tokenFromLink);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromLink) navigate('/restablecer-contrasena', { replace: true });
  }, [tokenFromLink, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validatePasswordReset(password, confirmPassword);
    if (validation) {
      setError(validation);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setToken('');
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch {
      setError('No pudimos actualizar la contraseña. Revisa el enlace o solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Contraseña actualizada" description="Por seguridad cerramos tus sesiones anteriores.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AuthMessage kind="success">Ya puedes iniciar sesión con tu nueva contraseña.</AuthMessage>
          <button type="button" onClick={() => navigate('/login', { replace: true })} style={submitStyle}>
            Ir al inicio de sesión
          </button>
        </div>
      </AuthCard>
    );
  }

  if (!token) {
    return (
      <AuthCard title="Enlace no válido" description={INVALID_LINK}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button type="button" onClick={() => navigate('/recuperar-contrasena')} style={submitStyle}>
            Solicitar otro enlace
          </button>
          <Link to="/login" style={linkStyle}>Volver al inicio de sesión</Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Elige una nueva contraseña" description="Debe tener entre 8 y 100 caracteres.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label htmlFor="kt-reset-password" style={labelStyle}>Nueva contraseña</label>
          <input
            id="kt-reset-password"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Mínimo 8 caracteres"
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="kt-reset-confirm" style={labelStyle}>Confirmar contraseña</label>
          <input
            id="kt-reset-confirm"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            placeholder="Repite tu nueva contraseña"
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0 4px', cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: '12.5px', color: '#475569' }}>
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#10B981', cursor: 'pointer' }}
          />
          Mostrar contraseñas
        </label>

        {error && <AuthMessage>{error}</AuthMessage>}

        <button type="submit" disabled={loading} style={submitStyle}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </AuthCard>
  );
}
