---
version: "2.1"
name: Katedra Design System
description: "Premium UI/UX Redesign. Whimsical-inspired but with an academic identity (Blues and Greens). Extreme focus on interactivity, scroll animations, theme adaptability, and readability."

colors:
  # Brand & Accent (Educational Palette - Light by default)
  primary: "#0F172A"       # Deep Navy Blue (Text, Shadows, Buttons)
  primary-light: "#2563EB" # Bright Blue (Accents, Gradients)
  primary-pale: "#DBEAFE"  # Cloud Blue (Subtle backgrounds, Labels)
  
  # Canvas & Surfaces (Light Mode)
  canvas: "#FFFFFF"        # Pure White
  surface-light: "#F0F4F8" # Soft Grey/Blue (Large cards, panels)
  surface-2: "#F8FAFC"     # Light grey variations
  surface-3: "#E2E8F0"
  
  # Education Accents
  accent-green: "#10B981"  # Emerald Green (Success, education, highlights)
  accent-green-pale: "#D1FAE5" # Pale Green (Success badge backgrounds)
  accent-blue-pale: "#DBEAFE"
  
  # Text
  ink: "#0F172A"
  ink-muted: "#475569"
  ink-subtle: "#64748B"

  # Dark Mode Equivalents (Semantic in CSS)
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
  # Binary Radius System (Strict schema based on Whimsical)
  none: 0px
  utility-sm: 8px     # Badges, dropdowns
  utility-lg: 12px    # Primary buttons, inputs, utility cards
  utility-xl: 16px    # Medium cards
  illustrative-sm: 80px  # Large decorative elements
  illustrative-md: 120px # Massive cards and illustrative panels (Hero/Dashboard)
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
  1_interactivity_and_hovers: "Every interactive element MUST have a defined hover state. Use smooth transitions (`transition-all duration-300`). Buttons should lift slightly (`hover:-translate-y-0.5`) and increase their shadow."
  2_generous_padding: "The interface must breathe. Avoid crowding elements. Use generous padding (`p-6` to `p-12`) in cards and ensure at least 96px between major sections."
  3_binary_radius: "Respect the separation between UI and Art. The UI (buttons, inputs) uses 12px. Illustrative elements (generated panels, hero backgrounds) use 80px to 120px."
  4_scrollytelling: "The Landing Page should feel alive. Use scroll-linked animations (`framer-motion` with `useScroll` and `useTransform`) to reveal elements, especially visual metaphors (e.g., a book drawing itself)."
  5_glassmorphism_subtle: "Apply very subtle transparencies and blurs (`backdrop-blur-sm`, `bg-white/80`) only when an element floats over a rich canvas."
  6_no_inline_styles: "FORBIDDEN to use inline styles (`style={{ ... }}`) to define colors, backgrounds, fonts, or spacing that vary with the theme. Every visual property must be controlled through Tailwind CSS classes or CSS variables to ensure Light/Dark mode compatibility."
  7_theme_semantic_consistency: "Never assume a hardcoded light theme in component logic if background styles come from mutable CSS variables. If a page like Login/Register needs to force a light background and clean card look (classic Whimsical style), it must be explicitly wrapped in a `.light` class on its root container, or use adapted Tailwind classes (e.g., `bg-canvas dark:bg-zinc-950`)."
  8_layout_overlap_prevention: "Avoid using `!important` for paddings or margins of structural containers in the global CSS (like `.login-page-container`). Header spacing should be handled with dynamic padding in HTML/React (e.g., `pt-32 sm:pt-36`) so as not to overwrite or break the document flow against `fixed` elements."

shadows:
  soft: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
  hover: "0 10px 30px -5px rgba(15, 23, 42, 0.15)"
  illustrative: "0 20px 40px -10px rgba(15, 23, 42, 0.1)"