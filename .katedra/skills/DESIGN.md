---
version: "1.0"
name: Katedra Design System
description: "Landing premium + App minimalista. Paleta Linear + Vercel hierarchy + Notion workspace minimalism"

colors:
  # Brand & Accent
  primary: "#052B58"
  primary-hover: "#073b78"
  primary-focus: "#052B57"
  primary-light: "#0d3f72"
  
  # Text
  ink: "#F2F2F0"
  ink-muted: "#7C8C9C"
  ink-subtle: "#7C849C"
  ink-tertiary: "#62666d"
  
  # Canvas & Surfaces
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  
  # Hairlines & Borders
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  
  # Inverse (Rare light mode)
  inverse-canvas: "#ffffff"
  inverse-surface-1: "#f5f6f6"
  inverse-surface-2: "#f6f7f7"
  inverse-ink: "#000000"
  
  # Semantic
  semantic-success: "#27a644"
  semantic-warning: "#d97706"
  semantic-error: "#dc2626"
  semantic-info: "#052B58"

typography:
  display-xl:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -3.0px
  
  display-lg:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.10
    letterSpacing: -1.8px
  
  display-md:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.0px
  
  headline:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.6px
  
  card-title:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.4px
  
  subhead:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.40
    letterSpacing: -0.2px
  
  body-lg:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  
  body:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  
  body-sm:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  
  caption:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  
  button:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: 0
  
  eyebrow:
    fontFamily: "Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: 0.4px
  
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

shadows:
  none: "none"
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)"
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.25)"
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.35)"

components:
  # BUTTONS
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: none
    shadow: "{shadows.none}"
  
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    shadow: "{shadows.sm}"
  
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: "1px solid {colors.hairline}"
  
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: "1px solid {colors.hairline-strong}"
  
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: none
  
  button-tertiary-hover:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 16px
  
  # INPUTS & FORMS
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1px solid {colors.hairline}"
  
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1px solid {colors.primary}"
    shadow: "0 0 0 3px rgba(5, 43, 88, 0.1)"
  
  text-input-error:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1px solid {colors.semantic-error}"
  
  text-input-disabled:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1px solid {colors.hairline}"
  
  # CARDS
  card-default:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.none}"
  
  card-interactive:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.sm}"
  
  card-elevated:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {colors.hairline-strong}"
    shadow: "{shadows.md}"
  
  card-feature:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 32px
    border: "1px solid {colors.hairline}"
  
  card-product-screenshot:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.lg}"
  
  card-testimonial:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
    border: "1px solid {colors.hairline}"
  
  # NAVIGATION
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "0px"
    height: 56px
    borderBottom: "1px solid {colors.hairline}"
    padding: "0 24px"
  
  sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    width: 240px
    borderRight: "1px solid {colors.hairline}"
    padding: 16px
  
  sidebar-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  
  sidebar-item-active:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.primary}"
  
  # BADGES & PILLS
  badge-default:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  
  badge-success:
    backgroundColor: "rgba(39, 166, 68, 0.1)"
    textColor: "{colors.semantic-success}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  
  badge-error:
    backgroundColor: "rgba(220, 38, 38, 0.1)"
    textColor: "{colors.semantic-error}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  
  # TABS
  tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    border: "1px solid transparent"
  
  tab-active:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    border: "1px solid {colors.primary}"
  
  # FOOTER
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "0px"
    borderTop: "1px solid {colors.hairline}"
    padding: "48px 24px"

layouts:
  hero-section:
    padding: "{spacing.section}"
    gap: "{spacing.lg}"
    alignment: "center"
    typography: "{typography.display-lg}"
    backgroundImage: "linear-gradient(135deg, {colors.canvas} 0%, {colors.surface-1} 100%)"
  
  feature-grid:
    columns: "3"
    gap: "{spacing.lg}"
    collapseAtBreakpoint: "md"
    itemComponent: "{components.card-feature}"
  
  product-showcase:
    padding: "{spacing.section}"
    gap: "{spacing.xl}"
    imageBorder: "{components.card-product-screenshot}"
  
  form-section:
    maxWidth: "480px"
    gap: "{spacing.md}"
    labelToInputGap: "{spacing.xs}"
    formFieldPadding: "{spacing.md}"
  
  dashboard-workspace:
    layout: "grid"
    columns: "1fr 240px"
    gap: "0px"
    sidebar: "{components.sidebar}"
    mainContent: "1fr"

gradients:
  hero-primary:
    from: "{colors.canvas}"
    to: "{colors.surface-2}"
    direction: "135deg"
  
  accent-subtle:
    from: "rgba(5, 43, 88, 0.05)"
    to: "transparent"
    direction: "90deg"
  
  button-hover:
    from: "{colors.primary}"
    to: "{colors.primary-hover}"
    direction: "90deg"

focus-states:
  default: "0 0 0 3px rgba(5, 43, 88, 0.1)"
  strong: "0 0 0 4px rgba(5, 43, 88, 0.2)"

breakpoints:
  mobile: "640px"
  tablet: "768px"
  desktop: "1024px"
  wide: "1280px"
  ultra: "1536px"

responsive-rules:
  mobile-padding: "16px"
  tablet-padding: "24px"
  desktop-padding: "32px"
  mobile-font-scale: "0.95"
  tablet-font-scale: "1.0"
  desktop-font-scale: "1.0"