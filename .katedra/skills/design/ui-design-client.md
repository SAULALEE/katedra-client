---
name: ui-design-client
description: "Premium UI/UX Redesign. Academic workspace aesthetic with Two-Face Typography, Pastel Tints, and Sober-Editorial Geometry."
---

# Katedra Design System

An academic workspace design system that merges the sober-editorial geometry and pastel tints of Notion with the structural clarity and layout rhythm of Whimsical. Designed exclusively for educators.

## Colors

| Category | Token | Value | Description |
| :--- | :--- | :--- | :--- |
| **Brand & Ink** | `primary` | `#0F172A` | Deep Academic Navy (Hero background, primary CTA, heading text) |
| | `ink-muted` | `#64748B` | Muted text for paragraphs and captions |
| | `accent-emerald` | `#10B981` | Emerald Green (Success, education, highlights) |
| **Surfaces** | `canvas` | `#FFFFFF` | Pure White for main content |
| | `surface-soft` | `#F9FAFB` | Soft Grey/Blue (Secondary blocks, sidebars) |
| **Pastel Tints** | `card-mint` | `#D1FAE5` | Notion-style utility background |
| | `card-sky` | `#E0F2FE` | Notion-style utility background |
| | `card-peach` | `#FFEDD5` | Notion-style utility background |
| | `card-lavender`| `#F3E8FF` | Notion-style utility background |

## Typography (The "Two-Face" Rule)

Strictly divide typography labor:

| Tier | Font Family | Usage | Characteristics |
| :--- | :--- | :--- | :--- |
| **Display/Headings** | `Playfair Display` (Serif) | Hero h1, section h2 headings | High contrast, elegant, evokes academic prestige. Weight 700/800, tight tracking (-0.02em). |
| **UI Chrome/Body** | `Inter` (Sans-Serif) | Nav links, buttons, body, badges | Highly legible, neutral, workspace-ready. Weight 400/500/600. |
| **Kickers** | `Inter` (Sans-Serif) | Small section labels above headings | 11px, weight 700, uppercase, wide tracking (0.14em). |

## Shapes & Geometry (Sober-Editorial)

Respect the separation between UI and Art. The interface must inspire trust and structure.

- **Buttons & Small Inputs:** 8px to 10px radius (soft rectangles).
- **Primary Buttons & Large Inputs:** 12px radius.
- **Medium Cards:** 16px radius.
- **Large Panels/Dashboards:** 24px radius maximum.
- **Extreme Pills (80px-160px):** **FORBIDDEN**. Do not use extreme illustrative blobs.
- **Fully Rounded (9999px):** Only for small badges or specific toggles, NOT large cards.

## Shadows & Elevation

- **Soft Lift:** `0 4px 20px -2px rgba(15, 23, 42, 0.05)` — Base shadow for cards.
- **Hover Lift:** `0 10px 30px -5px rgba(15, 23, 42, 0.15)` — When interacting with cards/buttons.
- **Floating Mockups:** `0 30px 70px -40px rgba(15, 23, 42, 0.25)` — Reserve deep shadows only for floating artifacts or embedded documents.

## UI/UX Principles

1. **Interactivity and Hovers:** Every interactive element MUST have a defined hover state. Use smooth transitions (`transition-all duration-300`). Cards and buttons should lift slightly (`hover:-translate-y-1.5`) and increase their shadow.
2. **Purposeful Animations:** Avoid gimmicky scroll animations. Use elegant, staggered fade-in-up animations for sections. For generative UI, use skeleton loaders (`animate-pulse`) that smoothly transition into content, replacing old scrollytelling SVGs.
3. **Generous Padding:** The interface must breathe. Avoid crowding elements. Use generous padding (`p-6` to `p-12`) in cards and ensure at least 96px between major sections.
4. **No Inline Styles:** FORBIDDEN to use inline styles (`style={{ ... }}`) to define colors, backgrounds, fonts, or spacing. Every visual property must be controlled through Tailwind CSS classes.
5. **Show the Value:** Focus the design on showing the 'Final Product' (clean documents, quizzes, slides) embedded in the UI, rather than abstract technological illustrations (like gears or glowing brains).