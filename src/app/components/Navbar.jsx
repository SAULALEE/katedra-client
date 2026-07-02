import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import Button from './Button';
import Container from './Container';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const handlePanelRedirect = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="w-full h-[56px] border-b border-hairline bg-canvas text-ink flex items-center sticky top-0 z-50">
      <Container size="7xl" className="flex items-center justify-between h-full">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => navigate('/')}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-hairline bg-surface-1 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-brand-primary/30 group-hover:shadow-[0_4px_12px_rgba(var(--brand-primary-rgb,5,43,88),0.15)]">
            <img 
              src="/katedra.svg" 
              alt="Katedra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] text-ink group-hover:text-brand-primary transition-colors duration-300">
            Katedra
          </span>
        </div>

        {/* Desktop Menu links - typography.body-sm (14px, tracking 0) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors duration-150">Características</a>
          <a href="#impact" className="hover:text-ink transition-colors duration-150">Impacto</a>
          <a href="#tech" className="hover:text-ink transition-colors duration-150">Tecnología</a>
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-hairline bg-surface-1 hover:bg-surface-2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
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
            variant="primary" 
            onClick={handlePanelRedirect}
          >
            {isAuthenticated ? 'Ir al Panel' : 'Ingresar al Panel'}
          </Button>
        </div>

        {/* Mobile menu toggle & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-hairline bg-surface-1 text-ink-muted transition-colors cursor-pointer"
            aria-label="Alternar Tema"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-surface-1 rounded-md border border-hairline text-ink-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Menú principal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu Slide Drawer */}
      {isOpen && (
        <div className="absolute top-[56px] left-0 right-0 border-b border-hairline bg-surface-1 p-6 flex flex-col gap-4 animate-fade-in z-50 md:hidden shadow-xl">
          <a 
            href="#features" 
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-1 transition-colors"
          >
            Características
          </a>
          <a 
            href="#impact" 
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-1 transition-colors"
          >
            Impacto
          </a>
          <a 
            href="#tech" 
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-1 transition-colors"
          >
            Tecnología
          </a>
          <div className="border-t border-hairline my-2 pt-4">
            <Button 
              variant="primary" 
              onClick={() => {
                setIsOpen(false);
                handlePanelRedirect();
              }}
              className="w-full text-center"
            >
              {isAuthenticated ? 'Ir al Panel' : 'Ingresar al Panel'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}