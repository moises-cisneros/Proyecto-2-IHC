## Why

Planazo currently ships only a static landing page (`index.html` + `styles.css`). There is no application runtime, no data layer and no way to identify users, so no group-planning feature can be built yet. Task 01 requires a working access flow (register, login, session, protected route) plus ready-made test users, on a reproducible monorepo that starts with a single command.

## What Changes

- Create a `pnpm` workspaces monorepo with `apps/frontend` (React + Vite + TailwindCSS) and `apps/backend` (Node.js + Express + Prisma + PostgreSQL).
- Add Docker orchestration (`db`, `backend`, `frontend`) with hot reload; root `pnpm dev` starts everything via Docker Compose.
- Add the backend auth API: `register`, `login`, `logout`, `me`, `recover` (simulated) using bcrypt-hashed passwords and an HTTP-only cookie session that survives page refresh.
- Add the Prisma `User` model, an initial migration and an idempotent seed script that inserts documented test users.
- Add the frontend access flow: public landing (`/`), login, register, password recovery and a protected `/mis-planes` route with logout.
- Document the flow (`docs/task-01-access.md`), update `README.md`, align `AGENTS.md` and `CONTRIBUTING.md` (pnpm-only, SDD with OpenSpec, engram, codegraph).
- Move the existing static landing out of the way (it is superseded by the React landing at `/`).
- `docs/project-card.md` is read-only and MUST NOT be touched.

## Capabilities

### New Capabilities
- `dev-environment`: monorepo layout, pnpm-only tooling, Docker Compose services, single `pnpm dev` entry point with hot reload.
- `user-auth`: registration, login, logout, current-user lookup, cookie session persistence and simulated password recovery.
- `access-routes`: public landing, auth views, recovery view and the protected `/mis-planes` route with redirect-to-login and logout.
- `test-user-seeding`: idempotent seed of default test users with documented credentials.

### Modified Capabilities
<!-- None: openspec/specs is empty. -->

## Impact

- New directories: `apps/frontend`, `apps/backend`; new root files: `pnpm-workspace.yaml`, `package.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `.dockerignore`.
- New dependencies (all via pnpm): express, prisma/@prisma/client, bcryptjs, jsonwebtoken, cookie-parser, cors, zod, tsx, nodemon; react, react-router-dom, vite, tailwindcss.
- Docs touched: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, new `docs/task-01-access.md`.
- Requires Docker, Node >= 20 and pnpm on the developer machine.
