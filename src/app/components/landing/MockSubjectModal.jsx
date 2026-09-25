import { X } from 'lucide-react';

export default function MockSubjectModal({ showModal, colors, isDarkMode, handleCreate, setShowModal, setName, name, SUGGESTIONS, SUBJECT_COLORS, setSelectedColor, selectedColor, SUBJECT_ICONS, selectedIcon, setSelectedIcon }) {
  return showModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeUp 0.2s both'
        }}>
          <form onSubmit={handleCreate} style={{
            background: colors.bg1,
            border: `1px solid ${colors.border}`,
            borderRadius: '14px',
            boxShadow: colors.shadowPanel,
            padding: '18px',
            width: '310px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.borderSoft}`, paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>Agregar asignatura</span>
              <button
                type="button"
                onClick={() => { setShowModal(false); setName(''); }}
                style={{ background: 'none', border: 'none', color: colors.faint, cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: colors.faint, display: 'block', marginBottom: '4px' }}>NOMBRE</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Química Orgánica"
                required
                style={{
                  width: '100%',
                  height: '32px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border}`,
                  background: isDarkMode ? '#152033' : '#F1F5F9',
                  color: colors.heading,
                  padding: '0 10px',
                  fontSize: '12px'
                }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                {SUGGESTIONS.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setName(sug)}
                    style={{
                      fontSize: '8px',
                      padding: '3px 6px',
                      borderRadius: '4px',
                      background: colors.bg2,
                      border: 'none',
                      color: colors.muted,
                      cursor: 'pointer'
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: colors.faint, display: 'block', marginBottom: '4px' }}>COLOR</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {SUBJECT_COLORS.map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: col,
                      border: selectedColor === col ? (isDarkMode ? '2px solid #fff' : '2px solid #000') : 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: colors.faint, display: 'block', marginBottom: '4px' }}>ÍCONO</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.keys(SUBJECT_ICONS).map(iconKey => {
                  const IconComp = SUBJECT_ICONS[iconKey];
                  const isSel = selectedIcon === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setSelectedIcon(iconKey)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: isSel ? 'rgba(16,185,129,0.15)' : colors.bg2,
                        border: isSel ? '1px solid #10B981' : 'none',
                        color: isSel ? '#10B981' : colors.muted,
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <IconComp size={12} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', borderTop: `1px solid ${colors.borderSoft}`, paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => { setShowModal(false); setName(''); }}
                style={{
                  height: '28px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  background: 'none',
                  border: `1.5px solid ${colors.border}`,
                  color: colors.muted,
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  height: '28px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(16,185,129,0.2)'
                }}
              >
                Crear Asignatura
              </button>
            </div>
          </form>
        </div>
  );
}
