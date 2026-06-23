# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite HMR)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting for src/**/*
npm run typecheck    # TypeScript type checking (no emit)
npm run validate     # typecheck + lint combined
```

Requires Node 24.x.

## Architecture

Single-page React 19 application with no client-side routing — navigation uses smooth-scroll anchor links (`#hero`, `#services`, etc.).

**Key path aliases** (configured in `vite.config.ts`):
- `@` → `src/`
- `@components` → `src/components/`
- `@hooks` → `src/hooks/`
- `@utils` → `src/utils/`
- `@types` → `src/types/`

**Component layout** (rendered top-to-bottom in `App.jsx`):
1. `CursorAndProgress` — custom cursor + scroll progress bar (disabled on mobile)
2. `Navbar` — sticky header with anchor links
3. `Hero`, `Services`, `About`, `Skills`, `Contact`, `Footer`
4. `Projects`, `ROICalculator`, `Testimonials` — currently commented out in `App.jsx`

**Mixed JSX/TSX codebase:** Most components are `.jsx`; newer/stricter components (e.g., `sections/Contact.tsx`) use `.tsx`. TypeScript strict mode is off.

**Forms:** `sections/Contact.tsx` uses React Hook Form + Zod. Shared types live in `src/types/index.ts` (`ContactFormData`, `Project`, `Service`, etc.).

**Email:** `src/utils/api/email.ts` wraps EmailJS via a Vercel serverless function — never call EmailJS directly from components to avoid exposing keys.

**Animations:** Framer Motion throughout. Always respect `useReducedMotion()` from `src/hooks/useMediaQuery.ts` when adding new animations.

**Styling:** Tailwind CSS utility classes + global design tokens/animations in `src/styles/index.css`. Custom color palette (`bg-*`, `accent-*`, `muted-*`) and fonts (Syne headings, DM Sans body) defined in `tailwind.config.js`.

**Code style:** No semicolons, single quotes, trailing commas (ES5), 100-char line width (`.prettierrc`). Run `npm run format` before committing.

## Deployment

Deployed to Vercel (main branch). CI pipeline: lint → typecheck → build → deploy. Environment variables needed at build time: `VITE_EMAILJS_*`, `VITE_STRIPE_PK`. Security headers (CSP, HSTS, etc.) are configured in `vercel.json`.
