# Phase 2 Infrastructure Setup

## What is already prepared

- PostgreSQL container definition in `docker-compose.yml`.
- Environment template in `.env.example`.
- Prisma schema in `prisma/schema.prisma`.
- Initial SQL migration in `prisma/migrations/20260214120000_init/migration.sql`.
- Prisma client helper in `src/lib/prisma.ts`.

## Commands

```bash
npm run db:up
npx prisma migrate dev --name init
npx prisma generate

# create admin password hash for NEXTAUTH credentials login
node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 12))"
```

## Important note

In this environment, Docker CLI is installed but Docker Desktop daemon is not currently running, so the database container could not be started yet. Once Docker daemon is running, execute the commands above to apply the migration to PostgreSQL.
