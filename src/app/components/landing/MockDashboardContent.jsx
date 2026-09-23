import { Bell, Plus, Trash2, ArrowRight, Book, Folder, Heart } from 'lucide-react';

export default function MockDashboardContent({ colors, setShowNotifications, showNotifications, notifications, setShowModal, asignaturas, totalTemarios, handleDelete, renderIcon, isDarkMode }) {
  return (
        <div style={{
          flex: 1,
          background: colors.panelBg,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowY: 'auto'
        }}>
          <div className="kt-mock-header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: '10px', color: colors.faint, fontWeight: 500 }}>Mis Asignaturas / Administra tus asignaturas</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: colors.heading, letterSpacing: '-0.5px' }}>Mis Asignaturas</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    background: colors.bg1,
                    color: colors.muted,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Bell size={15} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }}></span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    right: 0,
                    width: '220px',
                    background: colors.bg1,
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadowPanel,
                    borderRadius: '10px',
                    padding: '8px',
                    zIndex: 50
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: colors.heading, marginBottom: '6px', borderBottom: `1px solid ${colors.borderSoft}`, paddingBottom: '4px' }}>Notificaciones</div>
                    {notifications.length === 0 ? (
                      <div style={{ fontSize: '10px', color: colors.faint, textAlign: 'center', padding: '8px 0' }}>Sin notificaciones</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                        {notifications.map(n => (
                          <div key={n.id} style={{ fontSize: '9px', padding: '4px', borderRadius: '4px', background: colors.bg2 }}>
                            <div style={{ fontWeight: 600, color: colors.heading }}>{n.title}</div>
                            <div style={{ color: colors.text }}>{n.msg}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowModal(true)}
                style={{
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(16,185,129,0.2)'
                }}
              >
                <Plus size={14} />
                <span>Agregar asignatura</span>
              </button>
            </div>
          </div>

          <div className="kt-mock-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px', flexShrink: 0 }}>
            <div style={{
              background: colors.bg1,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: colors.shadowCard
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'grid', placeItems: 'center' }}>
                <Folder size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>ASIGNATURAS</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>{asignaturas.length} activas</div>
              </div>
            </div>

            <div style={{
              background: colors.bg1,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: colors.shadowCard
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                <Book size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>TEMARIOS TOTALES</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>{totalTemarios} creados</div>
              </div>
            </div>

            <div style={{
              background: colors.bg1,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: colors.shadowCard
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', display: 'grid', placeItems: 'center' }}>
                <Heart size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>FAVORITOS</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.heading, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>0</span>
                  <span style={{ fontSize: '9px', color: '#10B981', cursor: 'pointer' }}>ver todos →</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>Biblioteca de Asignaturas</span>
            <span style={{ padding: '1px 6px', borderRadius: '100px', background: colors.borderSoft, fontSize: '10px', fontWeight: 700, color: colors.muted }}>{asignaturas.length}</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '12px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {asignaturas.map(asig => (
              <div
                key={asig.id}
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 14px',
                  boxShadow: colors.shadowCard,
                  height: '110px'
                }}
              >
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '4px', background: asig.color }} />

                <button
                  onClick={(e) => handleDelete(asig.id, asig.nombre, e)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'none',
                    border: 'none',
                    color: colors.faint,
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = colors.faint}
                >
                  <Trash2 size={12} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: asig.color + '18',
                    color: asig.color,
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    {renderIcon(asig.icon, 14, asig.color)}
                  </div>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
                  {asig.nombre}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifycontent: 'space-between' }}>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: colors.faint }}>{asig.temariosCount} Temarios</span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    background: asig.color,
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={() => setShowModal(true)}
              style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                height: '110px',
                background: 'transparent',
                transition: 'border-color 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = isDarkMode ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.02)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                color: '#10B981',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '6px'
              }}>
                <Plus size={14} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: colors.heading }}>Agregar asignatura</div>
              <div style={{ fontSize: '8px', color: colors.faint }}>Nombre, color e ícono</div>
            </div>
          </div>
        </div>
  );
}
