import { useState } from 'react';
import TeacherAuthShell, { AuthFooterLink, AuthLabel, AuthMessage, SubmitButton } from '../components/auth/TeacherAuthShell';
import { requestPasswordReset, validateRecoveryEmail } from '../services/passwordRecoveryService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <TeacherAuthShell
      eyebrow="Recupera tu acceso"
      headline={<>Vuelve a tus clases<br />en un momento.</>}
      lead="Te enviaremos un enlace seguro para que elijas una contraseña nueva."
      title="Recupera tu contraseña"
      description="Escribe el correo de tu cuenta y te enviaremos un enlace."
      excited={isFocused}
      navAction={{ label: 'Iniciar sesión', to: '/login' }}
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <AuthLabel htmlFor="kt-forgot-email">Correo electrónico</AuthLabel>
          <input
            id="kt-forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); setSent(false); }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="tucorreo@escuela.edu"
            className="kt-input"
            disabled={loading}
          />
        </div>

        {error && <AuthMessage>{error}</AuthMessage>}
        {sent && (
          <AuthMessage kind="success">
            Si el correo corresponde a una cuenta, recibirás un enlace válido por 15 minutos.
          </AuthMessage>
        )}

        <SubmitButton loading={loading} loadingLabel="Enviando…">Enviar enlace</SubmitButton>
      </form>

      <AuthFooterLink prompt="¿La recordaste?" to="/login">Inicia sesión</AuthFooterLink>
    </TeacherAuthShell>
  );
}
