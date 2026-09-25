import { useEffect } from 'react';
import StudentLandingExperience from '../components/StudentLandingExperience';
import '../components/StudentLandingExperience.css';

export default function StudentLanding() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');

    document.title = 'Katedra para alumnos | Entiende qué sigue después de cada clase';
    description?.setAttribute('content', 'Katedra reúne tus materiales, actividades y comentarios para que sepas qué revisar, cómo mejorar y cuál es tu siguiente paso. Experiencia para alumnos en desarrollo.');

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) description.setAttribute('content', previousDescription);
    };
  }, []);

  return <StudentLandingExperience />;
}
