import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../utils/roleUtils';
import AuthCard, { AuthMessage } from '../components/AuthCard';
import { inputStyle, labelStyle, submitStyle } from '../components/authCardStyles';

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
    <AuthCard
      title="Cambia tu contraseña"
      description="Tu cuenta se creó con una contraseña temporal. Elige una nueva antes de continuar."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Contraseña temporal</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="La que recibiste al crear tu cuenta"
            className="kt-cp-input"
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Nueva contraseña</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Confirmar nueva contraseña</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

        {(validationError || error) && <AuthMessage>{validationError || error}</AuthMessage>}

        <button type="submit" disabled={loading} style={submitStyle}>
          {loading ? 'Guardando…' : 'Guardar y continuar'}
        </button>
      </form>
    </AuthCard>
  );
}
