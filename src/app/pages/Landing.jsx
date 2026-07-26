import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { usePlanes } from '../hooks/usePlanes';
import { useSuscripcionStore } from '../store/suscripcionStore';
import { PlanModal } from '../components/PlanModal';
import {
  Folder, Heart, Sparkles, History, Moon, Sun, Bell, Settings, Plus, ChevronLeft,
  X, Book, Globe, Calculator, Dna, Feather, Check, Trash2, ArrowRight, FileText, Monitor, FileQuestion
} from 'lucide-react';

// Animated Counter component that starts when it enters the viewport
function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = null;
    const duration = 1500;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasStarted, target]);

  return (
    <span ref={elementRef}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const getMockThemeStyles = (isDark) => {
  if (isDark) {
    return {
      bg1: '#0F172A',
      bg2: '#1E293B',
      bg3: '#0F172A',
      text: '#E2E8F0',
      heading: '#F8FAFC',
      muted: '#94A3B8',
      faint: '#64748B',
      border: 'rgba(148, 163, 184, 0.12)',
      borderSoft: 'rgba(148, 163, 184, 0.06)',
      cardBg: 'rgba(30, 41, 59, 0.7)',
      sidebarBg: '#0B1120',
      panelBg: '#0F172A',
      shadowPanel: '0 20px 50px rgba(0,0,0,0.5)',
      shadowCard: '0 8px 16px rgba(0,0,0,0.4)',
      scrollbar: 'rgba(148, 163, 184, 0.2)'
    };
  }
  return {
    bg1: '#FFFFFF',
    bg2: '#F8FAFC',
    bg3: '#FFFFFF',
    text: '#475569',
    heading: '#0F172A',
    muted: '#64748B',
    faint: '#94A3B8',
    border: 'rgba(15, 23, 42, 0.08)',
    borderSoft: 'rgba(15, 23, 42, 0.04)',
    cardBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    panelBg: '#F8FAFC',
    shadowPanel: '0 24px 50px -28px rgba(15,23,42,0.16)',
    shadowCard: '0 6px 14px rgba(15,23,42,0.04)',
    scrollbar: 'rgba(15,23,42,0.1)'
  };
};

const SUBJECT_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];
const SUBJECT_ICONS = {
  book: Book,
  globe: Globe,
  calculator: Calculator,
  dna: Dna,
  feather: Feather
};

function MockAdminPanel() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10B981');
  const [selectedIcon, setSelectedIcon] = useState('book');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState([]);

  const SUGGESTIONS = ['Biología Celular', 'Cálculo Integral', 'Historia Moderna', 'Química Orgánica', 'Física Cuántica'];

  const addToast = (title, msg) => {
    // Only ever called from handleCreate/handleDelete (user-triggered), never during
    // render — the linter can't trace that through the nested call.
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const handleCreate = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    // Only called from this click/submit handler, never during render.
    const newAsig = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      nombre: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      // eslint-disable-next-line react-hooks/purity
      temariosCount: Math.floor(Math.random() * 4) + 1
    };
    setAsignaturas(prev => [...prev, newAsig]);
    setName('');
    setShowModal(false);

    addToast('Asignatura creada', `"${newAsig.nombre}" fue agregada.`);
    setNotifications(prev => [
      { id: Date.now(), title: 'Asignatura creada', msg: `Se creó la asignatura ${newAsig.nombre}.`, time: 'Ahora' },
      ...prev
    ]);
  };

  const handleDelete = (id, nombre, e) => {
    e.stopPropagation();
    setAsignaturas(prev => prev.filter(a => a.id !== id));
    addToast('Asignatura eliminada', `"${nombre}" fue removida.`);
    setNotifications(prev => [
      { id: Date.now(), title: 'Asignatura eliminada', msg: `Se eliminó la asignatura ${nombre}.`, time: 'Ahora' },
      ...prev
    ]);
  };

  const totalTemarios = asignaturas.reduce((sum, a) => sum + a.temariosCount, 0);
  const colors = getMockThemeStyles(isDarkMode);

  const renderIcon = (iconKey, size = 16, color = 'inherit') => {
    switch (iconKey) {
      case 'book': return <Book size={size} color={color} />;
      case 'globe': return <Globe size={size} color={color} />;
      case 'calculator': return <Calculator size={size} color={color} />;
      case 'dna': return <Dna size={size} color={color} />;
      case 'feather': return <Feather size={size} color={color} />;
      default: return <Folder size={size} color={color} />;
    }
  };

  return (
    <div className="kt-mock-panel" style={{
      width: '100%',
      maxWidth: '840px',
      height: '460px',
      borderRadius: '18px',
      border: `1px solid ${colors.border}`,
      background: colors.bg1,
      color: colors.text,
      boxShadow: colors.shadowPanel,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      {/* Top Window Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '11px 16px',
        borderBottom: `1px solid ${colors.border}`,
        background: isDarkMode ? '#1e293b' : '#f8fafc',
        flexShrink: 0
      }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
        <div style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          fontSize: '11px',
          fontWeight: 600,
          color: colors.faint,
          background: isDarkMode ? 'rgba(0,0,0,0.2)' : '#ffffff',
          border: `1.5px solid ${colors.border}`,
          padding: '2px 30px',
          borderRadius: '6px',
          width: '220px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          app.katedra.com/dashboard
        </div>
      </div>

      {/* Main Row */}
      <div className="kt-mock-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left Sidebar */}
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

        {/* Content Pane */}
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
      </div>

      {showModal && (
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
      )}

      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: isDarkMode ? '#1e293b' : '#ffffff',
              border: '1.5px solid #10B981',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'floatY 0.25s both',
              pointerEvents: 'auto',
              width: '200px'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#E6F4EA',
              color: '#10B981',
              display: 'grid',
              placeItems: 'center'
            }}>
              <Check size={10} strokeWidth={3} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#10B981' }}>{t.title}</div>
              <div style={{ fontSize: '9px', color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { planes, loading: planesLoading, error: planesError } = usePlanes();
  const abrirCheckout = useSuscripcionStore((state) => state.abrirCheckout);
  const [planModalAbierto, setPlanModalAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  // Preview data (SUBJECTS/activeCourse below) and the tier-switch handlers are not yet
  // wired into the rendered markup — kept as in-progress scaffolding rather than deleted.
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const planesVisibles = planes.filter((plan) => !plan.ciclo || plan.ciclo === (billing === 'monthly' ? 'mensual' : 'anual'));

  const comprarPlan = (plan) => {
    if (plan.id === 'free') {
      navigate(isAuthenticated ? '/dashboard' : '/register');
      return;
    }
    if (isAuthenticated) {
      // Same entry point as every locked feature elsewhere (Generator, Dashboard, Users):
      // the comparison modal first, checkout only after "Mejorar a Pro" inside it.
      setPlanModalAbierto(true);
      return;
    }
    const ciclo = plan.ciclo || (billing === 'monthly' ? 'mensual' : 'anual');
    const checkoutIntent = { planId: plan.id, ciclo };
    sessionStorage.setItem('katedra_checkout_intent', JSON.stringify(checkoutIntent));
    navigate('/login', { state: { checkoutIntent } });
  };

  // Simulated content generation when subject or tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1150);
    return () => clearTimeout(timer);
  }, [selectedSubject, selectedTab]);

  // eslint-disable-next-line no-unused-vars
  const handleSelectSubject = (idx) => {
    setIsLoading(true);
    setSelectedSubject(idx);
    setSelectedTab(0);
  };

  // eslint-disable-next-line no-unused-vars
  const handleSelectTab = (idx) => {
    setIsLoading(true);
    setSelectedTab(idx);
  };

  const SUBJECTS = [
    {
      name: 'Biología',
      icon: '🧬',
      topic: 'Biología Celular',
      accent: '#10B981',
      modules: [
        { title: 'Estructura Celular y Organelos', desc: 'Membranas, citoesqueleto y el sistema de endomembranas.', weeks: 'Sem 1–2' },
        { title: 'Respiración Celular', desc: 'Glucólisis, el ciclo de Krebs y la fosforilación oxidativa.', weeks: 'Sem 3–4' },
        { title: 'Fotosíntesis', desc: 'Reacciones lumínicas, el ciclo de Calvin y captura de energía.', weeks: 'Sem 5' },
        { title: 'División Celular y el Ciclo', desc: 'Mitosis, meiosis y regulación de puntos de control.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'Respiración Mitocondrial',
      theory: [
        'La mitocondria es el sitio principal de síntesis de ATP en las células eucariotas. El piruvato generado por la glucólisis se importa a la matriz, donde se descarboxila y se introduce en el ciclo del ácido cítrico.',
        'Cada vuelta del ciclo libera transportadores de electrones — NADH y FADH₂ — que donan electrones a la cadena respiratoria incrustada en la membrana interna, estableciendo un gradiente de protones.',
        'La ATP sintasa aprovecha la fuerza protón-motriz para fosforilar el ADP, produciendo aproximadamente 30–32 ATP por molécula de glucosa bajo condiciones aeróbicas.'
      ],
      theoryCitation: 'Citado automáticamente · Alberts, Biología Molecular de la Célula, 6.ª ed.',
      exerciseTitle: 'Respiración · Opción Múltiple',
      exercises: [
        { question: '¿En qué compartimento tiene lugar el ciclo del ácido cítrico?', options: ['Citoplasma', 'Matriz mitocondrial', 'Núcleo', 'Membrana interna'], answer: 1 },
        { question: '¿Qué alimenta directamente a la ATP sintasa?', options: ['Gradiente de protones', 'NADPH', 'Fosforilación a nivel de sustrato', 'Entrada de calcio'], answer: 0 }
      ],
      slidesTitle: 'Respiración Celular — Diapositivas',
      slides: ['Por qué las células necesitan ATP', 'Glucólisis de un vistazo', 'El ciclo de Krebs', 'Cadena de transporte de electrones']
    },
    {
      name: 'Historia',
      icon: '🏛️',
      topic: 'La Guerra Fría',
      accent: '#475569', // Slate Blue Accent
      modules: [
        { title: 'Orígenes, 1945–1947', desc: 'Yalta, Potsdam y la ruptura de la alianza de guerra.', weeks: 'Sem 1–2' },
        { title: 'Contención y Crisis', desc: 'El bloqueo de Berlín, Corea y la crisis de los misiles en Cuba.', weeks: 'Sem 3–5' },
        { title: 'Détente y Guerras Proxy', desc: 'Vietnam, control de armas y los Acuerdos de Helsinki.', weeks: 'Sem 6–7' },
        { title: 'Colapso, 1985–1991', desc: 'Glasnost, perestroika y la caída del Muro.', weeks: 'Sem 8' }
      ],
      theoryTitle: 'La Doctrina de la Contención',
      theory: [
        'Articulated by George Kennan en su artículo "X" de 1947, la contención sostenía que el expansionismo soviético podía ser frenado mediante una presión firme en una serie de puntos geográficos y políticos.',
        'La doctrina dio forma a la Doctrina Truman y al Plan Marshall, comprometiendo a los Estados Unidos con la reconstrucción económica y militar de Europa Occidental.',
        'Los críticos argumentaron que la contención era reactiva y costosa, arrastrando a las superpotencias a conflictos indirectos en Asia, África y América Latina.'
      ],
      theoryCitation: 'Citado automáticamente · Gaddis, La Guerra Fría',
      exercises: [
        { question: '¿Quién escribió el artículo "X" de 1947 sobre la contención?', options: ['Dean Acheson', 'George Kennan', 'Harry Truman', 'John Foster Dulles'], answer: 1 },
        { question: '¿Qué programa reconstruyó económicamente Europa Occidental?', options: ['Lend-Lease', 'El Plan Marshall', 'OTAN', 'Bretton Woods'], answer: 1 }
      ],
      slidesTitle: 'La Guerra Fría — Diapositivas',
      slides: ['Un continente dividido', 'Explicación de la contención', 'Puntos de conflicto', 'Hacia 1991']
    },
    {
      name: 'Cálculo',
      icon: '📐',
      topic: 'Cálculo Integral',
      accent: '#2C5282', // Steel Blue Accent
      modules: [
        { title: 'Antiderivadas', desc: 'Integrales indefinidas y la regla de potencia inversa.', weeks: 'Sem 1' },
        { title: 'La Integral Definida', desc: 'Sumas de Riemann y el Teorema Fundamental.', weeks: 'Sem 2–3' },
        { title: 'Técnicas de Integración', desc: 'Sustitución, partes y fracciones parciales.', weeks: 'Sem 4–5' },
        { title: 'Aplicaciones', desc: 'Área, volumen de revolución y longitud de arco.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'El Teorema Fundamental del Cálculo',
      theory: [
        'El Teorema Fundamental conecta la diferenciación y la integración: si F es una antiderivada de una función continua f, entonces la integral definida de f de a a b es igual a F(b) − F(a).',
        'Este resultado transforma el problema de calcular áreas bajo curvas —resuelto históricamente sumando límites— en la búsqueda de antiderivadas.',
        'Su segunda parte garantiza que la función de acumulación definida por una integral es diferenciable, con derivada igual al integrando original.'
      ],
      theoryCitation: 'Citado automáticamente · Stewart, Cálculo: Trascendentes Tempranas',
      exercises: [
        { question: '¿Cuál es la integral de 2x dx?', options: ['x² + C', '2 + C', 'x²', '2x² + C'], answer: 0 },
        { question: 'El TFC conecta la integración con qué operación?', options: ['Multiplicación', 'Diferenciación', 'Factorización', 'Límites'], answer: 1 }
      ],
      slidesTitle: 'Cálculo Integral — Diapositivas',
      slides: ['El área como acumulación', 'Sumas de Riemann', 'Las dos partes del TFC', 'Ejemplos resueltos']
    },
    {
      name: 'Literatura',
      icon: '📖',
      topic: 'Poesía Modernista',
      accent: '#F59E0B',
      modules: [
        { title: 'Raíces del Modernismo', desc: 'Simbolismo, imagismo y ruptura de la forma romántica.', weeks: 'Sem 1–2' },
        { title: 'Eliot y La Tierra Baldía', desc: 'Fragmentación, alusión y el método mítico.', weeks: 'Sem 3–4' },
        { title: 'Pound e Imagismo', desc: 'Precisión, la imagen y "hacerlo nuevo".', weeks: 'Sem 5' },
        { title: 'Voces Posteriores', desc: 'Stevens, Moore y la línea americana.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'El Método Mítico',
      theory: [
        'Los poetas modernistas respondieron a un mundo de posguerra fracturado abandonando la narrativa continua a favor de la yuxtaposición, el collage y la alusión al mito y la historia.',
        'T. S. Eliot describió este "método mítico" como una forma de dar forma y significado al caos de la experiencia contemporánea al alinearla con patrones antiguos.',
        'El resultado es una poesía que exige una lectura active: ensamblar el significado a partir de fragmentos en lugar de recibirlo de un hablante estable.'
      ],
      theoryCitation: 'Citado automáticamente · Eliot, "Ulysses, Order, and Myth" (1923)',
      exercises: [
        { question: '¿Qué poeta acuñó la frase "make it new"?', options: ['T. S. Eliot', 'Ezra Pound', 'Wallace Stevens', 'W. B. Yeats'], answer: 1 },
        { question: 'El "método mítico" da orden a la experiencia al alinearla con:', options: ['Leyes científicas', 'Mitos antiguos', 'Ideología política', 'Diarios personales'], answer: 1 }
      ],
      slidesTitle: 'Poesía Modernista — Diapositivas',
      slides: ['Un siglo fracturado', 'Imagismo y precisión', 'La Tierra Baldía', 'Leyendo los fragmentos']
    }
  ];

  const INTEGRATIONS = [
    {
      name: 'Documento Word',
      dotColor: '#2563EB',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Back document */}
          <rect x="8" y="3" width="13" height="18" rx="1.5" />
          <line x1="12" y1="8" x2="17" y2="8" />
          <line x1="12" y1="12" x2="17" y2="12" />
          <line x1="12" y1="16" x2="16" y2="16" />
          {/* Front square with W */}
          <rect x="3" y="7" width="10" height="10" rx="1.5" fill={color} />
          <path d="M5.5 10l1.25 4 1.25-3 1.25 3 1.25-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Google Forms',
      dotColor: '#9333EA',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Google Forms sheet with lines and round bullet points */}
          <rect x="4" y="2" width="16" height="20" rx="3" fill="none" />
          <line x1="9" y1="7" x2="17" y2="7" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="12" x2="17" y2="12" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="17" x2="17" y2="17" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6.5" cy="7" r="1" fill={color} stroke="none" />
          <circle cx="6.5" cy="12" r="1" fill={color} stroke="none" />
          <circle cx="6.5" cy="17" r="1" fill={color} stroke="none" />
        </svg>
      )
    },
    {
      name: 'Markdown',
      dotColor: '#475569',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M5 8v8l3-3.5L11 16V8" />
          <path d="M17 8v5M15 11.5l2 2 2-2" />
        </svg>
      )
    },
    {
      name: 'Presentación PPTX',
      dotColor: '#D97706',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Back slide with a small pie chart */}
          <rect x="8" y="3" width="13" height="18" rx="1.5" />
          <path d="M12 9a2.5 2.5 0 1 1 5 0H12v2.5" fill={color} opacity="0.3" />
          {/* Front square with P */}
          <rect x="3" y="7" width="10" height="10" rx="1.5" fill={color} />
          <path d="M6.5 10h1.8c.66 0 1.2.54 1.2 1.2s-.54 1.2-1.2 1.2H6.5v2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Documento PDF',
      dotColor: '#DC2626',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <rect x="7" y="12" width="10" height="6" rx="1" fill={color} />
          <text x="8.5" y="16.5" fill="currentColor" fontSize="4.5" fontFamily="system-ui" fontWeight="bold">PDF</text>
        </svg>
      )
    }
  ];

  // Repeat integrations list to ensure seamless infinite horizontal scrolling marquee
  const INTEGRATIONS_LOOP = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];

  const FAQ_DATA = [
    { q: '¿Puedo revisar la teoría generada?', a: 'Sí. La teoría incluye referencias para que puedas verificarla y editarla antes de usarla en clase.' },
    { q: '¿Puedo editar todo lo que Katedra produce?', a: 'Sí. Los módulos, la teoría, las evaluaciones y las diapositivas son totalmente editables dentro de un editor de documentos limpio. Modifica oraciones, cambia preguntas o reestructura bloques antes de exportar.' },
    { q: '¿A qué formatos puedo exportar mis cursos?', a: 'Según el tipo de material, Katedra exporta a Word (DOCX), PDF, Markdown y presentaciones PPTX.' },
    { q: '¿El motor funciona para cualquier materia?', a: 'Katedra maneja ciencias naturales, humanidades, matemáticas, ingeniería y más. Si puedes definir el tema, la inteligencia artificial puede estructurar el temario.' },
    { q: '¿Hay algún plan gratuito?', a: 'Sí, el plan Básico es gratuito para siempre e incluye la creación de cursos completos con un límite mensual. Puedes mejorar a Pro en cualquier momento.' }
  ];

  const STATS_DATA = [
    { target: 40, prefix: '', suffix: '%', label: 'Ahorro de tiempo promedio' },
    { target: 10000, prefix: '+', suffix: '', label: 'Temarios diseñados' },
    { target: 98, prefix: '', suffix: '%', label: 'Índice de satisfacción' }
  ];

  // eslint-disable-next-line no-unused-vars
  const activeCourse = SUBJECTS[selectedSubject];

  // Carousel single color for all text/icons
  const CAROUSEL_COLOR = '#ffffff';

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff', color: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* GLOBAL CUSTOM KEYFRAMES & STYLES */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.08); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .floating-doodles { display: none !important; }
          .feature-showcase-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .pg-grid { grid-template-columns: 1fr !important; }
          .pg-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #EEF1F5 !important;
            gap: 8px !important;
            padding: 10px !important;
          }
          .pg-sidebar-header { display: none !important; }
          .pg-sidebar-footer { display: none !important; }
          .pg-sidebar button { width: auto !important; flex: 0 0 auto !important; margin-bottom: 0 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .footer-grid-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* ============ NAVBAR ============ */}
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(1180px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 14px 11px 20px',
        borderRadius: '16px',
        background: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: scrolled ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: scrolled ? '0 8px 30px rgba(15, 23, 42, 0.10)' : '0 8px 30px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.9px',
            color: scrolled ? '#0F172A' : '#FFFFFF',
            transition: 'color 0.3s ease'
          }}>Katedra</span>
        </a>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['Características', 'Integraciones', 'Planes', 'FAQs'].map((label, i) => {
            const targets = ['#features', '#integrations', '#pricing', '#faqs'];
            return (
              <a
                key={i}
                href={targets[i]}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: scrolled ? '#475569' : 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  padding: '8px 13px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = scrolled ? '#F1F5F9' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = scrolled ? '#0F172A' : '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = scrolled ? '#475569' : 'rgba(255, 255, 255, 0.75)';
                }}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); navigate('/login'); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: scrolled ? '#475569' : '#FFFFFF',
              textDecoration: 'none',
              padding: '9px 15px',
              borderRadius: '9px',
              border: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.15)',
              background: scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? '#F8FAFC' : 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = scrolled ? '#CBD5E1' : 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = scrolled ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)';
            }}
          >
            Acceder
          </a>
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 17px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #2B6CB0, #2C5282)',
              boxShadow: '0 4px 14px rgba(43, 108, 176, 0.42)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
          >
            Registrarse
          </a>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <header id="top" style={{ position: 'relative', padding: '148px 24px 0', background: 'radial-gradient(125% 140% at 18% 8%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 88%, #FCD34D 116%)', overflow: 'hidden' }}>

        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

        {/* Subtle glow blob */}
        <div style={{ position: 'absolute', width: '380px', height: '380px', left: '-80px', bottom: '-160px', borderRadius: '50%', background: 'radial-gradient(circle, #10B981, transparent 68%)', opacity: 0.5, filter: 'blur(10px)', pointerEvents: 'none' }}></div>

        {/* Grid mesh backdrop overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), 
            radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 20px 20px',
          pointerEvents: 'none'
        }}></div>

        <div style={{ relative: 'zIndex', zIndex: 2, maxWidth: '920px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.28)', backdropFilter: 'blur(8px)', marginBottom: '26px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }}></span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.92)', whiteSpace: 'nowrap' }}>
              IA para Educadores
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(38px, 6.6vw, 76px)', lineHeight: 1.02, letterSpacing: '-2px', color: '#fff', margin: '0 0 22px', textWrap: 'balance' }}
          >
            Diseña temarios con apoyo de IA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.86)', maxWidth: '620px', margin: '0 auto 36px', textWrap: 'pretty' }}
          >
            Crea Teoría docente, evaluaciones con respuestas y diapositivas para tus clases en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>menos tiempo</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center' }}
          >
            <a
              href="/register"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '15px 28px',
                borderRadius: '11px',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.28)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.28)'; }}
            >
              Comenzar Gratis
            </a>
            
          </motion.div>
        </div>

        {/* Floating Doc Mockup */}
        <div style={{ zIndex: 2, maxWidth: '840px', margin: '64px auto -120px', paddingBottom: 0, position: 'relative' }}>

          {/* Floating Sticker Doodles */}
          <div className="floating-doodles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {/* Apple */}
            <div style={{ position: 'absolute', top: '-48px', left: '-68px', transform: 'rotate(-9deg)' }}>
              <div style={{ animation: 'floatY 6s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '56px', height: '56px', borderRadius: '16px', background: '#FEF2F2', border: '1.5px solid #FECACA', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 7.2c-1.4-1.9-4.3-2-5.6-.1C5 9 5.3 12.6 6.9 15c1 1.5 1.9 2.9 3.3 2.9.8 0 1.1-.4 1.8-.4s1 .4 1.8 0.4c1.4 0 2.3-1.4 3.3-2.9 1.6-2.4 1.9-6 .5-7.9-1.3-1.9-4.2-1.8-5.6.1Z" />
                  <path d="M12 7.2c-.2-1.6.5-3 1.9-3.6" stroke="#059669" />
                </svg>
              </div>
            </div>

            {/* Lightbulb */}
            <div style={{ position: 'absolute', top: '-46px', right: '-60px', transform: 'rotate(7deg)' }}>
              <div style={{ animation: 'floatY 7s ease-in-out infinite 0.4s', display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', background: '#FFFBEB', border: '1.5px solid #FDE68A', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 18h5M10.5 21h3" />
                  <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.6l.1.6h5.2l.1-.6c.1-.7.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
                  <path d="M12 3V1.5M4.6 6 3.5 5M19.4 6l1.1-1" stroke="#FBBF24" />
                </svg>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ position: 'absolute', top: '152px', right: '-74px', transform: 'rotate(8deg)' }}>
              <div style={{ animation: 'floatY2 8s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '52px', height: '52px', borderRadius: '14px', background: '#ECFDF5', border: '1.5px solid #A7F3D0', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="4.5" width="14" height="16.5" rx="2.2" />
                  <path d="M9 4.5V3.5h6v1" />
                  <path d="m8 11 1.1 1.1L11.4 10M8 16l1.1 1.1L11.4 15" />
                  <path d="M14 11h3M14 16h3" />
                </svg>
              </div>
            </div>

            {/* Open Book */}
            <div style={{ position: 'absolute', bottom: '78px', left: '-70px', transform: 'rotate(-7deg)' }}>
              <div style={{ animation: 'floatY 7.5s ease-in-out infinite 0.2s', display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', background: '#F1F5F9', border: '1.5px solid #CBD5E1', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6.5C10.3 5.2 7.8 4.8 5.5 5.1v11.2c2.3-.3 4.8.1 6.5 1.4 1.7-1.3 4.2-1.7 6.5-1.4V5.1C16.2 4.8 13.7 5.2 12 6.5Z" />
                  <path d="M12 6.5v11.2" />
                </svg>
              </div>
            </div>

            {/* Sparkles */}
            <div style={{ position: 'absolute', top: '20px', left: '120px', color: '#FCD34D', animation: 'pulseGlow 3.5s ease-in-out infinite' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>
            <div style={{ position: 'absolute', bottom: '120px', right: '20px', color: '#fff', animation: 'pulseGlow 4s ease-in-out infinite 0.6s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>

            {/* Dribbble SaaS UI elements */}
            {/* Floating badge 1: Top-Left */}
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '-80px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '100px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
              animation: 'floatY 6s ease-in-out infinite',
              pointerEvents: 'auto'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>IA Activa · ✦</span>
            </div>

            {/* Floating badge 2: Top-Right */}
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '-90px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)',
              animation: 'floatY 8s ease-in-out infinite 0.5s',
              textAlign: 'left',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={11} color="#3B82F6" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.5px' }}>TEMARIOS</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap' }}>Diapositivas listas en PPTX</span>
            </div>

            {/* Floating badge 3: Bottom-Right */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
              right: '-80px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '100px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
              animation: 'floatY 7s ease-in-out infinite 0.2s',
              pointerEvents: 'auto'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>15 Preguntas con respuestas</span>
            </div>
          </div>

          {/* SVG Glow Connections */}
          <svg style={{ position: 'absolute', inset: '-60px -100px', width: 'calc(100% + 200px)', height: 'calc(100% + 120px)', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <linearGradient id="glowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="glowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M 60 160 Q 140 180 180 230" fill="none" stroke="url(#glowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 880 160 Q 760 180 660 210" fill="none" stroke="url(#glowGrad2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 860 440 Q 760 410 680 390" fill="none" stroke="url(#glowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          <MockAdminPanel />

        </div>

        <div style={{ height: '150px' }}></div>
      </header>

      {/* ============ PROCESS SECTION ============ */}
      <section id="process" style={{ position: 'relative', background: '#fff', padding: '160px 24px 96px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>El Proceso</div>

            <h2 style={{
              fontFamily: "'Inter'",
              fontWeight: 600,
              fontSize: 'clamp(30px, 4.6vw, 52px)',
              lineHeight: 1.05,
              letterSpacing: '-1.6px',
              margin: '0 auto',
              maxWidth: '760px',
              color: '#0F172A'
            }}>
              Materiales estructurados en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>tres pasos</span>.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '17px', color: '#64748B', maxWidth: '560px', margin: '16px auto 0' }}>
              Sin flujos complejos. Solo indícanos qué enseñas y Katedra organizará el material de tu clase con rigor académico.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>

            {/* Card 1: Asignatura */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EEF1F5',
                borderRadius: '24px',
                padding: '16px 16px 36px 16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#EEF1F5';
              }}
            >
              <div style={{
                width: '100%',
                height: '240px',
                background: '#FAFBFC',
                borderRadius: '16px',
                marginBottom: '28px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EEF1F5',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Crear Asignatura */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Book size={16} color="#D97706" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontSize: '6px', fontWeight: 700, padding: '3px 5px', borderRadius: '4px', marginBottom: '3px', letterSpacing: '0.5px' }}>NUEVA ASIGNATURA</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>Crear asignatura</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '6.5px', color: '#94A3B8', marginBottom: '4px' }}>NOMBRE DE LA ASIGNATURA *</div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '5px 8px', fontSize: '10px', color: '#0F172A', background: '#F8FAFC' }}>Español I</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '6.5px', color: '#94A3B8', marginBottom: '4px' }}>COLOR DE LA ASIGNATURA</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['#34D399', '#3B82F6', '#F59E0B', '#F43F5E', '#06B6D4', '#8B5CF6'].map((c, i) => (
                        <div key={i} style={{ width: '14px', height: '14px', borderRadius: '4px', background: c, border: c === '#F59E0B' ? '1.5px solid #000' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {c === '#F59E0B' && <Check size={8} color="#fff" strokeWidth={3.5} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <div style={{ background: '#10B981', color: '#fff', fontSize: '8px', fontWeight: 700, padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16,185,129,0.2)' }}>
                      <Check size={9} strokeWidth={3} color="#fff" /> Crear asignatura
                    </div>
                  </div>
                  <motion.svg
                    initial={{ x: 20, y: 30 }}
                    animate={{ x: [20, -10, 0, 20], y: [30, -5, 5, 30] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', bottom: '15px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>1. Selecciona la materia</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Dinos qué asignatura impartes. Katedra comprende el nivel educativo y adapta automáticamente la profundidad del tema.
              </p>
            </motion.div>

            {/* Card 2: Temario */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EEF1F5',
                borderRadius: '24px',
                padding: '16px 16px 36px 16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#EEF1F5';
              }}
            >
              <div style={{
                width: '100%',
                height: '240px',
                background: '#FAFBFC',
                borderRadius: '16px',
                marginBottom: '28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EEF1F5',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(44,82,130,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Cargar Temario */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontSize: '6px', fontWeight: 700, padding: '3px 5px', borderRadius: '4px', marginBottom: '5px', letterSpacing: '0.5px' }}>CREAR TEMARIO</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#0F172A', marginBottom: '3px' }}>Cargar Temario</div>
                  <div style={{ fontSize: '7px', color: '#64748B', marginBottom: '12px', lineHeight: 1.4 }}>Sube un archivo, ingresa un enlace o define manualmente el temario.</div>

                  <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#64748B', borderRight: '1px solid #E2E8F0' }}>PDF / Archivo</div>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#64748B', borderRight: '1px solid #E2E8F0' }}>Enlace Web</div>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#fff', background: '#10B981', fontWeight: 700 }}>Manual</div>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '5px 6px', fontSize: '6.5px', color: '#065F46', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileQuestion size={10} color="#059669" /> Completa los datos y Katedra organizará el temario.
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '5.5px', color: '#94A3B8', marginBottom: '3px' }}>TÍTULO DEL TEMARIO</div>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '4px 6px', fontSize: '8px', color: '#0F172A' }}>Sujeto y predicado</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '5.5px', color: '#94A3B8', marginBottom: '3px' }}>ASIGNATURA</div>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '4px 6px', fontSize: '8px', color: '#0F172A' }}>Español I</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <div style={{ background: '#10B981', color: '#fff', fontSize: '8px', fontWeight: 700, padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16,185,129,0.2)' }}>
                      Analizar Temario <Sparkles size={9} strokeWidth={2.5} color="#fff" />
                    </div>
                  </div>

                  <motion.svg
                    initial={{ x: -20, y: 15 }}
                    animate={{ x: [-20, 10, 0, -20], y: [15, 30, 10, 15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', bottom: '15px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>2. Estructura el temario</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Construye una secuencia lógica de módulos. Todo el contenido sigue un orden claro para asegurar la progresión de los estudiantes.
              </p>
            </motion.div>

            {/* Card 3: Material */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EEF1F5',
                borderRadius: '24px',
                padding: '16px 16px 36px 16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#EEF1F5';
              }}
            >
              <div style={{
                width: '100%',
                height: '240px',
                background: '#FAFBFC',
                borderRadius: '16px',
                marginBottom: '28px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EEF1F5',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Material Generado */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', borderBottom: '2px solid #0F172A', paddingBottom: '7px', marginBottom: '-8.5px' }}>1. Módulos</span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: '#94A3B8' }}>2. Teoría</span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: '#94A3B8' }}>3. Diapositivas</span>
                  </div>

                  <div style={{ fontSize: '6px', fontWeight: 700, color: '#10B981', letterSpacing: '0.5px', marginBottom: '3px' }}>TEMARIO DEL CURSO</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Español I</div>

                  <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #EEF1F5', borderRadius: '8px', background: '#FCFCFD', marginBottom: '8px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = '#FCFCFD'}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F1F5F9', fontSize: '8px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Sujeto y predicado</div>
                      <div style={{ fontSize: '6.5px', color: '#64748B', lineHeight: 1.4 }}>Núcleo y complementos en la oración.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #EEF1F5', borderRadius: '8px', background: '#FCFCFD', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = '#FCFCFD'}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F1F5F9', fontSize: '8px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Tipos de oraciones</div>
                      <div style={{ fontSize: '6.5px', color: '#64748B', lineHeight: 1.4 }}>Simples y compuestas. Nexos coordinantes.</div>
                    </div>
                  </div>

                  <motion.svg
                    initial={{ x: 20, y: -10 }}
                    animate={{ x: [20, 0, 15, 20], y: [-10, 20, 5, -10] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', top: '25px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>3. Obtén tu clase</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Recibe teoría sustentada, evaluaciones con sus respuestas y diapositivas listas para presentar en el aula.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============ FEATURE SHOWCASE SECTION ============ */}
      <section id="features" style={{ background: '#fff', padding: '60px 24px 120px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Todo Incluido</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 4.6vw, 50px)', lineHeight: 1.06, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '680px', color: '#0F172A' }}>
              Materiales para preparar <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>cada clase</span>.
            </h2>
          </motion.div>

          <div className="feature-showcase-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'center' }}>

            {/* Sidebar Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Teoría Estructurada', desc: 'Teoría docente organizada por módulos, con referencias editables.' },
                { title: 'Exámenes y Evaluaciones', desc: 'Evaluaciones de opción múltiple y preguntas abiertas, con sus respuestas.' },
                { title: 'Diapositivas Listas', desc: 'Diapositivas organizadas por módulo que puedes exportar a PowerPoint.' }
              ].map((ft, i) => {
                const isActive = activeFeature === i;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveFeature(i)}
                    onClick={() => setActiveFeature(i)}
                    style={{
                      padding: '24px 20px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                      background: isActive ? '#ECFDF5' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '18px', color: isActive ? '#065F46' : '#64748B', marginBottom: '6px' }}>{ft.title}</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: '14px', color: isActive ? '#047857' : '#94A3B8', lineHeight: 1.5 }}>{ft.desc}</div>
                  </div>
                )
              })}
            </div>

            {/* Display Screen */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #EEF1F5',
              borderRadius: '24px',
              height: '520px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'inset 0 4px 20px rgba(15,23,42,0.02)'
            }}>
              {/* Fake App Browser Window inside */}
              <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                {/* Header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'grid', placeItems: 'center' }}><Dna size={18} strokeWidth={2.5} /></div>
                  <div>
                    <div style={{ fontSize: '13px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A' }}>Introducción a la web y modelo cliente-servidor.</div>
                    <div style={{ fontSize: '10.5px', fontFamily: "'Inter'", fontWeight: 500, color: '#64748B' }}>Desarrollo Web · Contenido generado con IA</div>
                  </div>
                </div>

                {/* Content Viewer based on active feature */}
                <div style={{ flex: 1, padding: '32px 24px', background: '#FAFBFC', position: 'relative', overflow: 'hidden' }}>
                  {activeFeature === 0 && (
                    // TEORIA MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '24px', maxWidth: '440px', margin: '0 auto', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', color: '#0F172A', display: 'grid', placeItems: 'center' }}><FileText size={15} strokeWidth={2.5} /></div>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Material Teórico</div>
                              <div style={{ fontSize: '9px', color: '#64748B' }}>Lectura de ~4 min</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '9px', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '4px 8px', borderRadius: '4px' }}>Exportar ↓</div>
                        </div>
                        <div style={{ height: '2px', width: '100%', background: '#2B6CB0', borderRadius: '1px', marginBottom: '16px' }}></div>
                        <div style={{ fontSize: '14px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>INTRODUCCIÓN</div>
                        <div style={{ height: '6px', width: '100%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '92%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '96%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '24px' }}></div>
                        <div style={{ fontSize: '14px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Evolución de la Web</div>
                        <div style={{ height: '6px', width: '100%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '85%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                      </div>
                    </motion.div>
                  )}
                  {activeFeature === 1 && (
                    // EVALUACION MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ECFDF5', display: 'grid', placeItems: 'center', color: '#10B981' }}><Check size={16} strokeWidth={3} /></div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Banco de Preguntas</div>
                            <div style={{ fontSize: '9px', color: '#64748B' }}>Cuestionario interactivo</div>
                          </div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', fontSize: '9px', fontFamily: "'Inter'", fontWeight: 700, marginBottom: '12px', letterSpacing: '0.5px' }}>PREGUNTA #1</div>
                          <div style={{ fontSize: '15px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>¿Cuál característica define la Web 1.0?</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F1F5F9', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#64748B' }}>A</div>
                              <div style={{ height: '6px', width: '50%', background: '#E2E8F0', borderRadius: '3px' }}></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1.5px solid #10B981', background: '#ECFDF5', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#D1FAE5', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#047857' }}>B</div>
                              <div style={{ height: '6px', width: '65%', background: '#10B981', borderRadius: '3px' }}></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F1F5F9', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#64748B' }}>C</div>
                              <div style={{ height: '6px', width: '40%', background: '#E2E8F0', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeFeature === 2 && (
                    // DIAPOSITIVAS MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EFF6FF', display: 'grid', placeItems: 'center', color: '#3B82F6' }}><Monitor size={15} strokeWidth={2.5} /></div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Presentación Visual</div>
                            <div style={{ fontSize: '9px', color: '#64748B' }}>Visor de láminas autogeneradas (16:9)</div>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '220px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 16px 40px rgba(15,23,42,0.08)', marginBottom: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ width: '40px', height: '4px', background: '#10B981', marginBottom: '16px' }}></div>
                          <div style={{ fontSize: '10px', fontFamily: "'Inter'", fontWeight: 700, color: '#10B981', letterSpacing: '1px', marginBottom: '12px' }}>DESARROLLO WEB</div>
                          <div style={{ fontSize: '22px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', lineHeight: 1.1, marginBottom: '12px' }}>Introducción a la web y modelo cliente-servidor.</div>
                          <div style={{ fontSize: '12px', fontFamily: "'Inter'", fontWeight: 500, color: '#64748B' }}>Introducción a la web y modelo cliente-servidor</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #10B981', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: 0, color: '#0F172A' }}>
              Horas devueltas <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>cada semana</span>.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {STATS_DATA.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-10%' }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: 'easeOut' }}
                style={{ textAlign: 'center', padding: '38px 24px', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '16px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
              >
                <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 'clamp(42px, 6vw, 60px)', letterSpacing: '-2.4px', lineHeight: 1, background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  <AnimatedCounter target={st.target} prefix={st.prefix} suffix={st.suffix} />
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px', color: '#475569', marginTop: '14px' }}>{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS SECTION ============ */}
      <section id="integrations" style={{
        position: 'relative',
        padding: '88px 0',
        overflow: 'hidden',
        background: 'linear-gradient(110deg, #1D4ED8 0%, #0EA5E9 30%, #10B981 65%, #34D399 100%)',
      }}>
        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.35, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '46px', padding: '0 24px', relative: 'zIndex', zIndex: 1, position: 'relative' }}
        >
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#A7F3D0', marginBottom: '14px' }}>Llévalo a donde sea</div>
          <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: '0 auto', maxWidth: '620px', color: '#ffffff' }}>
            Exporta a las herramientas con las que <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>ya enseñas</span>.
          </h2>
        </motion.div>

        {/* Blurred, semi-transparent carousel marquee */}
        <div style={{ position: 'relative', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
          <div style={{ display: 'flex', gap: '48px', width: 'max-content', animation: 'marquee 32s linear infinite', alignItems: 'center' }}>
            {INTEGRATIONS_LOOP.map((ig, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  opacity: 0.8,
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{
                  display: 'grid',
                  placeItems: 'center',
                  color: CAROUSEL_COLOR,
                }}>
                  {ig.icon(CAROUSEL_COLOR)}
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '18px',
                  color: CAROUSEL_COLOR,
                  letterSpacing: '-0.3px',
                }}>
                  {ig.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section id="pricing" style={{ background: '#ffffff', padding: '120px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '14px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10B981', marginBottom: '16px' }}>Precios</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '640px', color: '#0F172A' }}>
              Planes para tu carga académica.
            </h2>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 60px' }}
          >
            <div style={{ position: 'relative', display: 'flex', padding: '6px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: billing === 'monthly' ? '6px' : '50%',
                width: 'calc(50% - 6px)',
                borderRadius: '12px',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
                transition: 'left .35s cubic-bezier(.4, 0, .2, 1)'
              }}></div>
              <button
                onClick={() => setBilling('monthly')}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '12px 28px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  transition: 'color .3s',
                  color: billing === 'monthly' ? '#0F172A' : '#64748B'
                }}
              >
                Mensual
              </button>
              <button
                onClick={() => setBilling('yearly')}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '12px 28px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color .3s',
                  color: billing === 'yearly' ? '#0F172A' : '#64748B'
                }}
              >
                Anual <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', fontSize: '11px', color: '#10B981', fontWeight: 700 }}>−20%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '820px', margin: '0 auto', alignItems: 'center' }}>
            {planesLoading && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748B' }}>Consultando planes…</p>}
            {planesError && <p role="alert" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#B91C1C' }}>{planesError}</p>}
            {planesVisibles.map((plan, index) => {
              const pro = plan.id !== 'free';
              const monto = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: (plan.moneda || 'mxn').toUpperCase(),
                maximumFractionDigits: 0
              }).format(plan.precio / 100);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-10%' }}
                  transition={{ duration: 0.75, delay: index * 0.1, ease: 'easeOut' }}
                  style={{
                    position: 'relative',
                    padding: '44px 36px',
                    borderRadius: '24px',
                    border: pro ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
                    background: pro ? 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' : '#ffffff',
                    boxShadow: pro ? '0 32px 64px rgba(15,23,42,0.25)' : '0 12px 32px rgba(15,23,42,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: pro ? 'scale(1.04)' : 'scale(1)',
                    zIndex: pro ? 2 : 1,
                  }}
                >
                  {plan.recomendado && (
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', padding: '6px 16px', borderRadius: '100px', background: 'linear-gradient(110deg, #10B981, #34D399)', fontWeight: 700, fontSize: '11px', color: '#fff', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                      MÁS POPULAR
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: '18px', color: pro ? '#ffffff' : '#0F172A', marginBottom: '24px' }}>{plan.nombre}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '32px' }}>
                    <span style={{ fontWeight: 700, fontSize: '52px', letterSpacing: '-2.5px', color: pro ? '#ffffff' : '#0F172A' }}>{monto}</span>
                    <span style={{ fontWeight: 500, fontSize: '15px', color: pro ? '#94A3B8' : '#64748B' }}>{plan.ciclo ? `/${plan.ciclo === 'mensual' ? 'mes' : 'año'}` : '/siempre'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => comprarPlan(plan)}
                    style={{
                      fontWeight: 600,
                      fontSize: '15px',
                      color: pro ? '#0F172A' : '#1E293B',
                      padding: '16px',
                      borderRadius: '12px',
                      border: pro ? 'none' : '1px solid #E2E8F0',
                      background: pro ? 'linear-gradient(110deg, #34D399, #10B981)' : '#F8FAFC',
                      marginBottom: '36px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = pro ? '0 8px 24px rgba(16,185,129,0.25)' : '0 4px 12px rgba(0,0,0,0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {pro ? 'Comenzar con Pro' : 'Empezar gratis'}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontWeight: 500, fontSize: '15px', color: pro ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
                        <Check size={20} color={pro ? '#34D399' : '#10B981'} style={{ flexShrink: 0, marginTop: '1px' }} />
                        {caracteristica}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FAQS SECTION ============ */}
      <section id="faqs" style={{ background: '#F8FAFC', padding: '110px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10B981', marginBottom: '16px' }}>Preguntas Frecuentes</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-1.4px', margin: 0, color: '#0F172A' }}>
              Resolvemos tus dudas.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = idx === openFaq;
              return (
                <div key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '17px', color: isOpen ? '#10B981' : '#1E293B', paddingRight: '24px', transition: 'color 0.2s' }}>
                      {faq.q}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isOpen ? 'rgba(16,185,129,0.1)' : '#F1F5F9',
                      color: isOpen ? '#10B981' : '#64748B',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}>
                      <Plus size={20} strokeWidth={2.5} />
                    </span>
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    maxHeight: isOpen ? '280px' : '0',
                    opacity: isOpen ? 1 : 0
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '15.5px', lineHeight: 1.7, color: '#475569', margin: 0, padding: '0 40px 24px 0' }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA BANNER SECTION ============ */}
      <section style={{ background: '#fff', padding: '20px 24px 96px' }}>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', padding: '64px 32px', borderRadius: '26px', textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(110deg, #1D4ED8 0%, #0EA5E9 30%, #10B981 65%, #34D399 100%)' }}
        >
          {/* Noise overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1.04, letterSpacing: '-1.8px', color: '#fff', margin: '0 auto 16px', maxWidth: '620px', textWrap: 'balance' }}>
              Empieza a preparar tu <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>siguiente temario</span>.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '18px', color: 'rgba(255, 255, 255, 0.86)', margin: '0 auto 30px', maxWidth: '480px' }}>
              Organiza tus contenidos y dedica más tiempo a tus clases.
            </p>
            <a
              href="/register"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              style={{
                display: 'inline-block',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(15, 23, 42, 0.3)'; }}
            >
              Comenzar Gratis
            </a>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: '#0F172A', padding: '64px 24px 36px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '48px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="footer-grid-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#fff' }}>Katedra</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', lineHeight: 1.6, color: '#94A3B8', margin: '0 0 20px', maxWidth: '260px' }}>
                Herramientas para crear Temarios, Teoría docente, Evaluaciones y Diapositivas.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['𝕏', 'in', '✉'].map((so, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="social-icon"
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '9px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      fontSize: '15px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {so}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Producto', links: ['Características', 'Integraciones', 'Planes', 'Actualizaciones'] },
              { title: 'Recursos', links: ['Documentación', 'Guías', 'Blog', 'Comunidad'] },
              { title: 'Compañía', links: ['Acerca de', 'Carreras', 'Contacto', 'Privacidad'] }
            ].map((col, idx) => (
              <div key={idx}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '.4px', textTransform: 'uppercase', color: '#fff', marginBottom: '18px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {col.links.map((lk, li) => (
                    <a
                      key={li}
                      href="#"
                      className="footer-link"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#94A3B8',
                        textDecoration: 'none',
                        width: 'fit-content',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                    >
                      {lk}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '28px' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B' }}>© 2026 Katedra. Todos los derechos reservados.</span>
            <div style={{ display: 'flex', gap: '22px' }}>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Privacidad</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Términos</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Estado</a>
            </div>
          </div>
        </div>
      </footer>

      {/*
        Landing has no [data-root]/dark-mode toggle of its own, so PlanModal's `--kt-*`
        variables would otherwise resolve to nothing here. Mirror the light-theme values
        the panel pages declare, scoped to this wrapper only.
      */}
      <style>{`
        [data-kt-landing-modal]{
          --kt-bg1:#FFFFFF;
          --kt-text:#334155;--kt-heading:#0F172A;--kt-muted:#64748B;--kt-faint:#94A3B8;
          --kt-border:rgba(15,23,42,.09);--kt-border-soft:rgba(15,23,42,.06);
          --kt-chip-bg:rgba(15,23,42,.045);--kt-chip-border:rgba(15,23,42,.08);
          --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);
          --kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
          --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
          --kt-scrollbar:rgba(15,23,42,.16);
        }
        .kt-mobile-overlay {
          display: none;
        }
        @media(max-width:820px) {
          .kt-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 8;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(2px);
          }
          [data-root][data-kt-theme="dark"] .kt-mobile-overlay {
            background: rgba(0, 0, 0, 0.7);
          }
        }
            
        @media (max-width: 760px) {
          .kt-mock-panel { height: auto !important; min-height: 460px !important; }
          .kt-mock-row { flex-direction: column !important; }
          .kt-mock-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(148,163,184,0.2) !important; padding-bottom: 24px !important; }
          .kt-mock-header-content { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          .kt-mock-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div data-kt-landing-modal>
        <PlanModal
          abierto={planModalAbierto}
          onCerrar={() => setPlanModalAbierto(false)}
          onMejorar={(ciclo) => { setPlanModalAbierto(false); abrirCheckout(ciclo); navigate('/dashboard'); }}
        />
      </div>
    </div>
  );
}
