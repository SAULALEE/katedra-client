# Carátula

**Proyecto:** Katedra Alumnos
**Documento:** Definición de requerimientos y especificaciones de la aplicación futura
**Versión:** 0.2 · Borrador
**Fecha:** 2026-09-24
**Responsable:** Pendiente de asignar
**Repositorio:** [SAULALEE/katedra-client](https://github.com/SAULALEE/katedra-client)
**Rama local:** `feature/landing`

## Control de cambios y versiones

Cada revisión del documento debe indicar qué requerimientos cambiaron y enlazar el commit o PR que permita consultar la modificación exacta en GitHub. La versión `1.0` se reservará para el documento revisado y aprobado.

| Versión | Fecha | Responsable | Cambios | Estado | Commit o PR en GitHub |
| --- | --- | --- | --- | --- | --- |
| 0.1 | 2026-09-24 | Pendiente de asignar | Definición inicial del alcance y los requerimientos RF-01 a RF-17 y RNF-01 a RNF-07. | Borrador | `50f133e` — landing y documento inicial |
| 0.2 | 2026-09-25 | Pendiente de asignar | Añade Motion for React al stack y criterios de movimiento, accesibilidad y respuesta de las interacciones basados en el plan de animaciones. | Borrador, pendiente de revisión | Incluido en este commit |

# Diagnóstico y justificación

## Planteamiento

Los materiales, las actividades y los comentarios de una clase pueden llegar por separado. Esto dificulta que el alumno encuentre el recurso adecuado, comprenda una consigna, relacione la devolución con su respuesta y sepa qué hacer después.

La aplicación futura de Katedra Alumnos propone un recorrido dentro de cada clase: **entrar → consultar el tema y el material → responder → revisar la retroalimentación → continuar**. La landing `/alumnos` presenta ese recorrido mediante una clase de ejemplo; sus interacciones actuales son conceptuales.

## Justificación

Al mantener juntos el tema, el material, la consigna, la respuesta y la retroalimentación, el alumno puede seguir la secuencia de aprendizaje sin reconstruirla a partir de archivos dispersos. La ayuda contextual con IA puede aclarar instrucciones y comentarios o proponer práctica, mientras la respuesta continúa siendo trabajo del alumno. Katedra Forms puede relacionar una evaluación con explicaciones y refuerzo posterior.

La propuesta contempla alumnos de educación básica, media superior, superior y posgrado. El contenido y su complejidad dependerán de cada clase.

## Alcance y delimitaciones

Este documento define **funciones de la futura aplicación para alumnos**: cuenta y acceso, clases, temas, materiales, actividades, respuestas, retroalimentación, siguiente paso, ayuda contextual con IA y Katedra Forms. Las capturas compartidas se usan como referencia del formato «acción requerida → justificación → historia de usuario»; los requerimientos describen acciones del alumno.

La landing no ofrece hoy registro de alumnos, clases operativas, respuestas guardadas, IA activa para alumnos ni evaluaciones reales. Crear cuenta e iniciar sesión se incluyen como funciones futuras solicitadas para el producto. Quedan por definir el método de registro e invitación, los permisos, la persistencia, las reglas de resultados e intentos, el tratamiento de datos y los contratos de IA y Forms. No se especifica un plan comercial para alumnos.

Las fuentes de esta definición son la landing activa (`src/modules/public/pages/StudentLanding.jsx`, `src/modules/public/components/StudentLandingExperience.jsx`, `src/modules/public/components/studentLandingJourney.js`), `DESIGN-student-landing.md` y `PLAN-animaciones-landing-alumnos.md`.

## Stack de experiencia

La interfaz se construye con React y Vite. La experiencia usa **Motion for React de [Motion.dev](https://motion.dev/)** para animar transiciones de contenido, progreso, gestos y escenas ligadas al desplazamiento cuando ayuden a explicar el recorrido.

El cliente ya incluye `framer-motion` y la landing actual importa desde ese paquete. Motion.dev es la evolución oficial de Framer Motion; su paquete actual se instala como `motion` y se importa desde `motion/react`. La migración del paquete no forma parte de estos requerimientos y no se deben instalar ambas bibliotecas a la vez.

## Metodología de movimiento e interacción

El movimiento acompaña el recorrido de aprendizaje, confirma una acción y dirige la atención. No debe ocultar información esencial, simular operaciones reales ni obligar al alumno a esperar una animación.

| Momento | Respuesta de interfaz prevista | Criterio de aceptación |
| --- | --- | --- |
| Entrada a la experiencia | Presentar promesa, explicación, acciones y vista conceptual en secuencia breve. | El título y las acciones están disponibles desde el primer render; sin movimiento, el contenido conserva su jerarquía. |
| Duda → ruta | Relacionar preguntas dispersas con clase/tema, material/actividad y siguiente paso mediante una escena vinculada al scroll. | No bloquea el desplazamiento; en móvil se ordena verticalmente y con movimiento reducido muestra directamente la ruta completa. |
| Demo de clase | Animar el paso activo, el panel de contenido y el indicador de progreso al navegar por las cinco etapas. | Anterior, siguiente y selección directa respetan límites; el contenido corresponde al paso activo y no salta de forma brusca. |
| Ayuda contextual con IA | Cambiar pregunta, explicación y acción sugerida como una unidad. | Los tres elementos siempre pertenecen al mismo ejemplo; el texto se presenta completo, sin efecto de escritura. |
| Katedra Forms | Confirmar selección y revelar explicación y refuerzo después de comprobar. | Se puede cambiar y volver a comprobar la respuesta; resultado se comunica con texto e icono además del color. |
| Retroalimentación y siguiente paso | Mostrar la relación entre respuesta, comentario del profesor y acción para continuar. | Se distinguen la respuesta del alumno, el comentario del profesor y la ayuda de IA. |
| FAQ y menú móvil | Expandir/contraer contenido y confirmar apertura, cierre o selección. | Se conservan `aria-expanded`, teclado, Escape, foco predecible y contenido no enfocable cuando está cerrado. |

### Reglas de movimiento y accesibilidad

- Usar `opacity` y desplazamientos pequeños como base. Reservar `layout`/`layoutId`, gestos y trazos SVG para cambios que aclaren estado o relación.
- Usar transiciones breves para feedback (120–180 ms), cambios de panel (220–360 ms) y entradas editoriales (450–750 ms). El scroll controla escenas sin duración forzada.
- Respetar `prefers-reduced-motion`: quitar parallax, desplazamientos grandes y secuencias; dejar visible el estado final. El significado y las acciones no dependen de Motion.
- Mantener orden semántico y foco visible; anunciar un solo cambio de contenido a lectores de pantalla.
- No aplicar a un mismo elemento transformaciones simultáneas de CSS y Motion. Evitar loops decorativos, efectos de máquina de escribir y animaciones que causen overflow o cambios de altura bruscos.
- Las animaciones no convierten elementos decorativos en controles ni deben implicar que la demo guarda entregas, consulta IA real o evalúa una respuesta en un servidor.

# Definición de requerimientos y especificaciones

## Requerimientos funcionales

Cada RF expresa una acción observable que realizaría el alumno en la aplicación futura. Las historias siguen el formato de las capturas compartidas.

| ID | Nombre | Requiero (acción) | Para (justificación) | Historia de usuario |
| --- | --- | --- | --- | --- |
| RF-01 | Crear cuenta | Un formulario para registrar mi cuenta de alumno. | Tener un espacio propio desde el cual seguir mis clases. | Como alumno, requiero crear una cuenta para acceder a mi experiencia de aprendizaje. |
| RF-02 | Iniciar sesión | Un formulario para ingresar a mi cuenta. | Recuperar mis clases, actividades y avances. | Como alumno, requiero iniciar sesión para continuar donde me quedé. |
| RF-03 | Entrar a una clase | Una forma de acceder a la clase que se compartió conmigo. | Consultar el contenido de la clase a la que pertenezco. | Como alumno, requiero entrar a mi clase para revisar sus temas y actividades. |
| RF-04 | Consultar mis clases | Una vista de las clases a las que tengo acceso. | Elegir la clase en la que necesito trabajar. | Como alumno, requiero consultar mis clases para entrar a la que voy a estudiar. |
| RF-05 | Consultar temas y avance | Una vista que distinga el tema actual, lo revisado, lo que está en curso y lo siguiente. | Ubicarme en la secuencia de aprendizaje. | Como alumno, requiero ver el avance de mi clase para saber qué revisar después. |
| RF-06 | Consultar material | Acceso al material y al fragmento relacionado con una actividad. | Encontrar la información pertinente sin buscar entre archivos ajenos a la tarea. | Como alumno, requiero consultar el material de mi actividad para preparar mi respuesta. |
| RF-07 | Consultar actividades y consignas | Una vista de las actividades asignadas y las indicaciones de cada una dentro de su tema. | Saber qué debo realizar y con qué material se relaciona. | Como alumno, requiero leer la consigna de una actividad para comprender qué se me pide. |
| RF-08 | Presentar una respuesta | Una forma de entregar mi propia respuesta a una actividad. | Completar el trabajo solicitado y mantenerlo vinculado con la consigna. | Como alumno, requiero presentar mi respuesta para que quede asociada a la actividad que resolví. |
| RF-09 | Consultar mi respuesta | Acceso a la respuesta que presenté, junto con su consigna y material. | Revisar mi trabajo dentro del contexto en que lo realicé. | Como alumno, requiero consultar mi respuesta para relacionarla con la actividad y el material. |
| RF-10 | Consultar retroalimentación | Acceso al comentario recibido junto a la respuesta y actividad correspondientes. | Entender a qué parte de mi trabajo se refiere la devolución. | Como alumno, requiero consultar la retroalimentación de mi actividad para reconocer qué debo mejorar. |
| RF-11 | Consultar el siguiente paso | Una acción sugerida a partir del material, la actividad o la retroalimentación. | Saber qué revisar o practicar para continuar aprendiendo. | Como alumno, requiero ver mi siguiente paso para continuar después de una devolución. |
| RF-12 | Aclarar una consigna con IA | Una explicación contextual de lo que solicita la actividad. | Comprender la tarea sin recibir una respuesta lista para copiar. | Como alumno, requiero pedir ayuda para entender una consigna y responder con mis propias palabras. |
| RF-13 | Aclarar retroalimentación con IA | Una explicación de un comentario o concepto mencionado en la devolución. | Comprender qué necesito reforzar. | Como alumno, requiero aclarar un comentario sobre mi trabajo para saber cómo mejorar. |
| RF-14 | Practicar con IA | Una propuesta de ejercicio relacionada con el tema y el material de la clase. | Poner a prueba mi comprensión antes de continuar. | Como alumno, requiero practicar con otro ejemplo para comprobar que entendí el concepto. |
| RF-15 | Responder Katedra Forms | Acceso a las preguntas de una evaluación asignada, selección de respuestas y avance del intento. | Completar una evaluación dentro del contexto de mi clase. | Como alumno, requiero responder Katedra Forms y consultar mi avance para completar la evaluación. |
| RF-16 | Consultar resultados y refuerzo | Acceso a calificación, explicaciones y actividades de refuerzo cuando se habilite su publicación. | Entender mis errores y reconocer qué concepto debo reforzar. | Como alumno, requiero revisar mis resultados y explicaciones disponibles para aprender de la evaluación. |
| RF-17 | Corregir o reintentar | Una opción para corregir y volver a entregar, o realizar otro intento, cuando la clase lo permita. | Demostrar mi mejora conforme a las reglas de la actividad. | Como alumno, requiero corregir o reintentar cuando se habilite esa posibilidad. |

La IA debe explicar y proponer práctica con el contexto de la clase. La respuesta entregada sigue siendo trabajo del alumno; la ayuda de IA no modifica calificaciones ni habilita intentos por sí sola.

## Requerimientos no funcionales

Las capturas no incluyen RNF. Los siguientes se proponen para la aplicación futura a partir de las funciones anteriores. Sus mecanismos y métricas concretas quedan pendientes de definición.

| ID | Atributo | Requerimiento | Criterio de aceptación previsto |
| --- | --- | --- | --- |
| RNF-01 | Privacidad y acceso | La información personal y académica de cada alumno deberá ser accesible solo para las personas autorizadas dentro de sus clases. | Un alumno no puede ver respuestas, comentarios o resultados privados de otro. |
| RNF-02 | Integridad de la información | Las respuestas, intentos, resultados y comentarios deberán conservar su relación con la cuenta, clase y actividad correctas. | Al volver a entrar, cada entrega y devolución aparece en la actividad e intento correspondientes. |
| RNF-03 | Continuidad | Una entrega confirmada deberá permanecer disponible después de cerrar sesión. La aplicación deberá indicar cuando una entrega no se haya guardado. | El alumno recupera sus respuestas confirmadas y nunca recibe una confirmación falsa de envío. |
| RNF-04 | Accesibilidad | Las funciones principales deberán operar con teclado, mostrar foco visible, tener etiquetas comprensibles y comunicar estados sin depender solo del color. | El alumno puede estudiar, responder y consultar resultados sin utilizar ratón. |
| RNF-05 | Adaptación a dispositivos | La experiencia deberá permitir consultar material, responder actividades y revisar devoluciones en móvil, tableta y escritorio. | El contenido y los controles principales siguen siendo legibles y utilizables en esos tamaños de pantalla. |
| RNF-06 | Claridad pedagógica | La interfaz deberá conservar visible la relación entre tema, material, consigna, respuesta, devolución y siguiente paso. | El alumno puede identificar a qué actividad pertenece cada recurso y comentario. |
| RNF-07 | Transparencia de la IA | Las explicaciones generadas por IA deberán distinguirse de la consigna, la respuesta del alumno y la retroalimentación recibida. | El alumno identifica qué contenido proviene de IA y cuál es su propio trabajo o una devolución de la clase. |
