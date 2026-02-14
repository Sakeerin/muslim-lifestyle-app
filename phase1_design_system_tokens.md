# Phase 1: Design System Tokens

Design direction: clean, premium Islamic visual identity with emerald, gold, and deep blue accents.

## UI Strategy

- Use **CSS Modules + CSS variables** as the primary design system foundation.
- Keep reusable primitives in `components/ui` (Button, Input, Card, Badge).
- Avoid heavy external UI libraries for better performance and control.

## Initial Token Set (`styles/globals.css` target)

```css
:root {
  --color-bg: #f7f8f4;
  --color-surface: #ffffff;
  --color-text: #122018;
  --color-muted: #5c6b61;

  --color-primary: #0f6a4b;
  --color-primary-strong: #0b533b;
  --color-accent: #c8a44d;
  --color-secondary: #12324a;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 6px 18px rgba(0, 0, 0, 0.1);
}
```

## Typography

- Primary UI font: `Inter`.
- Arabic content font: `Noto Naskh Arabic`.
- Type scale to be finalized in Phase 2 setup.
