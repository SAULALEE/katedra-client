import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';

export default function ResponsiveSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Usuarios',
      path: '/usuarios',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Mis Temarios',
      path: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Contenidos Generados',
      path: '/contenidos',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Generar Nuevo',
      path: '/generador',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between p-6 bg-surface-1">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('/')}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-hairline bg-surface-1 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-brand-primary/30 group-hover:shadow-[0_4px_12px_rgba(var(--brand-primary-rgb,5,43,88),0.15)]">
            <img 
              src={isDarkMode ? '/katedra-dark-mode.jpeg' : '/katedra-light-mode.jpeg'} 
              alt="Katedra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] text-ink group-hover:text-brand-primary transition-colors duration-300">Katedra</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-surface-2 text-ink border-hairline'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-2/50 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-ink-muted'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme Toggle & User Card */}
      <div className="border-t border-hairline pt-4 flex flex-col gap-4 mt-8">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium border border-hairline bg-surface-2 hover:bg-surface-3 hover:border-hairline-strong text-ink transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
            <span>{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-indigo-500' : 'bg-surface-4'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(5,43,88,0.3)]">
            {user?.avatarInitials || 'PA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{user?.nombre || 'Prof. Alejandro'}</p>
            <p className="text-[10px] text-ink-muted truncate">{user?.rol || 'Docente Premium'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full mt-1 text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>CERRAR SESIÓN</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar with Hamburger menu button */}
      <div className="md:hidden flex items-center justify-between w-full h-[56px] border-b border-hairline px-4 bg-canvas/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-hairline bg-surface-1 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
            <img 
              src={isDarkMode ? '/katedra-dark-mode.jpeg' : '/katedra-light-mode.jpeg'} 
              alt="Katedra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-semibold text-sm text-ink group-hover:text-brand-primary transition-colors duration-300">Katedra</span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-surface-1 rounded-md border border-hairline text-ink-muted hover:text-ink transition-colors cursor-pointer"
          aria-label="Abrir Menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Off-canvas mobile drawer overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Mobile Sidebar Drawer */}
      <aside className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 border-r border-hairline transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-hairline bg-surface-1 flex-col shrink-0 min-h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}

