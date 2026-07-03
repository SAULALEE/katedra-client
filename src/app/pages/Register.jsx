import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import Button from '../components/Button';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isAuthenticated, loading, error, clearError } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Clear errors when mounting
  useEffect(() => {
    clearError();
  }, [clearError]);

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

    if (!nombre || !email || !password || !confirmPassword) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setValidationError('Debe aceptar los términos y condiciones.');
      return;
    }

    const success = await register(email, password, nombre);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-brand-primary selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Glowing Accents & Tech Grids */}
      <div className="absolute top-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0 opacity-40"></div>

      {/* Upper Navigation Header */}
      <header className="w-full h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => navigate('/')}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-hairline bg-surface-1 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-brand-primary/30 group-hover:shadow-[0_4px_12px_rgba(var(--brand-primary-rgb,5,43,88),0.15)]">
            <img 
              src={isDarkMode ? '/katedra-dark-mode.jpeg' : '/katedra-light-mode.jpeg'} 
              alt="Katedra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] text-ink group-hover:text-brand-primary transition-colors duration-300">Katedra</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Alternar Tema"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          <Button 
            variant="tertiary" 
            onClick={() => navigate('/login')}
            className="text-xs"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Main Register Form Area */}
      <main className="login-page-container flex-1 flex flex-col justify-center items-center py-16 px-4 z-10">
        <div className="w-full max-w-[440px] space-y-6">
          
          {/* Header Info */}
          <div className="login-header-area flex flex-col items-center text-center space-y-2">
            <StatusBadge pulseColor="bg-brand-primary" className="border border-brand-primary/20 bg-brand-primary/5">
              Registro de Nuevo Docente
            </StatusBadge>
            
            <h1 className="font-sans font-bold text-3xl tracking-headline text-ink leading-tight pt-1">
              Crear Cuenta
            </h1>
            
            <p className="text-ink-muted text-xs sm:text-sm tracking-body leading-relaxed max-w-[320px]">
              Regístrate en Katedra para empezar a generar y gestionar tu contenido curricular.
            </p>
          </div>

          {/* Form Container Card - Ultra-premium SaaS Glassmorphism */}
          <div className="login-card bg-surface-1/95 border border-hairline rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Top decorative gradient glow border */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            
            <form onSubmit={handleSubmit} className="login-form space-y-4">
              
              {/* Nombre Input */}
              <div className="login-form-group flex flex-col space-y-1.5">
                <label className="login-label text-[10px] uppercase tracking-wider text-ink-muted font-bold">Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Prof. Alejandro Ruiz"
                  disabled={loading}
                  className="login-input w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 text-xs text-ink outline-none transition-all duration-200 placeholder:text-ink-tertiary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Email Input */}
              <div className="login-form-group flex flex-col space-y-1.5">
                <label className="login-label text-[10px] uppercase tracking-wider text-ink-muted font-bold">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@katedra.com"
                  disabled={loading}
                  className="login-input w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 text-xs text-ink outline-none transition-all duration-200 placeholder:text-ink-tertiary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Password Input */}
              <div className="login-form-group flex flex-col space-y-1.5">
                <label className="login-label text-[10px] uppercase tracking-wider text-ink-muted font-bold">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    className="login-input w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 text-xs text-ink outline-none transition-all duration-200 placeholder:text-ink-tertiary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink transition-colors cursor-pointer"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="login-form-group flex flex-col space-y-1.5">
                <label className="login-label text-[10px] uppercase tracking-wider text-ink-muted font-bold">Confirmar Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                  className="login-input w-full bg-surface-2 border border-hairline rounded-xl px-4 py-3 text-xs text-ink outline-none transition-all duration-200 placeholder:text-ink-tertiary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Accept Terms Checkbox */}
              <div className="login-row flex items-start gap-2 text-[11px] pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-brand-primary rounded border-hairline bg-surface-2 cursor-pointer w-3.5 h-3.5 mt-0.5"
                />
                <label htmlFor="acceptTerms" className="text-ink-muted cursor-pointer hover:text-ink transition-colors duration-150 leading-relaxed">
                  Acepto los <span className="text-brand-primary font-medium">Términos del Servicio</span> y la <span className="text-brand-primary font-medium">Política de Privacidad</span> de Katedra.
                </label>
              </div>

              {/* Error Feedbacks */}
              {(validationError || error) && (
                <div className="login-error bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl animate-fade-in font-medium">
                  {validationError || error}
                </div>
              )}

              {/* Submit CTA */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-bold shadow-[0_4px_20px_rgba(5,43,88,0.3)] hover:shadow-[0_6px_25px_rgba(5,43,88,0.5)] transition-all rounded-xl cursor-pointer mt-2"
              >
                {loading ? 'Creando Cuenta...' : 'Registrar Cuenta'}
              </Button>
            </form>

            <div className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-hairline"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-surface-1 px-3 text-ink-tertiary font-bold">O continuar con</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 bg-surface-2 border border-hairline hover:border-hairline-strong rounded-xl py-2.5 text-xs text-ink-muted hover:text-ink transition-all duration-150 cursor-pointer font-medium"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Back to Login Redirect Link */}
            <div className="mt-6 border-t border-hairline/60 pt-4 text-center">
              <p className="text-xs text-ink-muted">
                ¿Ya tienes una cuenta?{' '}
                <span 
                  onClick={() => navigate('/login')}
                  className="text-brand-primary hover:text-brand-primary/80 transition-colors duration-150 cursor-pointer font-bold"
                >
                  Iniciar Sesión
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Global Symmetrical Footer */}
      <Footer />
    </div>
  );
}
