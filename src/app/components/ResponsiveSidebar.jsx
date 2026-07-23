import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import { formatRoleDisplay, isAdmin } from '../utils/roleUtils';

const KICKER = 'text-[10px] font-extrabold uppercase tracking-[1.35px] text-ink-muted select-none';

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Mis Temarios',
      path: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Generador',
      path: '/generador',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5},
    {
      name: 'Contenidos Generados',
      path: '/contenidos',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }, d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ].filter((item) => isAdmin(user) ? item.path === '/usuarios' : item.path !== '/usuarios');

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-1">
      {/* Top Section */}
      <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-none">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group px-1" onClick={() => handleNavigation('/')}>
          <span className="font-sans font-bold tracking-tight text-lg text-ink group-hover:text-blue-600 transition-colors duration-300">
            Katedra
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-2">
          <span className={`${KICKER} ml-2 mb-1`}>Menú Principal</span>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-canvas border border-hairline shadow-soft text-ink'
                      : 'bg-transparent border border-transparent text-ink-muted hover:bg-canvas hover:border-hairline hover:-translate-y-0.5 hover:shadow-soft hover:text-ink'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors duration-300 ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-surface-2 text-ink-muted group-hover:bg-blue-50'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-5 mt-auto flex flex-col gap-3 bg-surface-1 border-t border-hairline">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold bg-surface-2 border border-hairline hover:bg-canvas hover:border-hairline-strong hover:-translate-y-0.5 hover:shadow-soft text-ink transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
            <span>{isDarkMode ? 'Oscuro' : 'Claro'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-indigo-500' : 'bg-surface-4'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-[12px] bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-soft shrink-0">
            {user?.avatarInitials || 'PA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold tracking-tight text-ink truncate">{user?.nombre || 'Prof. Alejandro'}</p>
            <p className="text-[10px] font-semibold text-ink-muted truncate">{user?.rol ? formatRoleDisplay(user.rol) : 'Docente Premium'}</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer shadow-none hover:shadow-soft hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>CERRAR SESIÓN</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar with Hamburger menu button */}
      <div className="md:hidden flex items-center justify-between w-full h-[60px] border-b border-hairline px-4 bg-canvas/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <span className="font-sans font-bold tracking-tight text-sm text-ink group-hover:text-blue-600 transition-colors duration-300">Katedra</span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-surface-2 rounded-xl border border-hairline text-ink-muted hover:text-ink transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-soft"
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
          className="md:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Mobile Sidebar Drawer */}
      <aside className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-[260px] border-r border-hairline bg-surface-1 transform transition-transform duration-300 ease-in-out shadow-illustrative ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {renderSidebarContent()}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-[260px] border-r border-hairline bg-surface-1 flex-col shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>
    </>
  );
}

