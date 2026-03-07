# AGENTS Guide for `muslim-pro`

Operational guide for coding agents working in this repository.
Follow these rules first, then local file patterns.

## 1) Repository Snapshot

- Stack: Next.js App Router + React + TypeScript + Prisma + NextAuth.
- Package manager: npm (`package-lock.json` is present).
- Runtime: Node.js 20+ (README prerequisite).
- DB: MySQL via Docker Compose, accessed with Prisma.
- Path alias: `@/*` -> `src/*` (`tsconfig.json`).

## 2) Cursor/Copilot Rule Files

Checked locations for additional agent rules:

- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.

If any of these files are added later, treat them as high-priority instructions.

## 3) Setup Commands

```bash
npm install
cp .env.example .env
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 4) Build, Lint, Format, and Test Commands

### Core scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
```

### Database and Prisma scripts

```bash
npm run db:up
npm run db:down
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

### Current test reality

- No `test` script is defined in `package.json`.
- No `*.test.*`, `*.spec.*`, or `__tests__` directories are in this repo.
- No Jest/Vitest/Playwright/Cypress config exists at the root.

### Single-test guidance (important)

- Running a single test is **not currently configured**.
- `npm run test` does not exist.
- Until a test framework is added, use targeted checks:
  - `npx eslint src/path/to/file.ts`
  - `npx prettier src/path/to/file.ts --check`
  - `npm run build`

If you introduce a test framework, add scripts for:

- `test` (full suite)
- `test:watch`
- `test:single` (single file or test name)

## 5) Code Style and Architecture Conventions

### 5.1 TypeScript and typing

- Keep type-safety strict (`strict: true` is enabled).
- Prefer explicit types for props, return values, and API payloads.
- Prefer `import type` for type-only imports.
- Avoid `any`; use unions, literals, and narrowing helpers.
- Use Prisma types where useful (`Lesson`, `Dua`, `Place`, `PlaceType`).

### 5.2 Imports and module boundaries

- Use this import order:
  1. Framework/external imports (`next/*`, `react`, libraries)
  2. Internal alias imports (`@/...`)
  3. Relative imports (`./...`), including CSS modules
- Keep a blank line between these groups.
- Prefer `@/` for non-local internal imports.

### 5.3 Formatting and linting

- Prettier config is the source of truth:
  - `semi: true`
  - `singleQuote: false`
  - `trailingComma: all`
  - `printWidth: 100`
- ESLint config uses Next core-web-vitals + TypeScript rules.
- Run `npm run format` after substantial edits.

### 5.4 Naming conventions

- Components: `PascalCase` (`ThemeProvider`, `AppShell`).
- Hooks: `useCamelCase` (`usePrayerTimes`).
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` (`PRAYER_ORDER`).
- Next route files: `page.tsx`, `layout.tsx`, `route.ts`.
- CSS Modules: `*.module.css` and `styles.className` usage.

### 5.5 React and Next.js patterns

- Add `"use client"` only when client APIs/hooks are required.
- Default to Server Components unless interactivity is needed.
- Route handlers should export method functions (`GET`, `POST`, etc.).
- Use typed `Metadata` / `Viewport` where applicable.
- In server actions/forms, validate input early and redirect/return predictably.

### 5.6 API and error handling

- Parse and sanitize query parameters explicitly.
- Clamp numeric inputs and trim string inputs.
- Return structured API errors when validation fails:
  - `{ error: { code: string, message: string } }`
  - appropriate status codes (`400`, `404`, etc.)
- Catch expected DB/network failures and provide stable fallback behavior.
- Never return secrets or internal stack traces.

### 5.7 Data access and Prisma

- Use the singleton in `src/lib/prisma.ts`.
- Keep DB access in `src/lib/*` helpers, not scattered through UI.
- Transform/select data in lib layer before returning from API/page.
- After schema updates:
  - edit `prisma/schema.prisma`
  - run `npm run prisma:generate`
  - run `npm run prisma:migrate`

### 5.8 Styling, i18n, and security

- Styling: CSS Modules + `src/styles/globals.css`.
- Keep page styles colocated (`page.module.css`).
- Reuse shell/theme primitives before creating new wrappers.
- For user-facing text, prefer `useI18n().t(...)` with existing key patterns.
- Keep auth protections intact in `src/middleware.ts`.
- Keep env usage in `.env.example`; never hardcode secrets.

## 6) Agent Completion Checklist

Before finishing code changes, run:

```bash
npm run lint
npm run format:check
npm run build
```

If DB schema changed, also run:

```bash
npm run prisma:generate
```

If you add a test runner, update this file with full-suite and single-test commands.

## 7) Scope and Non-Goals

- Do not introduce new frameworks/tooling unless required by task.
- Keep changes aligned with current App Router architecture.
- Prefer incremental, composable updates over large rewrites.
