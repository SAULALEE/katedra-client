import React from 'react';
import { LogOut, Moon, Settings, Sun } from 'lucide-react';
import { formatRoleDisplay } from '../utils/roleUtils';
import { useSuscripcion } from '../hooks/useSuscripcion';
import { AjustesPopover } from './AjustesPopover';
import { PlanBadge } from './PlanBadge';

/** Avatar initial, ignoring academic titles: "Dra. Ana" -> "A". */
const getInitial = (name) => {
  if (!name) return 'U';
  const clean = name.replace(/^(prof\.|dra\.|dr\.|ing\.|mtra\.|mtro\.|lic\.)\s*/i, '').trim();
  return (clean[0] || 'U').toUpperCase();
};

/**
 * Sidebar footer: theme toggle, user identity, settings and logout.
 *
 * Was duplicated verbatim across the five panel pages (Dashboard, Users, Generator,
 * GeneratedContents, ContentViewer), and had already drifted between them. Extracting it
 * is not just hygiene: it is the only way the settings gear lives in one place instead of
 * five copies that would drift again.
 *
 * Theme arrives as a prop rather than from useThemeStore on purpose: each panel page keeps
 * its own useState reading 'katedra-theme' from localStorage, and their inline <style>
 * blocks key off the data-kt-theme attribute those pages write. The global store would
 * desync the two systems.
 *
 * @param {object} props.user
 * @param {'light'|'dark'} props.theme
 * @param {() => void} props.onToggleTheme
 * @param {() => void} props.onLogout
 * @param {() => void} props.onAbrirPlan - opens the plan modal
 */
export const SidebarUserMenu = ({ user, theme, onToggleTheme, onLogout, onAbrirPlan }) => {
  const [ajustesAbierto, setAjustesAbierto] = React.useState(false);
  const menuRef = React.useRef(null);

  // The single place that fetches usage per screen: this component is on all five panel
  // pages, so loading here stops every consumer from repeating the request.
  const { uso, loading } = useSuscripcion(true);

  // The sidebar collapses to 76px via data-kt-collapsed on [data-root], which the pages
  // drive with CSS rather than React state, so it has to be observed. Collapsed, the avatar
  // (38px) and the gear (30px) do not fit on one row and overflow:hidden clipped the gear
  // away entirely, leaving it unreachable.
  const [colapsado, setColapsado] = React.useState(false);
  React.useEffect(() => {
    const root = document.querySelector('[data-root]');
    if (!root) return undefined;

    const leer = () => setColapsado(root.getAttribute('data-kt-collapsed') === 'true');
    leer();
    const observer = new MutationObserver(leer);
    observer.observe(root, { attributes: true, attributeFilter: ['data-kt-collapsed'] });
    return () => observer.disconnect();
  }, []);

  // Same pattern as ExportDropdown: outside click and Escape close the popover.
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

      {/* position:relative anchors the popover; every <aside> already has overflow visible. */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <div
          className="kt-navrow"
          style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '6px 8px', overflow: 'hidden', flexDirection: colapsado ? 'column' : 'row' }}
        >
          <div style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '11px', background: 'linear-gradient(150deg,#38BDF8,#2563EB)', display: 'grid', placeItems: 'center', fontFamily: "'Manrope'", fontWeight: 800, fontSize: '13px', color: '#fff' }}>
            {getInitial(nombreVisible)}
          </div>
          <div className="kt-sidelabel" style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '13px', color: 'var(--kt-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nombreVisible}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '11px', color: 'var(--kt-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatRoleDisplay(user?.rol)}
              </span>
              {/* Only rendered for Pro: a permanent "Gratis" pill under the name would read
                  as a standing reproach rather than information. */}
              {uso?.plan && uso.plan !== 'free' && <PlanBadge plan={uso.plan} size="sm" />}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAjustesAbierto((abierto) => !abierto)}
            aria-haspopup="menu"
            aria-expanded={ajustesAbierto}
            aria-label="Ajustes de la cuenta"
            title="Ajustes"
            style={{ flex: 'none', width: '30px', height: '30px', marginTop: colapsado ? '4px' : 0, display: 'grid', placeItems: 'center', borderRadius: '9px', border: '1px solid transparent', background: ajustesAbierto ? 'var(--kt-chip-bg)' : 'transparent', color: ajustesAbierto ? 'var(--kt-heading)' : 'var(--kt-muted)', cursor: 'pointer', transition: 'background .18s, color .18s' }}
          >
            <Settings size={17} />
          </button>
        </div>

        {ajustesAbierto && (
          // Opens upward: this block sits at the bottom of the sidebar, so a downward
          // popover would fall off the window.
          <div
            role="menu"
            // Two background layers, with an opaque --kt-bg1 underneath on purpose: this
            // popover overlaps the theme toggle and has no backdrop isolating it, so any
            // translucency lets the switch show through the menu. --kt-panel-bg (66%) and
            // even --kt-modal-bg (96%) both leaked it.
            //
            // Collapsed, the sidebar is 76px and the 240px menu cannot sit inside it, so it
            // is anchored to the right edge instead of stretched to the rail's width.
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              ...(colapsado ? { left: 0 } : { left: 0, right: 0 }),
              minWidth: '240px',
              zIndex: 60,
              borderRadius: '16px',
              border: '1px solid var(--kt-modal-border)',
              background: 'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2)), var(--kt-bg1)',
              boxShadow: 'var(--kt-shadow-modal)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <AjustesPopover
              uso={uso}
              cargando={loading}
              onAbrirPlan={() => { setAjustesAbierto(false); onAbrirPlan?.(); }}
              onLogout={onLogout}
            />
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
