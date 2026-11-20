# Diseño — Landing de alumnos

Ruta: `/alumnos`. La landing de alumnos es un **espejo exacto** de la landing de profesores (`/`): mismos bloques, elementos, bordes, espaciado, tipografía y motion. Solo cambian el contenido y la paleta: **morado** en alumnos; azul y esmeralda en profesores.

## Cómo se garantiza la paridad

- Las secciones viven una sola vez en `src/app/components/landing/` y reciben `theme` + contenido por props.
- Tokens de color: `landingTheme.js` (`TEACHER_THEME`, `STUDENT_THEME`). Los neutros (`#0F172A`, `#475569`, `#64748B`, `#EEF1F5`, `#F8FAFC`) se comparten y no dependen del tema.
- Estilos compartidos: `landingStyles.js` (botón ghost del header, mini-mock de proceso, grid de tarjetas).
- Composición de alumnos: `src/modules/public/components/StudentLandingExperience.jsx`; contenido y mocks en `src/modules/public/components/landing/`.
- Header y footer: `StudentLayout.jsx` reutiliza `LandingHeader` y `LandingFooter`, así que las páginas internas (`/alumnos/...`) comparten el mismo chrome.

**Regla:** un cambio visual en una sección compartida se aplica a ambas landings. Los colores nuevos van como token, nunca hardcodeados en un shell.

## Estructura (mismo orden que `/`)

| # | Shell | Profesores | Alumnos | id alumnos |
|---|---|---|---|---|
| 1 | `LandingHeader` | Links + "Para alumnos" + Acceder/Registrarse | Links + Buscar + "Para profesores" + Iniciar sesión/Crear cuenta + menú móvil | — |
| 2 | `LandingHero` | Mock del panel docente | `StudentMockClassPanel` (clase de Ecosistemas) | `top` |
| 3 | `LandingProcess` | 3 tarjetas | Consigna → Material → Siguiente paso (`DEMO_STEPS`) | `como-funciona` |
| 4 | `LandingFeatures` | Teoría / Evaluación / Diapositivas | Ayuda IA (`AI_HELP`) | `ia-para-aprender` |
| 5 | `LandingStats` | Métricas de marketing | Cifras reales del producto: 5 etapas, 3 ayudas, 1 lugar | — |
| 6 | `LandingIntegrations` | Formatos de exportación | Formatos en que llega el material | `conexiones` |
| 7 | `LandingTiers` | Precios | Demo de Katedra Forms (toggle + tarjeta clara y oscura) | `katedra-forms` |
| 8 | `LandingFaq` | FAQ | `STUDENT_FAQ` | `preguntas` |
| 9 | `LandingFinalCta` + `LandingFooter` | — | Mismo banner y footer oscuro de 4 columnas, más notas de privacidad y términos | — |

Extras exclusivos de alumnos, con estilo de profesores: buscador en el header, menú móvil (<820px) y chatbot estático.

## Enlace cruzado entre portales

El botón que lleva al otro portal usa la paleta **de la página donde está**: "Para alumnos" en `/` es azul (`#EFF6FF`, `#BFDBFE`, `#2C5282`), y "Para profesores" en `/alumnos` es morado. Lo mismo aplica al enlace del footer.

## Sistema visual (de `ui-design-client.md`)

- Inter para estructura; Manrope italic 600 para el énfasis dentro de títulos.
- Radios: 24px en tarjetas grandes, 16px en paneles, 18px en mocks, 9–12px en botones y 100px en pills.
- Contenedores: header de `min(1180px, 100% - 32px)`, secciones de 1080px, hero de 920px y mock de 840px.
- Motion: fade-up de 0.75s; hover con `translateY(-2…-6px)`. `MotionConfig reducedMotion="user"` se aplica en `StudentLayout`.
- Sin fotografías ni logos raster: solo iconos SVG y lucide.

## Accesibilidad

Skip link, foco visible violeta, tabs con `role="tab"`, FAQ con `aria-expanded`/`aria-controls`, Forms con `role="radio"` y resultado en `aria-live`. El buscador, el menú y el chat cierran con Escape y devuelven el foco.
