import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Book,
  Globe,
  Calculator,
  Dna,
  Feather,
  Folder,
  Heart,
  Sparkles,
  History,
  Moon,
  Sun,
  Bell,
  Settings,
  Plus,
  ChevronLeft,
  X,
  Trash2,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { STUDENT_HERO } from './studentLandingContent';

const reveal = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
};

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

function MockStudentPanel() {
  const [asignaturas, setAsignaturas] = useState([
    { id: 1, nombre: 'Ciencias Naturales', color: '#F97316', icon: 'dna', temariosCount: 3 },
    { id: 2, nombre: 'Historia Contemporánea', color: '#EC4899', icon: 'globe', temariosCount: 2 },
    { id: 3, nombre: 'Matemáticas & Cálculo', color: '#7C3AED', icon: 'calculator', temariosCount: 4 }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F97316');
  const [selectedIcon, setSelectedIcon] = useState('book');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const handleCreate = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    const newAsig = {
      id: Date.now(),
      nombre: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      temariosCount: Math.floor(Math.random() * 3) + 1
    };
    setAsignaturas(prev => [...prev, newAsig]);
    setName('');
    setShowModal(false);

    addToast('Clase agregada', `"${newAsig.nombre}" fue añadida a tu espacio.`);
    setNotifications(prev => [
      { id: Date.now(), title: 'Nueva clase añadida', msg: `Te inscribiste a ${newAsig.nombre}.`, time: 'Ahora' },
      ...prev
    ]);
  };

  const handleDelete = (id, nombre, e) => {
    e.stopPropagation();
    setAsignaturas(prev => prev.filter(a => a.id !== id));
    addToast('Clase archivada', `"${nombre}" fue removida de tu lista.`);
    setNotifications(prev => [
      { id: Date.now(), title: 'Clase archivada', msg: `Se archivó la clase ${nombre}.`, time: 'Ahora' },
      ...prev
    ]);
  };

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
          app.katedra.com/alumnos
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
              background: 'linear-gradient(135deg, #F97316, #EC4899, #7C3AED)',
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
            Mi Espacio
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '10px',
              background: isDarkMode ? 'rgba(249,115,22,0.12)' : '#FFF7ED',
              color: isDarkMode ? '#FB923C' : '#C2410C',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              <BookOpen size={15} color={isDarkMode ? '#FB923C' : '#F97316'} />
              <span>Mis Clases</span>
            </div>
            {[
              { label: 'Mis Tareas', icon: <ClipboardList size={15} color={colors.muted} /> },
              { label: 'Evaluaciones', icon: <Sparkles size={15} color={colors.muted} /> },
              { label: 'Historial', icon: <History size={15} color={colors.muted} /> }
            ].map((item, idx) => (
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
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
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
                  background: isDarkMode ? 'rgba(124,58,237,0.18)' : 'rgba(249,115,22,0.15)',
                  color: isDarkMode ? '#A78BFA' : '#EA580C'
                }}>
                  {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
                </span>
                <span>{isDarkMode ? 'Oscuro' : 'Claro'}</span>
              </div>
              <div style={{
                width: '26px',
                height: '14px',
                borderRadius: '100px',
                background: isDarkMode ? '#F97316' : '#CBD5E1',
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
                background: 'linear-gradient(135deg, #EC4899, #7C3AED)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '11px'
              }}>AM</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ana Martínez</div>
                <div style={{ fontSize: '9px', color: colors.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estudiante</div>
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
              <div style={{ fontSize: '10px', color: colors.faint, fontWeight: 500 }}>Mis Clases / Tu clase de hoy</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: colors.heading, letterSpacing: '-0.5px' }}>Ciencias Naturales</div>
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
                  background: 'linear-gradient(135deg, #F97316, #EC4899)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(249,115,22,0.25)'
                }}
              >
                <Plus size={14} />
                <span>Unirte a clase</span>
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
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(249,115,22,0.12)', color: '#F97316', display: 'grid', placeItems: 'center' }}>
                <BookOpen size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>PROGRESO UNIDAD</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>62% completado</div>
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
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(124,58,237,0.12)', color: '#7C3AED', display: 'grid', placeItems: 'center' }}>
                <ClipboardList size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>ACTIVIDADES</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>2 pendientes</div>
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
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236,72,153,0.12)', color: '#EC4899', display: 'grid', placeItems: 'center' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 700, color: colors.faint, letterSpacing: '0.5px' }}>CALIFICACIÓN</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.heading, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>9.6</span>
                  <span style={{ fontSize: '9px', color: '#F97316', cursor: 'pointer' }}>ver detalle →</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>Biblioteca de Clases</span>
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

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.background = isDarkMode ? 'rgba(249,115,22,0.04)' : 'rgba(249,115,22,0.02)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                color: '#F97316',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '6px'
              }}>
                <Plus size={14} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: colors.heading }}>Unirte a una clase</div>
              <div style={{ fontSize: '8px', color: colors.faint }}>Código o enlace</div>
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
              <span style={{ fontSize: '13px', fontWeight: 700, color: colors.heading }}>Unirte a una clase</span>
              <button
                type="button"
                onClick={() => { setShowModal(false); setName(''); }}
                style={{ background: 'none', border: 'none', color: colors.faint, cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: colors.faint, display: 'block', marginBottom: '4px' }}>NOMBRE O CÓDIGO DE CLASE</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Física Clásica"
                required
                style={{
                  width: '100%',
                  height: '32px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border}`,
                  background: colors.bg2,
                  color: colors.heading,
                  fontSize: '12px',
                  padding: '0 8px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: colors.faint, display: 'block', marginBottom: '4px' }}>COLOR DISTINTIVO</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['#F97316', '#EC4899', '#7C3AED', '#3B82F6', '#10B981'].map(c => (
                  <span
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: c,
                      cursor: 'pointer',
                      border: selectedColor === c ? '2px solid #fff' : 'none',
                      boxShadow: selectedColor === c ? `0 0 0 2px ${c}` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => { setShowModal(false); setName(''); }}
                style={{
                  flex: 1,
                  height: '32px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border}`,
                  background: colors.bg2,
                  color: colors.text,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F97316, #EC4899)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Inscribirme
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toasts */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 200,
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: colors.heading,
            color: colors.bg1,
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            fontSize: '11px',
            animation: 'fadeUp 0.25s both'
          }}>
            <div style={{ fontWeight: 700 }}>{t.title}</div>
            <div style={{ opacity: 0.8, fontSize: '10px' }}>{t.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentLandingHero({ navigate }) {
  const goToTeachers = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <header className="student-hero" id="inicio" style={{
      position: 'relative',
      padding: '148px 24px 0',
      background: 'radial-gradient(125% 140% at 18% 8%, #1E1B4B 0%, #2E1065 22%, #4C1D95 42%, #7C3AED 66%, #EC4899 88%, #F97316 116%)',
      overflow: 'hidden'
    }}>
      {/* Noise overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

      {/* Subtle glow blob */}
      <div style={{ position: 'absolute', width: '380px', height: '380px', left: '-80px', bottom: '-160px', borderRadius: '50%', background: 'radial-gradient(circle, #F97316, transparent 68%)', opacity: 0.45, filter: 'blur(10px)', pointerEvents: 'none' }}></div>

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

      <div style={{ zIndex: 2, maxWidth: '920px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.28)', backdropFilter: 'blur(8px)', marginBottom: '26px' }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FB923C', boxShadow: '0 0 8px #FB923C' }}></span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.92)', whiteSpace: 'nowrap' }}>
            {STUDENT_HERO.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(38px, 6.6vw, 76px)', lineHeight: 1.02, letterSpacing: '-2px', color: '#fff', margin: '0 0 22px', textWrap: 'balance' }}
        >
          Sigue tu clase con claridad, <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>de principio a fin</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.86)', maxWidth: '620px', margin: '0 auto 36px', textWrap: 'pretty' }}
        >
          {STUDENT_HERO.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center' }}
        >
          <a
            href="#como-funcionara"
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.28)'; }}
          >
            Explorar cómo funcionará <ArrowDown size={17} />
          </a>
          <a
            href="/"
            onClick={goToTeachers}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              color: '#fff',
              textDecoration: 'none',
              padding: '15px 26px',
              borderRadius: '11px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
          >
            Soy profesor <ArrowRight size={17} />
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

          {/* Floating badge 1: Top-Left */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '-80px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: '100px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.25)',
            animation: 'floatY 6s ease-in-out infinite',
            pointerEvents: 'auto'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F97316', boxShadow: '0 0 8px #F97316' }}></span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>IA Activa · ✦</span>
          </div>

          {/* Floating badge 2: Top-Right */}
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '-90px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(124, 58, 237, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
            animation: 'floatY 8s ease-in-out infinite 0.5s',
            textAlign: 'left',
            pointerEvents: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={11} color="#A78BFA" />
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.5px' }}>ACTIVIDADES</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap' }}>Guías y tareas con retroalimentación</span>
          </div>

          {/* Floating badge 3: Bottom-Right */}
          <div style={{
            position: 'absolute',
            bottom: '100px',
            right: '-80px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            borderRadius: '100px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)',
            animation: 'floatY 7s ease-in-out infinite 0.2s',
            pointerEvents: 'auto'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EC4899', boxShadow: '0 0 8px #EC4899' }}></span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>Retroalimentación clara</span>
          </div>
        </div>

        {/* SVG Glow Connections */}
        <svg style={{ position: 'absolute', inset: '-60px -100px', width: 'calc(100% + 200px)', height: 'calc(100% + 120px)', pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <linearGradient id="studentGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="studentGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M 60 160 Q 140 180 180 230" fill="none" stroke="url(#studentGlow1)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 880 160 Q 760 180 660 210" fill="none" stroke="url(#studentGlow2)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 860 440 Q 760 410 680 390" fill="none" stroke="url(#studentGlow1)" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        <MockStudentPanel />

      </div>

      <div style={{ height: '150px' }}></div>
    </header>
  );
}
