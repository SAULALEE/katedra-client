import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import Button from '../components/Button';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';

/* Whimsical design tokens — official palette (blues & greens) */
const DISPLAY = "'Agrandir','Avenir','Montserrat','Segoe UI',sans-serif";
const BODY = "'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif";
const INK = '#0F172A';
const BLUE = '#2563EB';
const BLUE_PALE = '#DBEAFE';
const LILAC = '#F0F4F8';      // surface-light
const GREEN = '#10B981';
const GREEN_DEEP = '#059669';
const HAIR = 'rgba(15,23,42,0.08)';
const MUTED = 'rgba(15,23,42,0.60)';
const FAINT = 'rgba(15,23,42,0.40)';
const SHADOW_CARD = '0 32px 64px -16px rgba(15,23,42,0.14)';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDemoFilling, setIsDemoFilling] = useState(false);

  // Clear any existing errors when mounting
  useEffect(() => {
    clearError();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email || !password) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Elite UX helper to auto-fill mock credentials with a clean transition
  const handleAutoFillDemo = () => {
    setIsDemoFilling(true);
    let emailStr = 'saul.martinez@katedra.com';
    let passStr = 'admin123';

    setEmail('');
    setPassword('');

    let currentEmail = '';
    let currentPass = '';

    let emailIdx = 0;
    const emailInterval = setInterval(() => {
      if (emailIdx < emailStr.length) {
        currentEmail += emailStr[emailIdx];
        setEmail(currentEmail);
        emailIdx++;
      } else {
        clearInterval(emailInterval);

        let passIdx = 0;
        const passInterval = setInterval(() => {
          if (passIdx < passStr.length) {
            currentPass += passStr[passIdx];
            setPassword(currentPass);
            passIdx++;
          } else {
            clearInterval(passInterval);
            setIsDemoFilling(false);
          }
        }, 30);
      }
    }, 20);
  };

  const inputStyle = {
    fontFamily: BODY,
    background: '#fff',
    border: `1.5px solid ${HAIR}`,
    color: INK
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between relative overflow-hidden" style={{ background: LILAC, color: INK, fontFamily: BODY }}>

      {/* Soft ambient wash */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(50% 40% at 50% 0%, rgba(219,234,254,0.6) 0%, rgba(240,244,248,0) 70%), radial-gradient(40% 30% at 85% 100%, rgba(209,250,229,0.5) 0%, rgba(240,244,248,0) 70%)`
      }} />

      {/* Header */}
      <header className="w-full h-[64px] flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 z-50 relative" style={{ borderBottom: `1px solid ${HAIR}`, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => navigate('/')}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105" style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}>
            <img src={isDarkMode ? '/katedra-dark-mode.jpeg' : '/katedra-light-mode.jpeg'} alt="Katedra Logo" className="w-full h-full object-cover" />
          </div>
          <span style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-lg transition-colors duration-300">Katedra</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full transition-colors cursor-pointer" style={{ background: '#fff', border: `1px solid ${HAIR}`, color: MUTED }} aria-label="Alternar Tema">
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D97706"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
          <Button variant="tertiary" onClick={() => navigate('/')} className="text-sm font-semibold" style={{ fontFamily: BODY, color: INK }}>
            Volver al Inicio
          </Button>
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="login-page-container flex-1 flex flex-col justify-center items-center py-16 px-4 z-10 relative">
        <div className="w-full max-w-[420px] space-y-7">

          {/* Header Info */}
          <div className="login-header-area flex flex-col items-center text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, background: BLUE_PALE, color: BLUE }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
              Área de Acceso Autorizado
            </span>
            <h1 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em', lineHeight: 1.05 }} className="font-bold text-4xl pt-1">
              Ingresar a Katedra
            </h1>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed max-w-[320px]">
              Introduce tus credenciales para acceder a la plataforma de gestión académica.
            </p>
          </div>

          {/* Ultra-clean card on surface-light */}
          <div className="login-card relative overflow-hidden" style={{ background: '#fff', border: `1px solid ${HAIR}`, borderRadius: '28px', padding: '36px', boxShadow: SHADOW_CARD }}>

            <form onSubmit={handleSubmit} className="login-form space-y-5">

              {/* Email Input */}
              <div className="login-form-group flex flex-col space-y-2">
                <label className="login-label text-[11px] uppercase tracking-wider font-bold" style={{ fontFamily: BODY, color: MUTED }}>Correo Electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@katedra.com"
                    disabled={loading || isDemoFilling}
                    className="login-input w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = `0 0 0 4px ${BLUE_PALE}`; }}
                    onBlur={(e) => { e.target.style.borderColor = HAIR; e.target.style.boxShadow = 'none'; }}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: FAINT }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="login-form-group flex flex-col space-y-2">
                <label className="login-label text-[11px] uppercase tracking-wider font-bold" style={{ fontFamily: BODY, color: MUTED }}>Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading || isDemoFilling}
                    className="login-input w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = `0 0 0 4px ${BLUE_PALE}`; }}
                    onBlur={(e) => { e.target.style.borderColor = HAIR; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer" style={{ color: FAINT }} tabIndex="-1">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="login-row flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer transition-colors duration-150" style={{ fontFamily: BODY, color: MUTED }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded cursor-pointer w-4 h-4" style={{ accentColor: BLUE }} />
                  <span>Recuérdame</span>
                </label>
                <span onClick={() => {}} className="transition-colors duration-150 cursor-pointer font-semibold" style={{ fontFamily: BODY, color: BLUE }}>¿Olvidaste tu contraseña?</span>
              </div>

              {/* Error Feedbacks */}
              {(validationError || error) && (
                <div className="login-error text-sm px-4 py-3 rounded-xl font-medium" style={{ fontFamily: BODY, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}>
                  {validationError || error}
                </div>
              )}

              {/* Submit CTA */}
              <Button variant="primary" type="submit" disabled={loading || isDemoFilling}
                className="w-full py-3.5 font-bold !rounded-xl cursor-pointer !bg-[#0F172A] !text-white"
                style={{ fontFamily: BODY, boxShadow: '0 12px 28px -8px rgba(15,23,42,0.45)' }}>
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* SSO Separator */}
            <div className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: `1px solid ${HAIR}` }}></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="px-3 font-bold" style={{ fontFamily: BODY, background: '#fff', color: FAINT }}>O ingresar con</span>
              </div>
            </div>

            {/* SSO Providers */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', svg: (<><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></>) },
                { label: 'Microsoft', svg: (<><path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#7FBA00" d="M13 1h10v10H13z" /><path fill="#01A6F0" d="M1 13h10v10H1z" /><path fill="#FFB900" d="M13 13h10v10H13z" /></>) }
              ].map((p) => (
                <button key={p.label} type="button" onClick={handleAutoFillDemo}
                  className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5"
                  style={{ fontFamily: BODY, background: '#fff', border: `1.5px solid ${HAIR}`, color: INK }}>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">{p.svg}</svg>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Link to Register */}
            <div className="mt-6 text-center">
              <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm">
                ¿No tienes una cuenta?{' '}
                <span onClick={() => navigate('/register')} className="cursor-pointer font-bold" style={{ color: BLUE }}>Regístrate</span>
              </p>
            </div>

            {/* Demo Helper */}
            <div className="mt-6 pt-5 text-center" style={{ borderTop: `1px solid ${HAIR}` }}>
              <button type="button" onClick={handleAutoFillDemo} disabled={isDemoFilling || loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50"
                style={{ fontFamily: BODY, background: 'rgba(16,185,129,0.08)', color: GREEN_DEEP, border: `1px solid rgba(16,185,129,0.2)` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }}></span>
                <span>⚡ Autocompletar Cuenta Demo</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
