import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';

const NAV_LINKS = [
  { href: '#features', label: 'Características' },
  { href: '#impact', label: 'Impacto' },
  { href: '#pricing', label: 'Precios' },
  { href: '#tech', label: 'Tecnología' },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLanding = location.pathname === '/';
  const isGlass = isLanding ? scrolled : true;

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  const handlePanelRedirect = () => {
    setIsOpen(false);
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleHomeRedirect = () => {
    setIsOpen(false);
    navigate('/');
  };

  const handleCta = isLanding ? handlePanelRedirect : handleHomeRedirect;
  const ctaLabel = isLanding ? (isAuthenticated ? 'Ir al Panel' : 'Ingresar al Panel') : 'Volver al Inicio';

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto max-w-[1080px] w-full rounded-full transition-all duration-300 border ${
          isGlass
            ? 'bg-surface-1/80 dark:bg-surface-1/80 backdrop-blur-md border-hairline shadow-md'
            : 'bg-transparent border-transparent shadow-none'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-3 sm:px-4 py-2 sm:py-2.5">
          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group pl-1"
            onClick={() => navigate('/')}
          >
            <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-hairline bg-surface-1 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/katedra.svg"
                alt="Katedra"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-sans font-bold text-[15px] tracking-tight text-ink">
              Katedra
            </span>
          </div>

          {/* Desktop links — marketing nav only, exclusive to Landing */}
          {isLanding && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 text-ink-muted hover:bg-surface-2 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-hairline bg-surface-1/60 hover:bg-surface-2 text-ink-muted hover:text-ink transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleCta}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              {ctaLabel}
            </button>
          </div>

          {/* Mobile — hamburger only when there's a marketing nav to collapse */}
          {isLanding ? (
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Menú principal"
              className="md:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-hairline bg-surface-1/70 text-ink transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          ) : (
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Alternar tema"
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-hairline bg-surface-1/60 text-ink-muted hover:text-ink transition-all duration-200 cursor-pointer"
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleCta}
                className="px-4 py-2 rounded-full text-[13px] font-bold text-white bg-brand-primary transition-transform duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
              >
                {ctaLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu — floating card beneath the pill, marketing nav only */}
      {isLanding && isOpen && (
        <div
          className="md:hidden mx-auto max-w-[1080px] mt-3 rounded-3xl p-5 flex flex-col gap-1 animate-fade-in bg-surface-1/95 dark:bg-surface-1/95 backdrop-blur-md border border-hairline shadow-md"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold py-2.5 px-2 rounded-xl text-ink transition-colors hover:bg-surface-2"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-hairline">
            <button
              onClick={handlePanelRedirect}
              className="w-full py-3 rounded-full text-sm font-bold text-white bg-brand-primary transition-transform duration-200 active:scale-[0.98] cursor-pointer"
            >
              {isAuthenticated ? 'Ir al Panel' : 'Ingresar al Panel'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}