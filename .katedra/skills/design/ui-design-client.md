---
name: ui-design-client
description: "Premium UI/UX Design System for Katedra. Defines typography, precise color palette, glassmorphism, and structural rules."
---

# Katedra Design System

An academic workspace design system that merges sober-editorial geometry, dynamic glassmorphism, and premium aesthetics. Designed exclusively for educators to look stunning, modern, and highly professional at first glance.

## Typography

We use a strict two-font system to create contrast between structural content and highlighted concepts.

| Tier | Font Family | Usage | Characteristics |
| :--- | :--- | :--- | :--- |
| **Primary / UI / Body** | `Inter` (Sans-Serif) | Headings, nav links, buttons, body text, badges. | Highly legible, modern, neutral. Weights: 400, 500, 600, 700. |
| **Highlights / Emphasis** | `Manrope` (Sans-Serif) | Specific highlighted words inside sentences (e.g., "en vivo", "segundos"). | **Must be italicized** (`italic`), weight 600. No underlines. |

*Note on Highlights: When using Manrope italic for highlights, use `#FFFFFF` on dark backgrounds and `#0F172A` on light backgrounds.*

## Color Palette

The color system relies on high-contrast darks, clean whites, and vibrant, sophisticated accents.

| Category | Token | Value | Description |
| :--- | :--- | :--- | :--- |
| **Brand & Text** | `primary` | `#0F172A` | Deep Slate (Main text, dark backgrounds, high-contrast text) |
| | `secondary` | `#475569` | Muted Slate (Secondary text, monochrome icons in carousels) |
| | `tertiary` | `#64748B` | Lighter Slate (Subtitles, disabled states) |
| | `borders` | `#E8EBF0` / `#EEF1F5` | Very light grayish-blue for clean borders |
| **Surfaces** | `canvas` | `#FFFFFF` | Pure White for main content and cards |
| | `surface-soft` | `#FAFBFC` / `#FCFCFD` | Soft backgrounds for sidebars and secondary blocks |
| **Accents** | `emerald` | `#10B981` | Vibrant Green (Success, Biology, primary accents) |
| | `amber` | `#F59E0B` / `#FBBF24` | Warm Yellow/Amber (Literature, warnings, glow effects) |
| | `steel-blue`| `#2C5282` / `#2B6CB0` | Deep Blue (Calculus, primary gradients) |
| **Monochrome Icons**| `icon-slate` | `#475569` | Used for all integration/brand icons in carousels with 65% opacity. |

## Shapes, Cards & Geometry

The interface must inspire trust and structure while feeling extremely premium.

- **Main Cards & Panels:** `18px` border radius (e.g., the playground grid, floating mockups).
- **Buttons & Small Inputs:** `9px` to `11px` border radius.
- **Pills & Tags:** Fully rounded (`100px` or `9999px`) for badges and small UI indicators.
- **Borders:** Cards should have a subtle `1px solid #E8EBF0` border on light backgrounds.

## Shadows, Glows & Glassmorphism

Elevation and glows are critical to Katedra's modern aesthetic.

- **Standard Card Lift:** `0 24px 60px rgba(15, 23, 42, 0.10)` — Base shadow for large panels and grid layouts.
- **Deep Floating Lift:** `0 40px 90px rgba(15, 23, 42, 0.35), 0 8px 24px rgba(15, 23, 42, 0.18)` — For floating artifacts or embedded documents over dark/complex backgrounds.
- **Button Hover:** `0 10px 30px rgba(15, 23, 42, 0.28)` — For primary call-to-action buttons.
- **Glassmorphism (Carousels/Navs):** Use semi-transparent backgrounds with backdrop filters. For example, `rgba(255, 255, 255, 0.72)` with `backdrop-filter: blur(16px)`.
- **Background Glows:** Use absolute positioned, blurred `div`s with radial gradients (e.g., `#34D399` or `#FBBF24` with `filter: blur(20px)` and opacity `0.4` - `0.6`) for dynamic hero backgrounds.

## Layout, Spacing & Responsive Constraints

To ensure a pixel-perfect, consistent experience across all views, strictly adhere to these spacing and structural metrics:

1. **Section Spacing & Margins:**
   - **Between Major Sections:** Use massive spacing (`96px` to `172px`). Example: Playground padding is `172px 24px 96px`.
   - **Between Headings and Content:** `14px` to `22px`.
   - **Block Margins:** Use `44px` or `36px` to separate text blocks from interactive grids.

2. **Component Padding (Internal Spacing):**
   - **Inside Main Cards / Viewers:** Generous padding (`28px 30px`).
   - **Inside Sidebars:** `18px 14px`.
   - **Toolbar/Tabs:** `11px 16px`.
   - **Buttons / Small Inputs:** `15px 28px` for large CTAs, `9px 15px` for standard buttons, `11px 12px` for sidebar list items.

3. **Container Max-Widths:**
   - **Navigation Bar:** `min(1180px, calc(100% - 32px))`
   - **Standard Content Sections (e.g. Playground):** `1080px`
   - **Hero Text Blocks:** `920px` to `760px`
   - **Floating Artifacts/Mockups:** `880px`

4. **Grids & Layouts:**
   - **Two-Column App Layouts (Playground/Dashboards):** Use `display: grid` with `grid-template-columns: 236px 1fr` and `gap: 0`. Minimum height for main app containers should be `520px`.
   
5. **Responsive Breakpoints:**
   - `@media (max-width: 820px)`: Hide complex decorations (floating doodles, secondary nav links).
   - `@media (max-width: 720px)`: Collapse structural two-column grids (`grid-template-columns: 1fr`). Sidebars should shift to `flex-direction: row` with `overflow-x: auto` to become horizontally scrollable tab bars.
   - `@media (max-width: 480px)`: Stack all multi-column footers or grids into single columns (`grid-template-columns: 1fr`).

6. **Carousel Integrations:** Carousels must have a blurred glassmorphic background container. The icons inside must be monochrome (`#475569` at `65%` opacity) with a single, small colored dot to distinguish the brand.

7. **Animations:** Use `framer-motion` for smooth staggered fade-in-up animations (`ease: [0.16, 1, 0.3, 1]`, duration `0.75s`). Interactive elements must translate slightly (`-3px` on Y axis) on hover.

## Important Development Rule
Always translate these exact design values into standard React components (or Tailwind CSS where applicable). Maintain this exact styling to ensure uniform design across all interfaces.