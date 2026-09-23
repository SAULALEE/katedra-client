import { Folder, Heart, Sparkles, History, Moon, Sun, ChevronLeft, Settings } from 'lucide-react';

export default function MockSidebar({ colors, isDarkMode, setIsDarkMode }) {
  return (
        <div className="kt-mock-sidebar" style={{
          width: '200px',
          background: colors.sidebarBg,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px 12px', borderBottom: `1px solid ${colors.borderSoft}` }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #34D399, #10B981)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: '13px'
            }}>K</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: colors.heading }}>Katedra</span>
            <ChevronLeft size={14} style={{ marginLeft: 'auto', color: colors.faint }} />
          </div>

          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: colors.faint, margin: '14px 4px 6px', textTransform: 'uppercase' }}>
            Menú Principal
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '10px',
              background: isDarkMode ? 'rgba(16,185,129,0.1)' : '#E6F4EA',
              color: isDarkMode ? '#34D399' : '#0F172A',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              <Folder size={15} color={isDarkMode ? '#34D399' : '#10B981'} />
              <span>Mis Asignaturas</span>
            </div>
            {['Mis Favoritos', 'Generador', 'Historial'].map((t, idx) => {
              const icons = [
                <Heart size={15} color={colors.muted} />,
                <Sparkles size={15} color={colors.muted} />,
                <History size={15} color={colors.muted} />
              ];
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  color: colors.text,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  {icons[idx]}
                  <span>{t}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '10px',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                border: 'none',
                color: colors.text,
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  background: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
                  color: isDarkMode ? '#818CF8' : '#D97706'
                }}>
                  {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
                </span>
                <span>{isDarkMode ? 'Oscuro' : 'Claro'}</span>
              </div>
              <div style={{
                width: '26px',
                height: '14px',
                borderRadius: '100px',
                background: isDarkMode ? '#10B981' : '#CBD5E1',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  transform: isDarkMode ? 'translateX(12px)' : 'translateX(0)',
                  transition: 'transform 0.2s'
                }} />
              </div>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: `1px solid ${colors.borderSoft}`, paddingTop: '10px' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '11px'
              }}>E</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Profr. Velasco</div>
                <div style={{ fontSize: '9px', color: colors.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Profesor</div>
              </div>
              <Settings size={13} style={{ color: colors.faint, cursor: 'pointer' }} />
            </div>
          </div>
        </div>
  );
}
