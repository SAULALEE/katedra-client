---
version: "2.1"
name: Katedra Design System
description: "Premium UI/UX Redesign. Inspiración Whimsical pero con identidad académica (Azules y Verdes). Enfoque extremo en interactividad, animaciones de scroll, adaptabilidad de temas y legibilidad."

colors:
  # Brand & Accent (Paleta Educativa - Claro por defecto)
  primary: "#0F172A"       # Azul Marino Profundo (Textos, Sombras, Botones)
  primary-light: "#2563EB" # Azul Brillante (Acentos, Degradados)
  primary-pale: "#DBEAFE"  # Azul Nube (Fondos sutiles, Etiquetas)
  
  # Canvas & Surfaces (Modo Claro)
  canvas: "#FFFFFF"        # Blanco puro
  surface-light: "#F0F4F8" # Gris/Azul suave (Tarjetas grandes, paneles)
  surface-2: "#F8FAFC"     # Variaciones de grises claros
  surface-3: "#E2E8F0"
  
  # Education Accents
  accent-green: "#10B981"  # Verde Esmeralda (Éxito, educación, highlights)
  accent-green-pale: "#D1FAE5" # Verde pálido (Fondos de badges de éxito)
  accent-blue-pale: "#DBEAFE"
  
  # Text
  ink: "#0F172A"
  ink-muted: "#475569"
  ink-subtle: "#64748B"

  # Dark Mode Equivalents (Semánticos en CSS)
  dark:
    canvas: "#010102"
    surface-1: "#0F1011"
    surface-2: "#141516"
    surface-3: "#18191A"
    ink: "#F2F2F0"
    ink-muted: "#7C8C9C"
    ink-subtle: "#7C849C"

typography:
  display-xl:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 96px
    fontWeight: 700
    letterSpacing: -0.96px
  
  display-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 700
    letterSpacing: -0.48px
  
  body-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  
  kicker:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 700
    letterSpacing: 1.35px
    textTransform: uppercase

rounded:
  # Binary Radius System (Esquema estricto)
  none: 0px
  utility-sm: 8px     # Badges, dropdowns
  utility-lg: 12px    # Botones principales, inputs, tarjetas de utilidad
  utility-xl: 16px    # Tarjetas medianas
  illustrative-sm: 80px  # Elementos decorativos grandes
  illustrative-md: 120px # Tarjetas masivas y paneles ilustrativos (Hero/Dashboard)
  illustrative-lg: 160px
  pill: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 60px
  section: 96px

ui_ux_principles:
  1_interactivity_and_hovers: "Todo elemento interactivo DEBE tener un hover state definido. Usa transiciones suaves (`transition-all duration-300`). Los botones deben levantarse ligeramente (`hover:-translate-y-0.5`) y aumentar su sombra."
  2_generous_padding: "La interfaz debe respirar. Evita agrupar elementos. Usa padding generoso (`p-6` a `p-12`) en tarjetas y asegúrate de dejar al menos 96px entre secciones grandes."
  3_binary_radius: "Respeta la separación entre UI y Arte. La UI (botones, inputs) usa 12px. Los elementos ilustrativos (paneles generados, fondos hero) usan 80px a 120px."
  4_scrollytelling: "La Landing Page debe sentirse viva. Utiliza animaciones vinculadas al scroll (`framer-motion` con `useScroll` y `useTransform`) para revelar elementos, especialmente metáforas visuales (ej. un libro dibujándose)."
  5_glassmorphism_subtle: "Aplica transparencias y desenfoques (blur) muy sutiles (`backdrop-blur-sm`, `bg-white/80`) solo cuando un elemento flote sobre un canvas enriquecido."
  6_no_inline_styles: "PROHIBIDO el uso de estilos inline (`style={{ ... }}`) para definir colores, fondos, fuentes o espaciados que varíen con el tema. Toda propiedad visual debe controlarse a través de clases de Tailwind CSS o variables CSS para garantizar compatibilidad con el modo claro/oscuro."
  7_theme_semantic_consistency: "Nunca asumas un tema claro hardcodeado en la lógica del componente si los estilos de fondo provienen de variables CSS mutables. Si una página como Login/Register necesita forzar un aspecto de fondo claro y tarjeta limpia (estilo Whimsical clásico), debe envolverse explícitamente en una clase `.light` en su contenedor raíz, o utilizar clases de Tailwind adaptadas (ej. `bg-canvas dark:bg-zinc-950`)."
  8_layout_overlap_prevention: "Evitar el uso de `!important` para paddings o márgenes de contenedores estructurales en el CSS global (como `.login-page-container`). Los espaciados de cabecera deben manejarse con padding dinámico en el HTML/React (ej. `pt-32 sm:pt-36`) para no sobreescribir ni anular el flujo del documento frente a elementos fijos (`fixed`)."

shadows:
  soft: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
  hover: "0 10px 30px -5px rgba(15, 23, 42, 0.15)"
  illustrative: "0 20px 40px -10px rgba(15, 23, 42, 0.1)"