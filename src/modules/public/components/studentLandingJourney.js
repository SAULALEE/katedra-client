export const DEMO_STEPS = [
  {
    id: 'consigna', number: '01', title: 'Consigna', status: 'Actividad abierta',
    body: 'Explica qué pasa con los consumidores si disminuye la población de productores en un ecosistema.',
    detail: 'Primero identifica quién produce energía y quién depende de ella. Después explica la relación con tus palabras.',
    cue: 'Entiende qué te piden',
  },
  {
    id: 'material', number: '02', title: 'Material relacionado', status: 'Lectura localizada',
    body: 'Flujo de energía · páginas 8–12. El esquema de la página 10 muestra la relación entre productores y consumidores.',
    detail: 'Este recurso está asociado a la actividad, así que no necesitas revisar todos los archivos de la clase.',
    cue: 'Revisa lo importante',
  },
  {
    id: 'respuesta', number: '03', title: 'Respuesta', status: 'Ejemplo de alumno',
    body: '“Si hay menos productores, llega menos energía a los consumidores y sus poblaciones pueden disminuir.”',
    detail: 'La respuesta es del alumno. Katedra conserva su trabajo y lo muestra junto a la consigna y el material.',
    cue: 'Responde con tus palabras',
  },
  {
    id: 'retroalimentacion', number: '04', title: 'Retroalimentación', status: 'Comentario del profesor',
    body: '“Vas bien. Explica también por qué los productores son el punto de entrada de energía.”',
    detail: 'El comentario queda junto a la respuesta. La ayuda contextual puede aclararlo sin cambiar la calificación.',
    cue: 'Comprende la devolución',
  },
  {
    id: 'siguiente', number: '05', title: 'Siguiente paso', status: 'Ruta para continuar',
    body: 'Repasa el esquema de la página 10 y practica con otra cadena alimenticia.',
    detail: 'El siguiente paso nace del material y de la retroalimentación; cualquier nuevo intento depende del profesor.',
    cue: 'Continúa aprendiendo',
  },
];

export const nextDemoStep = (index) => Math.min(index + 1, DEMO_STEPS.length - 1);
export const previousDemoStep = (index) => Math.max(index - 1, 0);

export const PRIMARY_CTA = {
  label: 'Explorar la clase demo',
  href: '#como-funciona',
};

export const getDemoStep = (index) => DEMO_STEPS[Math.max(0, Math.min(index, DEMO_STEPS.length - 1))];

export const getFormResult = (selected) => selected === null
  ? null
  : { correct: selected === 1, correctIndex: 1 };

export const AI_HELP = [
  { title: 'Entender la consigna', prompt: '¿Qué me pide explicar esta actividad?', answer: 'Compara qué ocurre con los consumidores cuando hay menos productores. Usa el esquema de la página 10 como apoyo.', action: 'Revisar el esquema' },
  { title: 'Aclarar un comentario', prompt: '¿Qué significa “punto de entrada de energía”?', answer: 'Los productores transforman la energía de la luz en alimento. Desde ahí pasa a los consumidores.', action: 'Ver el concepto en clase' },
  { title: 'Proponer práctica', prompt: 'Quiero practicar esta idea.', answer: 'Intenta otra cadena: pasto → conejo → zorro. ¿Qué cambiaría si disminuye el pasto?', action: 'Pensar mi respuesta' },
];
