# Design Aesthetic

The website reflects the warmth and depth of Indian classical music culture. Every design choice should honor the tradition while remaining clean and modern.

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Maroon | `#6B0F1A` | Primary accent — nav, headings, buttons, hero overlays |
| Maroon Dark | `#4A0A12` | FAQ section headings, deeper accents |
| Gold | `#C9A84C` | Ornaments, dividers, hover states, highlight cards |
| Gold Light | `#D4B96A` | FAQ question icons, subtle gold accents |
| Cream | `#FDF6E3` | Hero background, card backgrounds |
| Warm White | `#FFFDF7` | Page background |
| Teal | `#1A5C5A` | Links, streaming buttons, secondary accent |

## Typography

- **Playfair Display** — Headings and section titles. Serif, classical elegance.
- **Lora** — Body text. Serif, warm and readable.
- Both loaded from Google Fonts.

## Visual Motifs

- **Sanskrit ornaments** (`✿ ✿ ✿`) — placed below section titles as decorative dividers
- **Gold dividers** — thin horizontal lines separating content blocks
- **Fade-in on scroll** — elements animate in via IntersectionObserver (`.fade-in` → `.visible`)
- **Split-layout hero** — solo portrait photo left, text content right, cream background. Photo uses `object-fit: contain` so the full person is visible.

## Layout Patterns

- **Hero**: Split-layout (photo 40-45% left, content right). Homepage 100vh, sub-pages 70vh. Random portrait rotation on each load.
- **Section structure**: Title → ornament → subtitle → divider → content
- **Video grids**: Responsive flex/grid, 16:9 aspect ratio via padding-bottom trick
- **Card layouts**: Cream background, gold border on hover, centered emblems
- **Gallery**: Thumbnail grid with lightbox. Category filter buttons.
- **Accordion (FAQ)**: Maroon question bar, gold chevron icon, max-height CSS transition

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 968px | Full desktop layout, side-by-side grids |
| 768px–968px | Reduced columns, stacked video pairs |
| < 768px | Single column, hamburger nav, portal switches to agenda view |
| < 480px | Compact spacing, full-width cards |

## Guiding Principles

1. **Warmth over minimalism** — the palette and typography should feel inviting, not sterile
2. **Tradition with clarity** — Sanskrit elements and Indian motifs are decorative, never cluttering
3. **Photography first** — high-quality concert and portrait photos carry the visual identity
4. **Respectful restraint** — no autoplay, no flashy animations, no distracting transitions
5. **Accessibility** — readable contrast, keyboard navigation, semantic HTML, alt text on all images
