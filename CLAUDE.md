@AGENTS.md

---

## Design system — exact values

### Typography

Font family: `'DM Sans', 'Google Sans', -apple-system, system-ui, sans-serif`
Serif accent: `'IBM Plex Serif', Georgia, serif` (pull quotes only — do not use for UI)

Google Fonts URL (sans):
```
https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap
```

Loaded in `app/layout.tsx` via `next/font/google` → `DM_Sans` → CSS variable `--font-sans`.
Always reference `var(--font-sans)` in CSS; never hardcode the family name.

### Colours (most-used tokens)

- Brand red: `#F43C34` (`--red`)
- Red hover: `#E22820` (`--red-dark`)
- Primary text: `#1A1A1A` (`--black`)
- Muted text: `#A3A3A3` (`--gray-400`)
- Border: `#E6E6E6` (`--gray-200`)
- Page canvas: `#FAFAFA` (`--gray-50`)

Full token list: `docs/DESIGN_TOKENS.md`

---

## Coding rules (non-negotiable)

1. All borders: `0.5px solid` (never `1px` for design chrome).
2. Page background: `#FAFAFA` (never pure white at page level).
3. Font sizes: use the design system scale — 9, 10, 11, 12, 13, 14, 16, 20, 22, 24px.
4. IBM Plex Serif: reserved for pull quotes and editorial accent. Never in UI chrome.
5. DM Sans. Always the project font. Never hardcode other sans families.
6. CSS variable tokens only — `var(--font-sans)`, `var(--red)`, `var(--black)` etc. No literal values in component CSS.
