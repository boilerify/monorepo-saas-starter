# Repository Guidelines

## Project Structure & Module Organization
- apps/web: Next.js (App Router). Start on port 3000.
- apps/marketing: Vite + React SPA. Start on port 5173.
- packages/ui: Shared React UI library (Tailwind CSS v4). Exports components and `styles.css`.
- packages/db: Prisma client and schema. Builds TypeScript to `dist/`.
- packages/*-config: Shared ESLint, TS, and Tailwind/PostCSS configs.
- docs: Project notes (Tailwind, Prisma, shadcn).

Use workspace imports (e.g., `@repo/ui`, `@repo/db`). Keep app-specific code in `apps/*` and reusable logic in `packages/*`.

## Build, Test, and Development Commands
- Root (Turbo, all packages):
  - `pnpm dev` — Run all `dev` tasks (non-cached, persistent).
  - `pnpm build` — Build all packages/apps (Turbo caches).
  - `pnpm lint` — Lint workspace (ESLint via shared configs).
  - `pnpm check-types` — Type-check across packages.
  - `pnpm format` — Prettier format `*.ts, *.tsx, *.md`.
- apps/web:
  - `pnpm --filter web dev|build|start|lint|check-types`.
- apps/marketing:
  - `pnpm --filter marketing dev|build|preview|lint`.
- packages/db (Prisma):
  - `pnpm --filter @repo/db prisma:migrate:dev|studio|db:push|generate`.

## Coding Style & Naming Conventions
- Language: TypeScript, Node >= 18.
- Formatting: Prettier; 2-space indentation; LF line endings.
- Linting: `@repo/eslint-config` presets (Next.js, React). Zero warnings in CI.
- Naming: React components `PascalCase.tsx` in `packages/ui`; utility modules `kebab-case.ts`; Next.js routes follow folder conventions.
- Styles: Tailwind v4 via `@repo/tailwind-config`; import shared `styles.css` where needed.

## Testing Guidelines
- No test runner is configured yet. If adding tests:
  - Libraries: Vitest (`*.test.ts`) colocated with source.
  - Apps: Playwright for E2E where valuable.
  - Prefer fast, deterministic tests; mock network/DB.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). Scope with package/app name when useful (e.g., `feat(web):`).
- PRs: Include summary, linked issues, before/after notes or screenshots, and steps to validate. Keep PRs focused and small.

## Security & Configuration Tips
- Do not commit secrets. Use local `.env` files (see `packages/db/.env`).
- Run `pnpm install` at root; workspace uses `pnpm` + Turbo for orchestration.
