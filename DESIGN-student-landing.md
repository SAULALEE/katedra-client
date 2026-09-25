# Diseño — Landing de alumnos

Ruta: `/alumnos`. Fuentes de verdad de la implementación: `StudentLandingExperience.jsx`, `StudentLandingExperience.css` y `studentLandingJourney.js`.

## Idea rectora

**Confusión → comprensión → acción → progreso.** El alumno pasa de cuatro dudas dispersas a una actividad guiada y a un siguiente paso concreto. La experiencia es conceptual y está marcada como tal. No existe registro de alumnos ni captura de correos en esta versión.

## Jerarquía y copy

1. Header flotante: logo, Cómo funciona, IA para aprender, Katedra Forms, Preguntas, enlace secundario a profesores y CTA “Explorar la clase demo”. El menú móvil se cierra con Escape y devuelve el foco al botón.
2. Hero oscuro: “Próximamente para alumnos”; “Entiende qué sigue después de cada clase.”; explicación concreta de materiales, actividades, comentarios y siguiente paso; CTA principal “Explorar la clase demo” y secundario “Ver cómo se organiza”.
3. Preview de una clase de Ecosistemas: tema actual, progreso, material, actividad, comentario docente y siguiente paso. Etiqueta “Vista conceptual · Ejemplo de clase”.
4. Problema editorial: cuatro dudas con disposición dispersa se convierten en “clase y tema → material y actividad → siguiente paso”.
5. Demo principal: Consigna → Material relacionado → Respuesta → Retroalimentación → Siguiente paso. Cinco controles navegables actualizan el panel de contenido y el progreso.
6. Beneficios con cuatro composiciones distintas: búsqueda contextual, consigna anotada, ejercicio y comentario convertido en acción.
7. IA contextual: tres ejemplos seleccionables para explicar consigna, aclarar comentario y proponer práctica. Mensaje “IA para comprender, no para copiar”.
8. Katedra Forms: pregunta seleccionable, progreso del intento, explicación posterior y refuerzo. Es una vista conceptual.
9. Conexión profesor–alumno: publicación → estudio → respuesta → devolución → siguiente paso.
10. Confianza: control docente, contexto de clase, respuestas del alumno y límites de la IA.
11. FAQ de siete preguntas, con disponibilidad en primer lugar.
12. Cierre con el mismo CTA hacia la demo y una nota visible: el registro de interés aún no está habilitado.
13. Footer con navegación, estado de desarrollo e información provisional de privacidad y términos.

## Sistema visual

- Tipografía: Inter para estructura e interfaz; Manrope italic 600 para énfasis editorial.
- Azul oscuro `#0F172A`: confianza y fondos. Violeta `#6D28D9`: identidad y acciones. Naranja `#F97316`: progreso y estados activos. Rosa `#EC4899`: glows y transición. Blanco, `#F8FAFC` y `#F5F3FF`: descanso visual.
- Gradientes intensos reservados para hero, elementos de producto destacados y CTA final.
- Tres niveles: texto editorial abierto, paneles secundarios y paneles de interacción/conversión.
- Contenedor `min(1080px, calc(100% - 48px))`; navegación `min(1180px, calc(100% - 32px))`; radios de 18–20px para superficies principales y 11px para botones.
- Transiciones de estado de 220–360 ms, entrada editorial de hasta 750 ms y feedback táctil breve. Hero y preview usan variantes escalonadas; la escena de dudas usa progreso local de scroll; demo e IA intercambian paneles con `AnimatePresence`; Forms y FAQ revelan contenido; beneficios y conexión tienen señales distintas. Todo el contenido esencial es legible desde el primer render.
- `MotionConfig reducedMotion="user"` se aplica solo a la landing. La escena ligada al scroll y los desplazamientos de entrada se desactivan cuando el usuario prefiere menos movimiento.

## Responsive y accesibilidad

- Hasta **820px**: navegación con menú desplegable; demo condensada; flujos y paneles ajustados.
- Hasta **640px**: contenedor con 16px por lado; preview sin sidebar; demo vertical; beneficios, IA, Forms, conexión y CTA en una columna; botones principales de ancho completo.
- HTML semántico, skip link, foco visible, controles con botones, FAQ con `aria-expanded` y `aria-controls`, regiones estables con `aria-live` para demo, IA y Forms, y contraste WCAG AA.
- Ninguna opción depende solo del color: los estados incluyen texto, borde, icono o posición.

## Disponibilidad y CTA

No hay servicio de registro de interés. Los CTA visibles llevan a `#como-funciona`, una demo útil y conceptual. El cierre indica que aún no se recopilan correos. Cuando exista un servicio real, el registro y sus estados deberán diseñarse sobre un contrato de API y una política de privacidad publicados.
