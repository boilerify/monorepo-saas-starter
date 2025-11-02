import { PackageManagerTabs, Tab } from '#components/tabs';
import { Callout } from '#components/callout';
import { Steps, Step } from '#components/steps';
import { CreateTurboCallout } from './create-turbo-callout.tsx';

Prisma in this monorepo

Prisma unlocks a strong developer experience for databases with its intuitive data model, automated migrations, and generated, type-safe client. This repo is configured to centralize Prisma in an internal package so all apps can reuse a single client and schema.

What we set up

- Internal db package at [packages/db](packages/db)
- Prisma schema at [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma)
- Prisma client singleton at [packages/db/src/index.ts](packages/db/src/index.ts) exporting a cached [PrismaClient()](packages/db/src/index.ts:2) as [db](packages/db/src/index.ts:9)
- Prisma scripts in [packages/db/package.json](packages/db/package.json)
- Next.js apps can import db from @repo/db; add transpilePackages to Next configs if using TS sources

Steps to connect Prisma to your managed Postgres

<Steps>
  <Step title="Set your DATABASE_URL">
    Create an environment file at [packages/db/.env](packages/db/.env) with your provider URL. Example:

    ```bash
    # packages/db/.env
    DATABASE_URL="postgres://USER:PASS@HOST:PORT/DB?schema=public"
    ```

    Note:
    - Keep credentials out of version control.
    - If your provider requires SSL, append sslmode=require:
      DATABASE_URL="postgres://USER:PASS@HOST:PORT/DB?sslmode=require&schema=public"
  </Step>

  <Step title="Install workspace deps (if you haven’t)">
    <PackageManagerTabs>
      <Tab title="pnpm">
        ```bash
        pnpm install
        ```
      </Tab>
    </PackageManagerTabs>
  </Step>

  <Step title="Introspect your existing database (optional)">
    If your database already has tables, introspect them into [schema.prisma](packages/db/prisma/schema.prisma):

    <PackageManagerTabs>
      <Tab title="pnpm">
        ```bash
        pnpm --filter @repo/db prisma db pull
        ```
      </Tab>
    </PackageManagerTabs>

    This will populate models inside [schema.prisma](packages/db/prisma/schema.prisma). After that, generate the client:

    ```bash
    pnpm --filter @repo/db prisma generate
    ```

    If you are starting from scratch, skip db pull, define your models in [schema.prisma](packages/db/prisma/schema.prisma), then run:

    ```bash
    pnpm --filter @repo/db prisma migrate dev
    ```
  </Step>

  <Step title="Ensure Next.js transpiles the internal packages during dev">
    For apps that import TS sources from internal packages, set transpilePackages. Update:

    - [apps/web/next.config.js](apps/web/next.config.js)
    - [apps/docs/next.config.js](apps/docs/next.config.js)

    Add the following setting:
    ```js
    // next.config.js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      transpilePackages: ['@repo/ui', '@repo/db'],
    };

    export default nextConfig;
    ```
  </Step>

  <Step title="Use the shared Prisma client">
    Import the shared client from @repo/db. Example Next.js route in apps/web:

    ```ts
    // apps/web/app/api/db/health/route.ts
    import { NextResponse } from 'next/server';
    import { db } from '@repo/db';

    export async function GET() {
      try {
        // Simple connectivity check
        await db.$queryRaw`SELECT 1`;
        return NextResponse.json({ ok: true });
      } catch (err) {
        return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
      }
    }
    ```
  </Step>
</Steps>

Prisma scripts

These scripts are defined in [packages/db/package.json](packages/db/package.json):

- Generate client:
  ```bash
  pnpm --filter @repo/db prisma generate
  ```
- Introspect existing DB into schema:
  ```bash
  pnpm --filter @repo/db prisma db pull
  ```
- Push schema (no migrations):
  ```bash
  pnpm --filter @repo/db prisma db push
  ```
- Create and apply migrations in dev:
  ```bash
  pnpm --filter @repo/db prisma migrate dev
  ```
- Open Prisma Studio:
  ```bash
  pnpm --filter @repo/db prisma studio
  ```

Notes and recommendations

- Centralized schema: Keep all models in [schema.prisma](packages/db/prisma/schema.prisma) to share across apps.
- Singleton client: Reuse [PrismaClient()](packages/db/src/index.ts:2) exported as [db](packages/db/src/index.ts:9) to avoid exhausting connections during hot reloads.
- Env location: Put DB credentials in [packages/db/.env](packages/db/.env). Prisma loads .env from the package by default when running commands from that directory via pnpm --filter.
- Type safety: Once models exist and the client is generated, all consuming apps will get type-safe queries from the shared client.
- CI/CD: For migrations, run prisma migrate deploy in your release pipeline to apply pending migrations idempotently.

Reference

- Prisma with Turborepo guide
- Prisma docs
