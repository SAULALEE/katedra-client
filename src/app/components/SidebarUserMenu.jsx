import React from 'react';
import { LogOut, Moon, Settings, Sun } from 'lucide-react';
import { formatRoleDisplay } from '../utils/roleUtils';

/**
 * Devuelve la inicial del avatar, ignorando títulos académicos: "Dra. Ana" -> "A".
 */
const getInitial = (name) => {
  if (!name) return 'U';
  const clean = name.replace(/^(prof\.|dra\.|dr\.|ing\.|mtra\.|mtro\.|lic\.)\s*/i, '').trim();
  return (clean[0] || 'U').toUpperCase();
};

/**
 * Pie del sidebar: cambio de tema, identidad del usuario, ajustes y cierre de sesión.
 *
 * Antes estaba duplicado literal en las cinco páginas del panel (Dashboard, Users,
 * Generator, GeneratedContents, ContentViewer). Ya habían divergido entre sí, así que
 * extraerlo no es sólo higiene: es la única forma de que el engranaje de ajustes exista
 * en un sitio y no en cinco copias que se vuelvan a separar.
 *
 * El tema llega por props y no desde useThemeStore a propósito: cada página del panel
 * mantiene su propio useState leyendo 'katedra-theme' de localStorage, y los bloques
 * <style> dependen del atributo data-kt-theme que esas páginas escriben. Usar el store
 * global desincronizaría ambos sistemas.
 *
 * @param {object}   props.user
 * @param {'light'|'dark'} props.theme
 * @param {() => void} props.onToggleTheme
 * @param {() => void} props.onLogout
 * @param {React.ReactNode} props.children - contenido del popover de ajustes
 */
export const SidebarUserMenu = ({ user, theme, onToggleTheme, onLogout, children }) => {
  const [ajustesAbierto, setAjustesAbierto] = React.useState(false);
  const menuRef = React.useRef(null);

  // Mismo patrón que ExportDropdown: clic fuera y Escape cierran el popover.
  React.useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setAjustesAbierto(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setAjustesAbierto(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const nombreVisible = user?.nombre || user?.email || 'Docente';

  return (
    <div style={{ marginTop: 'auto', padding: '16px 14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button
        onClick={onToggleTheme}
        className="kt-navrow"
        style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', background: 'var(--kt-chip-bg)', border: '1px solid var(--kt-chip-border)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
      >
        {theme === 'dark'
          ? <Sun size={18} color="#F59E0B" style={{ flex: 'none' }} />
          : <Moon size={18} style={{ flex: 'none', color: 'var(--kt-muted)' }} />}
        <span className="kt-sidelabel" style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '13px', color: 'var(--kt-text)' }}>
          {theme === 'dark' ? 'Claro' : 'Oscuro'}
        </span>
        <span className="kt-sidelabel" style={{ marginLeft: 'auto', width: '38px', height: '22px', borderRadius: '20px', position: 'relative', flex: 'none', transition: 'background .25s', background: theme === 'dark' ? '#10B981' : '#CBD5E1' }}>
          <span style={{ position: 'absolute', top: '2px', left: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'transform .25s', transform: theme === 'dark' ? 'translateX(16px)' : 'translateX(0)' }}></span>
        </span>
      </button>

      {/* position:relative ancla el popover; el <aside> necesita overflow visible. */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <div className="kt-navrow" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '6px 8px', overflow: 'hidden' }}>
          <div style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '11px', background: 'linear-gradient(150deg,#38BDF8,#2563EB)', display: 'grid', placeItems: 'center', fontFamily: "'Manrope'", fontWeight: 800, fontSize: '13px', color: '#fff' }}>
            {getInitial(nombreVisible)}
          </div>
          <div className="kt-sidelabel" style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '13px', color: 'var(--kt-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nombreVisible}
            </div>
            <div style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '11px', color: 'var(--kt-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formatRoleDisplay(user?.rol)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAjustesAbierto((abierto) => !abierto)}
            aria-haspopup="menu"
            aria-expanded={ajustesAbierto}
            aria-label="Ajustes de la cuenta"
            title="Ajustes"
            style={{ flex: 'none', width: '30px', height: '30px', display: 'grid', placeItems: 'center', borderRadius: '9px', border: '1px solid transparent', background: ajustesAbierto ? 'var(--kt-chip-bg)' : 'transparent', color: ajustesAbierto ? 'var(--kt-heading)' : 'var(--kt-muted)', cursor: 'pointer', transition: 'background .18s, color .18s' }}
          >
            <Settings size={17} />
          </button>
        </div>

        {ajustesAbierto && (
          // Abre hacia arriba: este bloque vive al fondo del sidebar, así que un popover
          // hacia abajo se saldría de la ventana.
          <div
            role="menu"
            style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, minWidth: '240px', zIndex: 60, borderRadius: '16px', border: '1px solid var(--kt-panel-border)', background: 'var(--kt-panel-bg)', boxShadow: 'var(--kt-shadow-modal)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            {children}
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        className="kt-nav kt-navrow"
        style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '11px', border: '1px solid rgba(244,63,94,.22)', background: 'rgba(244,63,94,.08)', color: '#FB7185', cursor: 'pointer' }}
      >
        <span style={{ flex: 'none' }}><LogOut size={18} /></span>
        <span className="kt-sidelabel" style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '12.5px', letterSpacing: '.3px' }}>CERRAR SESIÓN</span>
      </button>
    </div>
  );
};

export default SidebarUserMenu;
