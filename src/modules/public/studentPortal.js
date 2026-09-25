import { validateLoginFields, validateRegisterFields } from '../../app/services/authService.js';

export const STUDENT_FAQ = [
  ['¿Ya puedo crear una cuenta de alumno?', 'Sí. Regístrate con tu nombre, correo y contraseña en Katedra Alumnos.'],
  ['¿Ya puedo ver mis clases?', 'La cuenta ya está disponible. Las clases y actividades aparecerán cuando se habilite el acceso a una clase.'],
  ['¿La IA hace mis tareas?', 'No. Puede explicar consignas, aclarar comentarios y proponer práctica. Tus respuestas siguen siendo tuyas.'],
  ['¿Quién controla los materiales?', 'El profesor selecciona y organiza los materiales y define las reglas de las actividades.'],
  ['¿Cómo recibiré la retroalimentación?', 'La propuesta reúne el comentario del profesor con tu actividad y señala material relacionado para continuar.'],
  ['¿Katedra reemplaza al profesor?', 'No. El profesor dirige la clase y conserva el criterio sobre actividades, evaluación e intentos.'],
  ['¿Qué es Katedra Forms?', 'Es la experiencia de evaluación prevista para la clase: pregunta, respuesta y, cuando el profesor lo permita, explicación y refuerzo.'],
];

const SECTIONS = [
  { title: 'Cómo funciona', description: 'Sigue la consigna, el material, tu respuesta, la retroalimentación y el siguiente paso.', href: '/alumnos#como-funciona' },
  { title: 'Material y actividades', description: 'Encuentra el recurso relacionado con una actividad de clase.', href: '/alumnos#beneficios' },
  { title: 'IA para aprender', description: 'Aclara consignas y comentarios y practica con ejemplos, sin copiar respuestas.', href: '/alumnos#ia-para-aprender' },
  { title: 'Demo de Katedra Forms', description: 'Explora una evaluación conceptual y su explicación.', href: '/alumnos#katedra-forms' },
  { title: 'Preguntas frecuentes', description: 'Respuestas sobre cuentas de alumnos, profesores y Katedra Forms.', href: '/alumnos#preguntas' },
];

const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function searchStudentContent(query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const faqItems = STUDENT_FAQ.map(([title, description]) => ({ title, description, href: '/alumnos#preguntas' }));
  return [...SECTIONS, ...faqItems].filter(({ title, description }) => {
    const haystack = normalize(`${title} ${description}`);
    return words.every((word) => haystack.includes(word));
  });
}

export const STUDENT_CHAT_SUGGESTIONS = [
  '¿Qué es Katedra Forms?',
  '¿Cómo recupero mi contraseña?',
  '¿Dónde veo mi retroalimentación?',
];

export function getStudentChatReply(input) {
  const query = normalize(input);
  if (query.includes('contrasena') || query.includes('recuper')) {
    return 'El restablecimiento de contraseña por correo todavía no está disponible. Si recuerdas tu contraseña, inicia sesión desde Katedra Alumnos.';
  }
  if (query.includes('forms') || query.includes('evaluacion')) {
    return 'Katedra Forms será la experiencia de evaluación dentro de la clase. Por ahora puedes explorar su demo conceptual en la página de alumnos.';
  }
  if (query.includes('retroaliment') || query.includes('comentario')) {
    return 'La propuesta coloca los comentarios del profesor junto a tu respuesta y el material relacionado para que sepas qué mejorar.';
  }
  if (query.includes('cuenta') || query.includes('registro') || query.includes('sesion')) {
    return 'Puedes crear tu cuenta o iniciar sesión desde la parte superior de Katedra Alumnos.';
  }
  if (query.includes('material') || query.includes('clase')) {
    return 'En la demo puedes ver cómo se conectan tema, material, actividad, respuesta y siguiente paso dentro de una clase.';
  }
  return 'No tengo una respuesta predefinida para eso. Prueba una de las preguntas sugeridas o explora la página de alumnos.';
}

export function validateStudentAccess(mode, fields) {
  if (mode === 'login') return validateLoginFields(fields.email, fields.password);
  if (mode === 'register') {
    const error = validateRegisterFields(fields.nombre, fields.email, fields.password, fields.confirmPassword);
    if (error) return error;
    return null;
  }
  return 'Formulario de acceso no reconocido.';
}
