import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherAuthShell, { AuthFooterLink, AuthLabel, AuthMessage, PasswordVisibilityToggle, SubmitButton } from '../components/auth/TeacherAuthShell';
import { resetPassword, validatePasswordReset } from '../services/passwordRecoveryService';

const shellCopy = {
  eyebrow: 'Recupera tu acceso',
  headline: <>Una contraseña nueva<br />y sigues donde ibas.</>,
  lead: 'Por seguridad, al cambiarla cerramos tus sesiones anteriores.',
  navAction: { label: 'Iniciar sesión', to: '/login' }
};

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
  const [isFocused, setIsFocused] = useState(false);

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
      <TeacherAuthShell {...shellCopy} title="Contraseña actualizada" description="Ya puedes iniciar sesión con tu nueva contraseña." excited>
        <button type="button" className="kt-submit-btn" onClick={() => navigate('/login', { replace: true })}>
          Ir al inicio de sesión
        </button>
      </TeacherAuthShell>
    );
  }

  if (!token) {
    return (
      <TeacherAuthShell {...shellCopy} title="Enlace no válido" description="El enlace no es válido o ya venció. Solicita uno nuevo.">
        <button type="button" className="kt-submit-btn" onClick={() => navigate('/recuperar-contrasena')}>
          Solicitar otro enlace
        </button>
        <AuthFooterLink prompt="" to="/login">Volver al inicio de sesión</AuthFooterLink>
      </TeacherAuthShell>
    );
  }

  const focusHandlers = { onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false) };

  return (
    <TeacherAuthShell {...shellCopy} title="Elige una nueva contraseña" description="Debe tener entre 8 y 100 caracteres." excited={isFocused}>
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <AuthLabel htmlFor="kt-reset-password">Nueva contraseña</AuthLabel>
          <div style={{ position: 'relative' }}>
            <input
              id="kt-reset-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              {...focusHandlers}
              placeholder="Mínimo 8 caracteres"
              className="kt-input"
              style={{ paddingRight: '44px' }}
              disabled={loading}
            />
            <PasswordVisibilityToggle visible={showPasswords} onToggle={() => setShowPasswords(!showPasswords)} />
          </div>
        </div>

        <div>
          <AuthLabel htmlFor="kt-reset-confirm">Confirmar contraseña</AuthLabel>
          <input
            id="kt-reset-confirm"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            {...focusHandlers}
            placeholder="Repite tu nueva contraseña"
            className="kt-input"
            disabled={loading}
          />
        </div>

        {error && <AuthMessage>{error}</AuthMessage>}

        <SubmitButton loading={loading} loadingLabel="Guardando…">Guardar contraseña</SubmitButton>
      </form>

      <AuthFooterLink prompt="" to="/login">Volver al inicio de sesión</AuthFooterLink>
    </TeacherAuthShell>
  );
}
