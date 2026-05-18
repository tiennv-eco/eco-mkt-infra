# Design Tokens

Canonical reference for Ecomobi design system tokens used across the project.
Source of truth: `ecomobi-design-system.html` (rendered at `/knowledge-base/brand-system/design-guidelines/general-tokens`).

---

## Typography tokens

| Token | Value |
|---|---|
| `--font-sans` | `'DM Sans', 'Google Sans', -apple-system, system-ui, sans-serif` |
| `--font-serif` | `'IBM Plex Serif', Georgia, serif` |
| `--font` | `var(--font-sans)` |

**Google Fonts URL (sans):**
```
https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap
```

**Google Fonts URL (serif, pulled alongside sans in design system HTML):**
```
https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap
```

In `app/layout.tsx` both are loaded via `next/font/google` and injected as CSS variables at runtime. The `--font-sans` fallback in `:root` is overridden by Next.js at runtime — the fallback exists only for environments where `next/font` doesn't run.

**Usage rules:**
- Use `var(--font-sans)` for all UI, headings, body, labels, buttons.
- Use `var(--font-serif)` for pull quotes and editorial accent moments only.
- Never hardcode a font-family string in component CSS — always reference the token.

---

## Colour tokens

| Token | Value | Role |
|---|---|---|
| `--red` | `#F43C34` | Brand primary, CTAs, active states |
| `--red-dark` | `#E22820` | Hover state for red elements |
| `--red-pale` | `#FEF3F2` | Light red tint, selected card bg |
| `--red-light` | `#FFE2E1` | Red border, badge border |
| `--black` | `#1A1A1A` | Primary text |
| `--gray-800` | `#272727` | Dark secondary text |
| `--gray-600` | `#535353` | Body secondary |
| `--gray-400` | `#A3A3A3` | Muted / placeholder |
| `--gray-200` | `#E6E6E6` | Borders, dividers |
| `--gray-100` | `#F5F5F5` | Hover backgrounds |
| `--gray-50` | `#FAFAFA` | Page canvas |
| `--white` | `#ffffff` | Component surface |
| `--border` | `#E4E4E4` | Default border |

---

## Spacing

All spacing uses an 8px base grid. Common values: 4, 8, 12, 16, 20, 24, 32, 40, 48px.

---

## Border radius

| Use | Value |
|---|---|
| Small (chips, badges) | `4px` |
| Default (cards, inputs) | `8px` |
| Pills | `20px` |

---

## How to use these in CSS modules

```css
/* ✓ correct */
.myComponent {
  font-family: var(--font-sans);
  color: var(--black);
  border: 0.5px solid var(--gray-200);
  border-radius: 8px;
}

/* ✗ wrong — hardcoded */
.myComponent {
  font-family: 'DM Sans', sans-serif;
  color: #1A1A1A;
}
```
