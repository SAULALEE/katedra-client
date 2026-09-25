import { useState } from 'react';
import { Book, Globe, Calculator, Dna, Feather, Folder } from 'lucide-react';
import MockWindowBar from './MockWindowBar';
import MockSidebar from './MockSidebar';
import MockDashboardContent from './MockDashboardContent';
import MockSubjectModal from './MockSubjectModal';
import MockToasts from './MockToasts';

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

export default function MockAdminPanel() {
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
      <MockWindowBar colors={colors} isDarkMode={isDarkMode} />

      {/* Main Row */}
      <div className="kt-mock-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left Sidebar */}
        <MockSidebar colors={colors} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* Content Pane */}
        <MockDashboardContent colors={colors} setShowNotifications={setShowNotifications} showNotifications={showNotifications} notifications={notifications} setShowModal={setShowModal} asignaturas={asignaturas} totalTemarios={totalTemarios} handleDelete={handleDelete} renderIcon={renderIcon} isDarkMode={isDarkMode} />
      </div>

      <MockSubjectModal showModal={showModal} colors={colors} isDarkMode={isDarkMode} handleCreate={handleCreate} setShowModal={setShowModal} setName={setName} name={name} SUGGESTIONS={SUGGESTIONS} SUBJECT_COLORS={SUBJECT_COLORS} setSelectedColor={setSelectedColor} selectedColor={selectedColor} SUBJECT_ICONS={SUBJECT_ICONS} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />

      <MockToasts toasts={toasts} isDarkMode={isDarkMode} colors={colors} />
    </div>
  );
}
