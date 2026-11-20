import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../utils/roleUtils';
import TeacherAuthShell, { AuthLabel, AuthMessage, PasswordVisibilityToggle, SubmitButton } from '../components/auth/TeacherAuthShell';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, clearError, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => { clearError(); }, [clearError]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!user?.mustChangePassword) {
      navigate(getDefaultRoute(user), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 8) {
      setValidationError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword === currentPassword) {
      setValidationError('La nueva contraseña debe ser diferente a la temporal.');
      return;
    }

    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      navigate(getDefaultRoute(user), { replace: true });
    }
  };

  return (
    <TeacherAuthShell
      eyebrow="Primer acceso"
      headline={<>Protege tu cuenta<br />antes de empezar.</>}
      lead="Cambia la contraseña temporal por una que solo tú conozcas."
      title="Cambia tu contraseña"
      description="Tu cuenta se creó con una contraseña temporal. Elige una nueva antes de continuar."
      navAction={{ label: 'Iniciar sesión', to: '/login' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <AuthLabel htmlFor="kt-cp-current">Contraseña temporal</AuthLabel>
          <div style={{ position: 'relative' }}>
            <input
              id="kt-cp-current"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="La que recibiste al crear tu cuenta"
              className="kt-input"
              style={{ paddingRight: '44px' }}
              disabled={loading}
            />
            <PasswordVisibilityToggle visible={showPasswords} onToggle={() => setShowPasswords(!showPasswords)} />
          </div>
        </div>

        <div>
          <AuthLabel htmlFor="kt-cp-new">Nueva contraseña</AuthLabel>
          <input
            id="kt-cp-new"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="kt-input"
            disabled={loading}
          />
        </div>

        <div>
          <AuthLabel htmlFor="kt-cp-confirm">Confirmar nueva contraseña</AuthLabel>
          <input
            id="kt-cp-confirm"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu nueva contraseña"
            className="kt-input"
            disabled={loading}
          />
        </div>

        {(validationError || error) && <AuthMessage>{validationError || error}</AuthMessage>}

        <SubmitButton loading={loading} loadingLabel="Guardando…">Guardar y continuar</SubmitButton>
      </form>
    </TeacherAuthShell>
  );
}
