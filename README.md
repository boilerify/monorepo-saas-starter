# Boilerify Starter Monorepo

Monorepo using Turborepo + pnpm with Next.js, Vite, shared UI, and Prisma.

Each app and package is written in TypeScript and wired together via workspace imports (e.g., `@repo/ui`, `@repo/db`).

**Requirements**
- Node >= 18
- pnpm (workspace uses `pnpm` + Turbo)

**Apps & Packages**
- `apps/web` — Next.js (App Router) on port 3000
- `apps/docs` — Next.js docs site on port 3001
- `apps/marketing` — Vite + React SPA on port 5173
- `packages/ui` — Shared React UI (Tailwind CSS v4). Exports components and `styles.css`.
- `packages/db` — Prisma client and schema; builds TS to `dist/`.
- `packages/eslint-config` — Shared ESLint presets
- `packages/typescript-config` — Shared TS configs
- `packages/tailwind-config` — Shared Tailwind/PostCSS config

**Getting Started**
- Install: `pnpm install`
- Dev (all): `pnpm dev`
  - Web: http://localhost:3000
  - Docs: http://localhost:3001
  - Marketing: http://localhost:5173

**Common Commands (root)**
- Run all dev tasks: `pnpm dev`
- Build all apps/packages: `pnpm build`
- Lint workspace: `pnpm lint`
- Type-check: `pnpm check-types`
- Format: `pnpm format`

**Per-App Commands**
- Web: `pnpm --filter web dev|build|start|lint|check-types`
- Docs: `pnpm --filter docs dev|build|start|lint|check-types`
- Marketing: `pnpm --filter marketing dev|build|preview|lint`

**Database (Prisma)**
- Package: `@repo/db` (see `packages/db`)
- Local env: set `DATABASE_URL` in `packages/db/.env`
- Generate client: `pnpm --filter @repo/db prisma:generate`
- Dev migrate: `pnpm --filter @repo/db prisma:migrate:dev`
- Push schema: `pnpm --filter @repo/db prisma:db:push`
- Studio: `pnpm --filter @repo/db prisma:studio`

The web app includes a basic health route: `apps/web/app/api/db/health/route.ts`.

**UI Library**
- Import components from `@repo/ui`
- Include shared styles: `import '@repo/ui/styles.css'`

**Workspace Imports**
- Use `@repo/ui` and `@repo/db` from apps (`apps/*`) instead of relative paths.
- Keep app-specific code in `apps/*` and reusable logic in `packages/*`.

**Project Structure**
- `apps/web` — Next.js app
- `apps/docs` — Next.js docs app
- `apps/marketing` — Vite + React app
- `packages/ui` — Shared React UI (Tailwind v4)
- `packages/db` — Prisma client + schema
- `packages/eslint-config` — ESLint presets
- `packages/typescript-config` — TS configs
- `packages/tailwind-config` — Tailwind/PostCSS
- `docs` — Project notes (Tailwind, Prisma, shadcn)

**Docs**
- Tailwind: `docs/tailwindcss.md`
- Prisma: `docs/prisma.md`
- shadcn: `docs/shadcn.md`

**Conventions**
- Formatting: Prettier; 2-space indentation; LF line endings
- Linting: `@repo/eslint-config` (zero warnings in CI)
- Naming: React components `PascalCase.tsx` in `packages/ui`; utilities `kebab-case.ts`; Next.js routes follow folder conventions
- Styles: Tailwind v4 via `@repo/tailwind-config`; import shared `styles.css` as needed

**Security**
- Do not commit secrets. Use local `.env` files (see `packages/db/.env`).

**License**
This project is licensed under the terms of the license in `LICENSE`.
