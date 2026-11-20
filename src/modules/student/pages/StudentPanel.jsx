import { BookOpen, ClipboardCheck, GraduationCap, MessageSquareText, UserRound } from 'lucide-react';
import ResponsiveSidebar from '../../../app/components/ResponsiveSidebar.jsx';
import { useThemeStore } from '../../../app/store/useThemeStore.js';
import { useStudentProfile } from '../hooks/useStudentProfile.js';
import '../../../app/components/dashboardShell.css';

const NAVIGATION_ITEMS = [
  {
    name: 'Panel',
    path: '/alumnos/panel',
    icon: <BookOpen size={20} aria-hidden="true" />,
  },
  {
    name: 'Mi cuenta',
    path: '/alumnos/mi-cuenta',
    icon: <UserRound size={20} aria-hidden="true" />,
  },
];

const STATS = [
  { label: 'Clases', value: 0, hint: 'inscritas', icon: GraduationCap },
  { label: 'Entregas', value: 0, hint: 'pendientes', icon: ClipboardCheck, tone: 'sky' },
  { label: 'Retroalimentación', value: 0, hint: 'sin leer', icon: MessageSquareText, tone: 'amber' },
];

function PanelFrame({ children }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return (
    <div className="kd-root" data-accent="violet" data-theme={isDarkMode ? 'dark' : 'light'}>
      {children}
    </div>
  );
}

export default function StudentPanel() {
  const { student, loading, error, retry } = useStudentProfile();

  if (loading) {
    return (
      <PanelFrame>
        <main id="contenido" className="kd-state">
          <div className="kd-state-card" role="status">
            <span className="kd-spinner" aria-hidden="true" />
            Cargando tus datos…
          </div>
        </main>
      </PanelFrame>
    );
  }

  if (error || !student) {
    return (
      <PanelFrame>
        <main id="contenido" className="kd-state">
          <div className="kd-state-card" role="alert">
            <p style={{ margin: 0 }}>{error || 'No se pudo validar tu sesión de alumno.'}</p>
            <button type="button" onClick={retry} className="kd-button">
              Reintentar
            </button>
          </div>
        </main>
      </PanelFrame>
    );
  }

  const firstName = student.nombre.split(' ')[0];

  return (
    <PanelFrame>
      <ResponsiveSidebar
        navigationItems={NAVIGATION_ITEMS}
        homePath="/alumnos/panel"
        logoutPath="/alumnos"
        brandSuffix="Alumnos"
      />
      <main id="contenido" className="kd-main">
        <header className="kd-header">
          <div style={{ minWidth: 0 }}>
            <h1 className="kd-title">Bienvenido a tus clases, {firstName}</h1>
            <p className="kd-subtitle">{student.nombre} · {student.email}</p>
          </div>
        </header>

        <div className="kd-content">
          <section className="kd-stats" aria-label="Resumen">
            {STATS.map(({ label, value, hint, icon: Icon, tone }) => (
              <div key={label} className="kd-stat">
                <div className="kd-stat-head">
                  <span className="kd-stat-icon" data-tone={tone} aria-hidden="true"><Icon size={21} /></span>
                  <span className="kd-stat-label">{label}</span>
                </div>
                <div className="kd-stat-value"><strong>{value}</strong><span>{hint}</span></div>
              </div>
            ))}
          </section>

          <section aria-labelledby="kd-classes-title">
            <div className="kd-section-head">
              <h2 id="kd-classes-title" className="kd-section-title">Mis clases</h2>
              <span className="kd-chip">0</span>
            </div>
            <div className="kd-empty">
              <span className="kd-empty-icon" aria-hidden="true"><GraduationCap size={24} /></span>
              <p className="kd-empty-title">Aún no tienes clases</p>
              <p className="kd-empty-text">Cuando tu profesor te agregue a una clase, aparecerá aquí con sus materiales y entregas.</p>
            </div>
          </section>
        </div>
      </main>
    </PanelFrame>
  );
}
