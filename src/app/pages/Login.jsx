import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => { clearError(); }, [clearError]);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();
    if (!email || !password) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between relative overflow-hidden bg-canvas transition-colors duration-300">
      {/* Premium ambient gradient wash background matching the screenshot mountains vibe but with Katedra colors */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,rgba(16,185,129,0.07),transparent_50%)]" />
        {/* Soft background light/dark shape */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Floating capsule navigation header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center w-full px-4 pt-36 pb-16 relative z-10">
        <div className="w-full max-w-[460px] flex flex-col items-center">
          
          {/* Main Card with 28px radius (illustrative capsule) and soft backdrop blur */}
          <div className="w-full bg-surface-1/80 dark:bg-surface-1/90 backdrop-blur-md border border-hairline rounded-[28px] p-8 sm:p-10 shadow-hi relative overflow-hidden transition-all duration-300">
            {/* Top brand icon inside the card */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 select-none shadow-soft bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-ink">
                ¡Bienvenido de vuelta!
              </h1>
              <p className="text-sm text-ink-muted mt-2">
                Introduce tus datos para acceder a tu cuenta.
              </p>
            </div>

            {/* Google SSO button at the top as shown in the Whimsical reference */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-canvas dark:bg-[#010102] border border-hairline rounded-xl font-bold hover:bg-surface-2 dark:hover:bg-[#141516] transition-all duration-300 shadow-soft hover:-translate-y-0.5 select-none cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-sm text-ink">Continuar con Google</span>
            </button>

            {/* Separator */}
            <div className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-hairline"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-extrabold text-ink-muted">
                <span className="px-3 bg-surface-1 dark:bg-surface-1">o ingresar con correo</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted ml-1">Correo Electrónico</label>
                <div className="relative group w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@dominio.com"
                    disabled={loading}
                    className="w-full bg-canvas dark:bg-canvas border border-hairline rounded-xl px-4 py-3 pr-12 text-sm text-ink placeholder-ink-tertiary focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-subtle transition-colors duration-300 group-focus-within:text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted ml-1">Contraseña</label>
                <div className="relative group w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-canvas dark:bg-canvas border border-hairline rounded-xl px-4 py-3 pr-12 text-sm text-ink placeholder-ink-tertiary focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-ink-subtle hover:text-ink transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1 select-none w-full">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-ink-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded cursor-pointer w-4 h-4 accent-blue-600"
                  />
                  <span className="hover:text-ink transition-colors">Recuérdame</span>
                </label>
              </div>

              {/* Error Feedbacks */}
              {(validationError || error) && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-500 leading-relaxed">
                  {validationError || error}
                </div>
              )}

              {/* Submit CTA */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-bold rounded-xl cursor-pointer transition-all duration-300 mt-2 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-soft hover:shadow-elevated hover:-translate-y-0.5"
              >
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Forgot Password Link centered inside card */}
            <div className="mt-4 text-center">
              <span onClick={() => {}} className="cursor-pointer text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </span>
            </div>
          </div>

          {/* Link to Register outside the card */}
          <p className="text-sm font-medium text-ink-muted mt-6 text-center">
            ¿No tienes una cuenta?{' '}
            <span
              onClick={() => navigate('/register')}
              className="cursor-pointer font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              Regístrate gratis
            </span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
