# Aequitas Design System: Tactile Brutalist (Banker Dark)

This document defines the visual language, color palettes, and UI patterns for the Aequitas "Dark Theme." It is designed to convey high-performance, institutional transparency, and individual empowerment.
This is only for Landing page & Auth pages for now!!

## 1. Core Principles
- **Deterministic**: Every element has a clear, functional purpose. No decorative clutter.
- **Instrument-Like**: UI elements should feel like physical hardware (pulsing status dots, grid overlays, precision borders).
- **Obsidian Foundation**: Deep blacks and high-contrast accents to reduce eye strain during long trading sessions.
- **Monospaced Clarity**: Use of monospaced fonts for all technical, numerical, and status-based data.

---

## 2. Color Palette

### Base
| Token | Hex/Value | Usage |
| :--- | :--- | :--- |
| `bg-dark` | `#050505` | Primary background (Obsidian) |
| `bg-card` | `rgba(10, 10, 10, 0.8)` | Secondary background for cards/containers |
| `text-primary` | `#FFFFFF` | Primary headings and critical text |
| `text-secondary` | `rgba(255, 255, 255, 0.6)` | Body text and descriptions |

### Accents
| Token | Hex/Value | Usage |
| :--- | :--- | :--- |
| `accent-cyan` | `#00F0FF` | Actions, links, active states, and system indicators |
| `accent-gold` | `#D4AF37` | Risk warnings, specialized diagnostics, and highlights |
| `status-green` | `#00FF00` | Real-time "Live" status and successful states |

---

## 3. Typography

### Primary: Inter
- **Headings**: Heavy weights (900), tight letter-spacing, uppercase.
- **Body**: Regular weights (400), accessible line-height (1.6).

### Technical: JetBrains Mono
- **Usage**: Labels, numbers, status bar, system stats, code snippets.
- **Styling**: Uppercase for labels, increased letter-spacing (0.2em+).

---

## 4. UI Patterns

### Brutalist Card
- **Background**: `rgba(10, 10, 10, 0.8)` with `backdrop-filter: blur(40px)`.
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`.
- **Shadow**: Hard-edged offset shadow. Example: `box-shadow: 20px 20px 0px rgba(0, 240, 255, 0.05)`.

### System Tag / Tagline
- Background tint: `rgba(0, 240, 255, 0.05)`.
- Border: `2px solid var(--accent-cyan)` (usually left-side).
- Font: Monospace, Uppercase.

### Status Indicators
- **Pulsed Dot**: Small circular dot with a glow/pulse animation.
- **Grid Overlay**: 10px or 20px transparent grid used for section backgrounds.

---

## 5. Components Reference

### Primary Button
- **Style**: Solid Cyan (`#00F0FF`) background, Black text.
- **Hover**: 1.05x scale, cyan drop-shadow.

### System Specs Grid
- **Structure**: Row-based items with vertical dividers (`border-right: 1px solid rgba(255, 255, 255, 0.1)`).
- **Interaction**: Vertical progress-bar fill on hover.

---

## 6. CSS Variable Reference
```css
:root {
    --bg-dark: #050505;
    --accent-cyan: #00F0FF;
    --accent-gold: #D4AF37;
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --border-dim: rgba(255, 255, 255, 0.1);
    --font-main: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```
