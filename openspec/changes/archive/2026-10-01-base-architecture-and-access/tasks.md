## 1. Monorepo and Docker infrastructure

- [x] 1.1 Create `pnpm-workspace.yaml`, root `package.json` (scripts: dev, down, logs, seed, build), `.gitignore`, `.dockerignore`, `.env.example`
- [x] 1.2 Scaffold `apps/backend` (package.json, tsconfig, Dockerfile.dev) and `apps/frontend` (package.json, tsconfig, Vite config with polling + `/api` proxy, Dockerfile.dev)
- [x] 1.3 Create root `docker-compose.yml` with `db` (healthcheck), `backend` (3000) and `frontend` (5173) with hot-reload volumes
- [x] 1.4 Run `pnpm install` and commit `pnpm-lock.yaml`

## 2. Backend: data layer and seeders

- [x] 2.1 Prisma schema with `User` model (id, email unique, passwordHash, name, resetTokenHash, resetTokenExpiresAt, createdAt, updatedAt) and initial migration
- [x] 2.2 `prisma/seed.ts` idempotent upsert of `usuario1@planazo.com` and `usuario2@planazo.com`; configure `prisma.seed` in backend `package.json`

## 3. Backend: auth API

- [x] 3.1 Express app (`app.ts`/`server.ts`): JSON, cookie-parser, CORS with credentials, health route, error handler
- [x] 3.2 Auth utilities: bcrypt hashing, JWT cookie issue/clear, `requireAuth` middleware, zod schemas
- [x] 3.3 Endpoints `register`, `login`, `logout`, `me`
- [x] 3.4 Endpoints `recover` and `recover/confirm` (simulated token)

## 4. Frontend: access flow

- [x] 4.1 Tailwind setup, base layout and styles carried over from the legacy landing
- [x] 4.2 API client (`fetch` with credentials) and `AuthProvider` context
- [x] 4.3 Pages: Landing (`/`), Login, Register, Recover with validation and error feedback
- [x] 4.4 `ProtectedRoute`, `/mis-planes` page with welcome + working logout, redirect of signed-in users away from auth pages
- [x] 4.5 Remove legacy root `index.html` and `styles.css`

## 5. Documentation and agent config

- [x] 5.1 `docs/task-01-access.md` (modality, decisions, data structure, route/file map)
- [x] 5.2 Update `README.md` (quick start, prerequisites, seeded users table, manual seed/migrate)
- [x] 5.3 Rename `AGENTS.MD` to `AGENTS.md` and align it (pnpm-only, SDD, engram, codegraph); align `CONTRIBUTING.md` (remove any `npm` mention)

## 6. Verification

- [x] 6.1 `pnpm dev` builds and starts the whole stack; API health and seeded login work via curl
- [x] 6.2 End-to-end check through the Vite proxy: register, login, `me`, logout, recover, protected redirect
- [x] 6.3 Hot reload check (edit a backend and a frontend file) and confirm `docs/project-card.md` is unchanged
