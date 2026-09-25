import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  GraduationCap,
  Layers3,
  MessageSquareText,
  Route,
} from 'lucide-react';

export const STUDENT_HERO = {
  eyebrow: 'Katedra para alumnos · Experiencia en desarrollo',
  title: 'Sigue tu clase con claridad, de principio a fin.',
  description: 'Entiende una tarea, consulta un material largo y convierte la devolución de tu profesor en el siguiente paso para aprender.',
};

export const STUDENT_STEPS = [
  {
    number: '01',
    title: 'Entra a tu clase',
    description: 'Tu profesor compartirá el acceso para reunir al grupo y el contenido del curso.',
    Icon: GraduationCap,
  },
  {
    number: '02',
    title: 'Revisa el material',
    description: 'Temas, explicaciones y recursos aparecerán organizados en la secuencia de la clase.',
    Icon: BookOpenCheck,
  },
  {
    number: '03',
    title: 'Continúa con lo que sigue',
    description: 'Identifica actividades, fechas y retroalimentación sin perder el hilo de lo aprendido.',
    Icon: ClipboardCheck,
  },
];

export const STUDENT_BENEFITS = [
  {
    title: 'Todo dentro de su contexto',
    description: 'Cada material y actividad conserva su relación con el tema que estás estudiando.',
    Icon: Layers3,
    tone: 'orange',
  },
  {
    title: 'Una ruta fácil de seguir',
    description: 'Distingue lo revisado, lo que está en curso y el siguiente paso de cada clase.',
    Icon: Route,
    tone: 'violet',
  },
  {
    title: 'Retroalimentación cerca del trabajo',
    description: 'Las indicaciones del profesor acompañarán la actividad a la que pertenecen.',
    Icon: MessageSquareText,
    tone: 'orange',
  },
  {
    title: 'Útil en cada etapa académica',
    description: 'Una estructura flexible para educación básica, media superior, superior y posgrado.',
    Icon: Compass,
    tone: 'violet',
  },
];

export const STUDENT_FAQS = [
  {
    question: '¿Quién podrá usar Katedra para alumnos?',
    answer: 'La experiencia está planteada para estudiantes de educación básica, media superior, superior y posgrado. El contenido y la complejidad dependerán de cada clase y de su profesor.',
  },
  {
    question: '¿Ya puedo crear una cuenta de alumno?',
    answer: 'Todavía no. Esta página presenta la experiencia que se está preparando. El registro disponible actualmente corresponde a profesores.',
  },
  {
    question: '¿Cómo recibiré los materiales de mi clase?',
    answer: 'El profesor organizará y compartirá los materiales desde Katedra. La experiencia del alumno los reunirá por clase, tema y actividad.',
  },
  {
    question: '¿La inteligencia artificial hará mis tareas?',
    answer: 'No. Katedra está diseñada para ayudarte a comprender el contenido y seguir la clase. Tu participación y tus respuestas siguen siendo tuyas.',
  },
  {
    question: '¿La IA puede corregir mi tarea después de la devolución?',
    answer: 'Puede explicarte la retroalimentación y ayudarte a practicar el concepto. Solo podrás modificar y volver a entregar cuando el profesor haya habilitado una corrección o un nuevo intento.',
  },
  {
    question: '¿Qué es Katedra Forms?',
    answer: 'Es la propuesta de evaluaciones dentro de Katedra. El profesor podrá crear parciales desde sus materiales, definir intentos y decidir cuándo mostrar calificación, explicaciones y actividades de refuerzo.',
  },
  {
    question: '¿Katedra reemplaza al profesor?',
    answer: 'No. El profesor conserva la dirección de la clase, selecciona el material y evalúa el aprendizaje. Katedra conecta y organiza esa experiencia.',
  },
];

export const CONNECTION_ITEMS = [
  { label: 'Material publicado', meta: 'Introducción a los ecosistemas', Icon: BookOpenCheck },
  { label: 'Actividad asignada', meta: 'Mapa conceptual · viernes', Icon: ClipboardCheck },
  { label: 'Seguimiento', meta: 'Indicaciones de tu profesor', Icon: CheckCircle2 },
];
