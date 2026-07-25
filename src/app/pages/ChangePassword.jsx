import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../utils/roleUtils';

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
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px', fontFamily: "'Manrope', sans-serif", background: 'radial-gradient(130% 135% at 12% 6%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 86%, #FCD34D 112%)' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(22px) saturate(1.3)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '22px', padding: '38px 36px', boxShadow: '0 40px 90px -30px rgba(15,23,42,.55), 0 8px 24px -12px rgba(15,23,42,.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(150deg,#10B981,#059669)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px -3px rgba(16,185,129,.6)' }}><span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-1px' }}>K</span></div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-.8px', color: '#0F172A' }}>Katedra</span>
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '24px', lineHeight: 1.15, letterSpacing: '-1px', color: '#0F172A', margin: '0 0 7px' }}>Cambia tu contraseña</h1>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '13.5px', color: '#64748B', margin: '0 0 22px' }}>
          Tu cuenta se creó con una contraseña temporal. Elige una nueva antes de continuar.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', color: '#334155', marginBottom: '4px' }}>Contraseña temporal</label>
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
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', color: '#334155', marginBottom: '4px' }}>Nueva contraseña</label>
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
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', color: '#334155', marginBottom: '4px' }}>Confirmar nueva contraseña</label>
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

          {(validationError || error) && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#EF4444', fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 600, lineHeight: '1.4' }}>
              {validationError || error}
            </div>
          )}

          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? 'Guardando…' : 'Guardar y continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  height: '46px',
  padding: '0 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: '10px',
  background: '#F8FAFC',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 500,
  fontSize: '14.5px',
  color: '#0F172A',
  outline: 'none'
};

const submitStyle = {
  width: '100%',
  height: '48px',
  border: 'none',
  borderRadius: '11px',
  background: 'linear-gradient(150deg, #10B981, #059669)',
  color: '#fff',
  cursor: 'pointer',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 800,
  fontSize: '14.5px',
  marginTop: '4px',
  boxShadow: '0 12px 26px -10px rgba(16, 185, 129, .75)'
};
