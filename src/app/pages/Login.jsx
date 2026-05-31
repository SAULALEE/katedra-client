import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import Button from '../components/Button';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-brand-primary selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Glowing Accents (SaaS aesthetic) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none z-0" />

      {/* Upper Navigation Header - Consistent and elegant */}
      <header className="w-full h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <div className="w-5 h-5 rounded-sm bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(5,43,88,0.5)]">
            <span className="text-[10px] font-bold text-white">K</span>
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] text-ink">Katedra</span>
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
            onClick={() => navigate('/')}
            className="text-xs"
          >
            Volver al Inicio
          </Button>
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="login-page-container">
        <div className="w-full max-w-[440px]">
          
          {/* Header Info */}
          <div className="login-header-area">
            <StatusBadge pulseColor="bg-[#052B58]">
              Área de Acceso Autorizado
            </StatusBadge>
            
            <h1 className="font-sans font-bold text-2xl tracking-headline text-ink leading-tight" style={{ marginTop: '0.75rem' }}>
              Ingresar a Katedra
            </h1>
            
            <p className="text-ink-muted text-xs tracking-body leading-relaxed max-w-[320px]" style={{ marginTop: '0.35rem' }}>
              Introduce tus credenciales para acceder a la plataforma de gestión académica.
            </p>
          </div>

          {/* Form Container Card - Ultra-premium SaaS Glassmorphism */}
          <div className="login-card bg-surface-1 border-hairline">
            {/* Top decorative glow border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-80" />
            
            <form onSubmit={handleSubmit} className="login-form">
              
              {/* Email Form Group */}
              <div className="login-form-group">
                <label className="login-label">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@katedra.com"
                  disabled={loading}
                  className="login-input bg-surface-2 border-hairline text-ink"
                />
              </div>

              {/* Password Form Group */}
              <div className="login-form-group">
                <label className="login-label">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="login-input bg-surface-2 border-hairline text-ink"
                />
              </div>

              {/* Remember Me & Forgot Password Links */}
              <div className="login-row">
                <label className="flex items-center gap-2 text-ink-muted cursor-pointer hover:text-ink transition-colors duration-150 text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-brand-primary rounded border-hairline bg-surface-2 cursor-pointer"
                    style={{ width: '14px', height: '14px', margin: '0' }}
                  />
                  <span>Recuérdame</span>
                </label>
                
                <span 
                  onClick={() => {}} 
                  className="text-brand-primary hover:text-brand-primary/80 transition-colors duration-150 cursor-pointer font-medium text-[11px]"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* Error Feedbacks */}
              {(validationError || error) && (
                <div className="login-error animate-fade-in">
                  {validationError || error}
                </div>
              )}

              {/* Submit CTA - Premium Symmetrical Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-semibold shadow-[0_4px_20px_rgba(5,43,88,0.25)] hover:shadow-[0_4px_25px_rgba(5,43,88,0.35)] transition-all"
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Global Symmetrical Footer */}
      <Footer />
    </div>
  );
}
