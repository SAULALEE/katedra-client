import { INTEGRATIONS } from '../../../../app/components/landing/landingContent';
import { Sparkles } from 'lucide-react';
import { STUDENT_FAQ } from '../../studentPortal.js';
import { AI_HELP } from '../studentLandingJourney.js';

export const STUDENT_LINKS = [
  { label: 'Cómo funciona', to: '/alumnos#como-funciona' },
  { label: 'IA para aprender', to: '/alumnos#ia-para-aprender' },
  { label: 'Katedra Forms', to: '/alumnos#katedra-forms' },
];

// Real product figures (no marketing numbers until there is usage data).
export const STUDENT_STATS = [
  { target: 5, prefix: '', suffix: '', label: 'Etapas por actividad, de la consigna al siguiente paso' },
  { target: 3, prefix: '', suffix: '', label: 'Tipos de ayuda con IA dentro de tu clase' },
  { target: 1, prefix: '', suffix: '', label: 'Lugar para materiales, tareas y comentarios' },
];

const fromTeacher = (name) => INTEGRATIONS.find((item) => item.name === name).icon;

// Formats in which class material reaches the student (same files teachers export).
const STUDENT_INTEGRATIONS = [
  { name: 'Teoría en PDF', icon: fromTeacher('Documento PDF') },
  { name: 'Diapositivas', icon: fromTeacher('Presentación PPTX') },
  { name: 'Documento Word', icon: fromTeacher('Documento Word') },
  { name: 'Katedra Forms', icon: fromTeacher('Google Forms') },
];

export const STUDENT_INTEGRATIONS_LOOP = [...STUDENT_INTEGRATIONS, ...STUDENT_INTEGRATIONS, ...STUDENT_INTEGRATIONS, ...STUDENT_INTEGRATIONS];

export const STUDENT_FAQ_LINK = { label: 'Preguntas', to: '/alumnos#preguntas' };

export const STUDENT_FAQ_ITEMS = STUDENT_FAQ.map(([q, a]) => ({ q, a }));

export const STUDENT_FOOTER_COLUMNS = [
  {
    title: 'Explora',
    links: [
      { label: 'Cómo funciona', to: '/alumnos#como-funciona' },
      { label: 'IA para aprender', to: '/alumnos#ia-para-aprender' },
      { label: 'Katedra Forms', to: '/alumnos#katedra-forms' },
      { label: 'Preguntas', to: '/alumnos#preguntas' },
    ],
  },
  {
    title: 'Tu cuenta',
    links: [
      { label: 'Iniciar sesión', to: '/alumnos/iniciar-sesion' },
      { label: 'Crear cuenta', to: '/alumnos/crear-cuenta' },
      { label: 'Mi cuenta', to: '/alumnos/mi-cuenta' },
      { label: 'Recuperar contraseña', to: '/alumnos/recuperar-contrasena' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Buscar', to: '/alumnos/buscar' },
      { label: 'Contáctanos', to: '/alumnos/contacto' },
      { label: 'Mapa del sitio', to: '/alumnos/mapa-del-sitio' },
      { label: 'Para profesores', to: '/' },
    ],
  },
];

export const STUDENT_FOOTER_BOTTOM_LINKS = [
  { label: 'Privacidad', to: '#privacidad' },
  { label: 'Términos', to: '#terminos' },
];

export const FORM_QUESTION = '¿Qué pasa con los consumidores si disminuye la población de productores?';

export const FORM_OPTIONS = [
  'Aumenta la energía disponible para todos',
  'Disminuye la energía para los consumidores',
  'No cambia la cadena alimenticia',
];

export const FORM_REINFORCEMENT = [
  'Los productores son el punto de entrada de energía.',
  'Repasa el esquema de la página 10.',
  'Practica con otra cadena: pasto → conejo → zorro.',
];

export const STUDENT_AI_ITEMS = AI_HELP.map(({ title, prompt }) => ({ title, desc: prompt }));

export const STUDENT_AI_PANEL_HEADER = {
  icon: Sparkles,
  title: 'Flujo de energía · Ayuda contextual',
  subtitle: 'Biología · La IA responde con el material de tu clase',
};
