import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import Button from './Button';
import Container from './Container';

export default function ResponsiveTopNav() {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-50 flex items-center">
      <Container size="7xl" className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-hairline bg-surface-1 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-brand-primary/30 group-hover:shadow-[0_4px_12px_rgba(var(--brand-primary-rgb,5,43,88),0.15)]">
            <img 
              src={isDarkMode ? '/katedra-dark-mode.jpeg' : '/katedra-light-mode.jpeg'} 
              alt="Katedra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] text-ink group-hover:text-brand-primary transition-colors duration-300">Katedra</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-body-sm text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors font-medium">Características</a>
          <a href="#impact" className="hover:text-ink transition-colors font-medium">Impacto</a>
          <a href="#tech" className="hover:text-ink transition-colors font-medium">Tecnología</a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard')}
            className="text-body-sm px-4 py-2"
          >
            Ingresar al Panel
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 hover:bg-surface-1 rounded-md border border-hairline text-ink-muted hover:text-ink transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </Container>

      {/* Mobile Drawer Links */}
      {mobileMenuOpen && (
        <div className="absolute top-[56px] left-0 right-0 border-b border-hairline bg-surface-1 p-6 flex flex-col gap-4 animate-fade-in z-50 md:hidden">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-2"
          >
            Características
          </a>
          <a 
            href="#impact" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-2"
          >
            Impacto
          </a>
          <a 
            href="#tech" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-ink-muted hover:text-ink py-2"
          >
            Tecnología
          </a>
          <Button 
            variant="primary" 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/dashboard');
            }}
            className="w-full text-center"
          >
            Ingresar al Panel
          </Button>
        </div>
      )}
    </header>
  );
}
