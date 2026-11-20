import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard, { AuthMessage } from '../components/AuthCard';
import { inputStyle, labelStyle, linkStyle, submitStyle } from '../components/authCardStyles';
import { requestPasswordReset, validateRecoveryEmail } from '../services/passwordRecoveryService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRecoveryEmail(email);
    if (validation) {
      setError(validation);
      setSent(false);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError('No pudimos procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Recupera tu contraseña"
      description="Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva."
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label htmlFor="kt-forgot-email" style={labelStyle}>Correo electrónico</label>
          <input
            id="kt-forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); setSent(false); }}
            placeholder="tu@correo.com"
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {error && <AuthMessage>{error}</AuthMessage>}
        {sent && (
          <AuthMessage kind="success">
            Si el correo corresponde a una cuenta, recibirás un enlace válido por 15 minutos.
          </AuthMessage>
        )}

        <button type="submit" disabled={loading} style={submitStyle}>
          {loading ? 'Enviando…' : 'Enviar enlace'}
        </button>
        <Link to="/login" style={linkStyle}>Volver al inicio de sesión</Link>
      </form>
    </AuthCard>
  );
}
