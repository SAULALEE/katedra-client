# Plan de movimiento y UX — landing de alumnos

## Objetivo

Convertir `/alumnos` en una experiencia que muestre el valor de Katedra: pasar de dudas y materiales dispersos a una actividad comprendida y un siguiente paso claro. El movimiento debe explicar esa transformación, confirmar acciones y orientar la mirada.

Este documento es un **plan de implementación**. No describe funcionalidades ya disponibles ni autoriza a simular servicios reales.

## Fuentes y alcance

- Diseño: [DESIGN-student-landing.md](DESIGN-student-landing.md). En este repositorio no existe un archivo llamado `DESIGN.md`.
- Composición vigente: `src/modules/public/components/StudentLandingExperience.jsx`.
- Estilos vigentes: `src/modules/public/components/StudentLandingExperience.css`.
- Datos y navegación de la demo: `src/modules/public/components/studentLandingJourney.js`.
- Entrada de la ruta: `src/modules/public/pages/StudentLanding.jsx`.
- La dependencia actual es `framer-motion`; conservar sus imports en esta iteración. La documentación nueva de Motion muestra `motion/react`, pero no se requiere instalar otra librería para aplicar estas ideas.
- La página ya contiene una demo de cinco pasos, ejemplos de IA, Forms y FAQ. El plan mejora esas piezas.

## Reglas antes de implementar

1. Leer `.katedra/skills/00-core/caveman-method.md`, las reglas de diseño y accesibilidad del proyecto, y este plan.
2. Preservar los cambios existentes del worktree. La landing actual todavía contiene archivos nuevos o modificados sin consolidar.
3. Para cada cambio de comportamiento, seguir RED → GREEN → REFACTOR: escribir la prueba, verla fallar por la razón esperada, implementar lo mínimo y volver a ejecutar pruebas.
4. Conservar los tokens, la tipografía y los breakpoints documentados. El motion design complementa el sistema visual.
5. Mostrar contenido útil desde el primer render. Ningún texto esencial debe depender de que se complete una animación.
6. Las demos deben identificarse como conceptuales. No simular un envío de correo, una respuesta real de IA ni una evaluación guardada.

## Mapa rápido: técnica por componente

| Componente | Técnica principal | Disparador | Propósito |
| --- | --- | --- | --- |
| Header y menú móvil | `AnimatePresence`, `whileTap`, `layout` si cambia tamaño | Abrir/cerrar, pulsar | Mostrar estado y mantener orientación |
| Hero | `variants`, `staggerChildren`, entrada inicial | Carga de página | Introducir la promesa en orden |
| Preview del hero | `variants`, `whileInView` una vez | Entrada del preview | Contar clase → actividad → devolución → siguiente paso |
| Duda → ruta | `useScroll`, `useTransform`, `useSpring`; opcional `useAnimate` | Avance por la sección | Escena distintiva de transformación |
| Demo de cinco pasos | `AnimatePresence`, `layoutId`, `layout` | Selección de paso | Hacer legible el cambio de etapa |
| Progreso de demo | `motion.div` con `animate` | Cambio de paso | Mostrar avance real |
| Beneficios | SVG `pathLength`, `whileInView` selectivo | Entrada de cada ejemplo | Mostrar causa y efecto |
| IA | `AnimatePresence`, `layout` | Cambio de ejemplo | Relacionar pregunta, explicación y acción |
| Forms | `whileTap`, `layout`, `AnimatePresence` | Seleccionar/comprobar | Confirmar respuesta y revelar aprendizaje |
| Conexión profesor–alumno | SVG `pathLength` o secuencia con variantes | Entrada de la sección | Explicar relaciones entre actores |
| FAQ | `AnimatePresence`, `layout` | Expandir/cerrar | Conservar contexto y evitar saltos |
| CTA final | Entrada breve con `whileInView` | Entrada en pantalla | Reforzar la acción disponible |

`drag` e `inertia` quedan fuera de la primera implementación: los elementos actuales no requieren arrastre para cumplir una tarea. Solo agregarlos si una futura demo incluye una interacción de ordenar materiales que también funcione con teclado.

## Orden de implementación

### Paso 0 — Establecer línea base

**Qué hacer**

1. Revisar en navegador desktop y móvil la ruta `/alumnos`; guardar capturas de referencia.
2. Registrar el estado del CTA, la demo, IA, Forms, FAQ y menú móvil.
3. Ejecutar las pruebas existentes y el build disponible en el entorno.
4. Tomar nota de cambios de tamaño, saltos de contenido y legibilidad móvil antes de añadir movimiento.

**Salida:** línea base visual y funcional. No cambiar el diseño todavía.

### Paso 1 — Resolver la acción principal

**Problema actual:** el hero y el header invitan a «Avísame cuando esté disponible», pero el formulario de la sección `#aviso` tiene campos y botón deshabilitados.

**Qué hacer**

1. Confirmar si existe un servicio real para registrar interés; buscar contrato, endpoint y tratamiento de privacidad en el proyecto.
2. Si existe, conectar la acción con estados de carga, error y confirmación. La comunicación HTTP debe quedar en un servicio y un hook, nunca dentro del componente JSX.
3. Si no existe, cambiar el CTA principal a «Explorar la clase demo» y llevarlo a `#como-funciona`; conservar la explicación de que el registro de interés aún no está habilitado. Evitar que el usuario llegue a un formulario con controles inutilizables como final del recorrido.
4. Probar la ruta del CTA con teclado y en móvil.

**Criterio de salida:** todos los CTA visibles llevan a una acción útil y verdadera. No se muestran confirmaciones ficticias.

### Paso 2 — Definir una gramática de movimiento

**Qué hacer**

1. Envolver solo la landing con `MotionConfig reducedMotion="user"` de `framer-motion`.
2. Crear variantes reutilizables para entrada editorial y transiciones de contenido. Evitar copiar objetos de animación en cada JSX.
3. Adoptar estos rangos iniciales y ajustarlos tras verlo en navegador:

   - Feedback de botón: 120–180 ms.
   - Cambio de panel o indicador: 220–360 ms.
   - Entrada editorial: 450–750 ms.
   - Escena distintiva: ligada al scroll, sin duración forzada.

4. Reservar `spring` moderado para indicadores y selecciones. Para opacidad o texto, usar `tween` con `easeOut`.
5. No animar simultáneamente `transform` desde CSS y Motion sobre el mismo nodo. En las notas inclinadas de `.sl-chaos-note`, mover un wrapper o asignar la rotación a Motion.
6. Animar `opacity` y `transform` como primera opción. Medir cualquier animación que modifique layout o pinte SVG grandes.

**Criterio de salida:** componentes con ritmo consistente, sin movimientos que compitan entre sí.

### Paso 3 — Dar intención al hero y al preview

**Dónde:** `Hero`, `ProductPreview`, `.sl-hero` y `.sl-preview`.

**Secuencia propuesta**

1. Aparece la etiqueta «Próximamente para alumnos».
2. Entra el título; después, la explicación.
3. Entran los CTA.
4. El preview se revela como una pieza completa.
5. Dentro del preview, una secuencia sutil destaca tema, material, actividad, comentario y siguiente paso.

**Motion:** `variants` en un contenedor y `staggerChildren` para el hero; `whileInView` con `viewport={{ once: true }}` para el detalle del preview. No animar cada palabra ni mantener loops de glows.

**UX:** mantener el título y CTA legibles de inmediato. El preview es una vista conceptual; no debe dar a entender que los controles decorativos son clicables.

**Prueba:** con movimiento reducido, todo aparece completo sin desplazamiento; con conexión lenta, el contenido sigue visible y usable.

### Paso 4 — Crear la escena distintiva «de la duda a la ruta»

**Dónde:** `Problem`, `.sl-transform`, `.sl-chaos` y `.sl-order`.

**Historia visual**

1. Se ven cuatro preguntas dispersas.
2. Al avanzar por la sección, cada pregunta pierde protagonismo y se relaciona con una pieza de la clase.
3. La ruta ordenada gana definición en tres etapas: clase y tema, material y actividad, siguiente paso.
4. La última etapa termina activa y legible.

**Motion:** `useScroll({ target: sectionRef, offset: ["start 80%", "end 25%"] })` para obtener progreso local; `useTransform` para opacidad y desplazamientos pequeños; `useSpring` únicamente si el avance necesita suavizado. Si la secuencia exige coordinación discreta entre muchos nodos, `useAnimate` scoped al componente. Elegir una sola estrategia principal, no mezclar múltiples cronologías sobre el mismo elemento.

**Diseño:** conservar alturas estables. No bloquear el scroll ni usar una sección de varias pantallas como requisito para entenderla. En móvil, las preguntas deben ordenarse verticalmente. Si el usuario pasa rápido, siempre debe ver el estado final.

**Accesibilidad:** el DOM mantiene el texto completo en orden lógico; la animación es visual. Con movimiento reducido, mostrar directamente la ruta resuelta.

**Criterio de salida:** alguien puede explicar la transformación sin leer un párrafo adicional.

### Paso 5 — Dar continuidad a la demo de cinco pasos

**Dónde:** `Demo`, `DEMO_STEPS`, `.sl-demo-steps` y `.sl-demo-content`.

**Qué hacer**

1. Mantener los cinco botones y los controles «Anterior»/«Siguiente».
2. Añadir un único indicador activo con `layoutId` para que se mueva entre pasos; conservar estado seleccionado semántico mediante texto, color y `aria-current="step"` o un patrón equivalente apropiado.
3. Envolver el contenido que cambia en `AnimatePresence`. La clave debe ser `step.id`; animar salida breve y entrada del siguiente panel. Usar `mode="wait"` solo si evita superposición y mantiene un cambio ágil.
4. Mantener el contexto lateral de clase visible mientras cambia la etapa.
5. Animar la barra de progreso desde el porcentaje anterior al nuevo con `animate`; evitar que vuelva a cero al cambiar de paso.
6. Mantener la región anunciada por lectores de pantalla estable para que no se anuncien simultáneamente contenido saliente y entrante.

**Pruebas primero:** avanzar, retroceder, elegir un paso no consecutivo, respetar límites y comprobar que el contenido final corresponde al paso activo. Añadir verificación de teclado y foco.

**Criterio de salida:** el cambio de paso se entiende de inmediato y no produce saltos de altura relevantes.

### Paso 6 — Convertir los beneficios en demostraciones pequeñas

**Dónde:** `Benefits`.

- **Encontrar:** destacar el recurso relacionado y atenuar recursos secundarios cuando la sección entra en vista. Usar `whileInView` una sola vez.
- **Entender:** revelar la explicación después de resaltar la parte de la consigna a la que se refiere. Usar variantes breves.
- **Practicar:** dar feedback al elemento de respuesta de ejemplo con `whileTap` solo si se convierte en un control real; si sigue siendo decorativo, usar una secuencia automática discreta.
- **Mejorar:** dibujar con SVG `pathLength` la relación entre comentario y acción. El trazo debe ser corto y visible en móvil.

**Criterio de salida:** cada visual explica una función diferente; no repetir un fade-in idéntico en cuatro bloques.

### Paso 7 — Mejorar la ayuda con IA

**Dónde:** `AiSupport`, botones de `.sl-ai-tabs` y `.sl-ai-chat`.

**Qué hacer**

1. Conservar los tres ejemplos y el contexto «Ecosistemas · Flujo de energía».
2. Cambiar pregunta, respuesta y acción como una unidad con `AnimatePresence`, usando una clave estable por ejemplo.
3. Animar un indicador activo entre botones mediante `layoutId` o un cambio de fondo claro.
4. Evitar el efecto de máquina de escribir: retrasa la lectura y puede entorpecer a lectores de pantalla.
5. Mantener el texto «IA para comprender, no para copiar» y la indicación de que las respuestas siguen siendo del alumno.

**Prueba:** al elegir otro ejemplo, la pregunta, respuesta y sugerencia corresponden al mismo índice; los botones funcionan con teclado.

### Paso 8 — Hacer que Forms responda a la interacción

**Dónde:** `Forms`, `.sl-form-options` y `.sl-form-explanation`.

**Qué hacer**

1. Al seleccionar una opción, dar feedback inmediato con `whileTap` y un indicador claro de selección.
2. Al pulsar «Comprobar respuesta», mostrar explicación y siguiente paso con `AnimatePresence` y `layout` en el panel contenedor.
3. Mostrar respuesta correcta e incorrecta con texto, icono y color. No depender solo de naranja/rosa.
4. Permitir cambiar respuesta y volver a comprobar la demo sin recargar la página; preservar la condición de «vista conceptual».
5. Mantener el foco en el control activado o dirigirlo de forma predecible a la explicación, según el flujo elegido. El anuncio accesible debe ocurrir una sola vez.

**Pruebas primero:** selección, comprobación correcta/incorrecta, cambio de opción y repetición; verificar que el botón no se habilita sin selección.

### Paso 9 — Cerrar el recorrido sin sobreanimar

**Conexión:** dibujar o iluminar, en secuencia, profesor → alumno → profesor → siguiente paso. `pathLength` de SVG si hay una línea auténtica; variantes si basta con enfatizar cada nodo. Mantener la lista semántica.

**Trust:** usar movimiento mínimo. Su función es dar calma y claridad, así que bastan entradas discretas o ningún efecto.

**FAQ:** animar apertura y cierre con `AnimatePresence` y `layout`; mantener `aria-expanded`, `aria-controls` y contenido asociado. No dejar contenido invisible enfocable.

**Menú móvil:** animar el panel de navegación, cerrar con Escape y al elegir un enlace, y devolver el foco al botón al cerrar con Escape. `whileTap` confirma pulsación.

**CTA final:** una entrada breve al llegar a la sección. La acción ya debe estar resuelta en el paso 1.

### Paso 10 — Verificar experiencia completa

1. Ejecutar pruebas de los cambios de estado y build.
2. Revisar desktop, tablet y móvil, incluidos anchos estrechos donde el preview y la demo se apilan.
3. Probar teclado: menú, pasos de demo, IA, Forms, FAQ y CTA.
4. Probar `prefers-reduced-motion: reduce`: sin parallax, desplazamientos grandes ni efectos que retrasen contenido. `MotionConfig` debe respetarlo; adaptar manualmente cualquier `useScroll` o `useAnimate`.
5. Revisar que los cambios de contenido no alteren el scroll de forma brusca, no generen overflow horizontal y no desplacen el CTA mientras se intenta usar.
6. Comprobar que las animaciones no retrasan la interacción ni empeoran perceptiblemente la carga de la landing. Si una escena resulta pesada, reducir elementos animados antes de añadir optimizaciones complejas.
7. Comparar capturas antes y después. Revisar la página sin movimiento: su jerarquía y significado deben mantenerse.

## Prioridad de entrega

1. **P0:** CTA útil y verdadero; demo, IA y Forms con transiciones de estado; movimiento reducido; teclado.
2. **P1:** escena distintiva «de la duda a la ruta»; secuencia del hero; animación de progreso.
3. **P2:** trazos SVG y refinamiento de beneficios, conexión, FAQ y menú.

Se puede detener el refinamiento visual cuando P0 y P1 cumplen sus criterios. P2 no debe retrasar correcciones de usabilidad.

## Referencias oficiales de Motion

- [Animación en React y variantes](https://motion.dev/docs/react-animation)
- [Scroll: disparado y ligado al desplazamiento](https://motion.dev/docs/react-scroll-animations)
- [Entrada y salida con AnimatePresence](https://motion.dev/docs/react-animate-presence)
- [Animación de layout y layoutId](https://motion.dev/docs/react-layout-animations)
- [Gestos y feedback](https://motion.dev/docs/react-gestures)
- [Transiciones: tween, spring e inertia](https://motion.dev/docs/react-transitions)
- [Trazos SVG](https://motion.dev/docs/react-svg-animation)
- [Movimiento reducido](https://motion.dev/docs/react-accessibility)
