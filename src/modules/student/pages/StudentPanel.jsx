import { BookOpen, UserRound } from 'lucide-react';
import ResponsiveSidebar from '../../../app/components/ResponsiveSidebar.jsx';
import { useStudentProfile } from '../hooks/useStudentProfile.js';

const NAVIGATION_ITEMS = [
  {
    name: 'Panel',
    path: '/alumnos/panel',
    icon: <BookOpen size={16} aria-hidden="true" />,
  },
  {
    name: 'Mi cuenta',
    path: '/alumnos/mi-cuenta',
    icon: <UserRound size={16} aria-hidden="true" />,
  },
];

export default function StudentPanel() {
  const { student, loading, error, retry } = useStudentProfile();

  if (loading) {
    return (
      <main id="contenido" className="min-h-screen p-6" role="status">
        Cargando tus datos...
      </main>
    );
  }

  if (error || !student) {
    return (
      <main id="contenido" className="min-h-screen p-6">
        <div role="alert">
          <p>{error || 'No se pudo validar tu sesión de alumno.'}</p>
          <button type="button" onClick={retry} className="mt-2 underline">
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink md:flex">
      <ResponsiveSidebar
        navigationItems={NAVIGATION_ITEMS}
        homePath="/alumnos/panel"
        logoutPath="/alumnos"
      />
      <main id="contenido" className="min-w-0 flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold">Bienvenido a tus clases</h1>
        <div className="mt-4">
          <p>{student.nombre}</p>
          <p>{student.email}</p>
        </div>
      </main>
    </div>
  );
}
