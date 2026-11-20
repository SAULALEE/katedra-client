import React, { useState } from 'react';
import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/useThemeStore';
import { formatRoleDisplay, isAdmin } from '../utils/roleUtils';
import './dashboardShell.css';

/**
 * Dashboard sidebar with the teacher Dashboard look (dashboardShell.css). Must render inside
 * an element with the `kd-root` class, which provides the theme and accent tokens.
 */
export default function ResponsiveSidebar({ navigationItems, homePath = '/', logoutPath = '/', brandSuffix } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [asignaturasOpen, setAsignaturasOpen] = useState(true);

  const menuItems = navigationItems || (isAdmin(user) ? [
    {
      name: 'Usuarios',
      path: '/usuarios',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ] : [
    {
      name: 'Mis Asignaturas',
      path: '/dashboard?view=asignaturas',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      subItems: [
        {
          name: 'Mis Favoritos',
          path: '/dashboard?view=favoritos',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )
        }
      ]
    },
    {
      name: 'Generador',
      path: '/generador',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: 'Historial de Contenidos',
      path: '/contenidos',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate(logoutPath);
  };

  const isActivePath = (path) => location.pathname + location.search === path
    || (path.includes('/dashboard') && location.pathname === '/dashboard' && !location.search)
    || (!path.includes('?') && location.pathname === path);

  const initials = user?.avatarInitials
    || (user?.nombre || '').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    || 'K';

  const brand = (
    <button type="button" className="kd-brand" onClick={() => handleNavigation(homePath)} aria-label="Ir al inicio">
      <span className="kd-brand-mark" aria-hidden="true">K</span>
      <span className="kd-brand-name">Katedra{brandSuffix && <em>{brandSuffix}</em>}</span>
    </button>
  );

  return (
    <>
      <div className="kd-topbar">
        {brand}
        <button type="button" className="kd-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className="kd-overlay" data-open={isOpen} onClick={() => setIsOpen(false)} />

      <aside className="kd-sidebar" data-open={isOpen}>
        {brand}
        <div className="kd-menutitle">Menú principal</div>
        <nav className="kd-nav" aria-label="Menú principal">
          {menuItems.map((item) => (
            <React.Fragment key={item.path}>
              <button type="button" className="kd-navrow" aria-current={isActivePath(item.path) ? 'page' : undefined} onClick={() => handleNavigation(item.path)}>
                <span className="kd-navrow-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.subItems && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={asignaturasOpen ? 'Contraer' : 'Desplegar'}
                    onClick={(e) => { e.stopPropagation(); setAsignaturasOpen(!asignaturasOpen); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setAsignaturasOpen(!asignaturasOpen); } }}
                    style={{ display: 'grid', placeItems: 'center', transform: asignaturasOpen ? 'none' : 'rotate(-90deg)', transition: 'transform .2s' }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                )}
              </button>
              {item.subItems && asignaturasOpen && (
                <div className="kd-subnav">
                  {item.subItems.map((sub) => (
                    <button key={sub.path} type="button" className="kd-navrow" aria-current={isActivePath(sub.path) ? 'page' : undefined} onClick={() => handleNavigation(sub.path)}>
                      <span className="kd-navrow-icon">{sub.icon}</span>
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="kd-sidebar-footer">
          <button type="button" className="kd-theme-toggle" onClick={toggleTheme} aria-pressed={isDarkMode}>
            <span className="kd-theme-toggle-label">{isDarkMode ? <Moon size={17} /> : <Sun size={17} />}{isDarkMode ? 'Oscuro' : 'Claro'}</span>
            <span className="kd-switch" data-on={isDarkMode} aria-hidden="true" />
          </button>

          <div className="kd-user">
            <span className="kd-avatar" aria-hidden="true">{initials}</span>
            <div style={{ minWidth: 0 }}>
              <p className="kd-user-name">{user?.nombre || 'Usuario'}</p>
              <p className="kd-user-role">{user?.rol ? formatRoleDisplay(user.rol) : ''}</p>
            </div>
          </div>

          <button type="button" className="kd-logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
