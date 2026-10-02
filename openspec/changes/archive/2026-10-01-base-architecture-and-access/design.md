## Context

Greenfield: only a static landing (`index.html`, `styles.css`) exists. See `proposal.md` for motivation. Developers work on Windows with Docker Desktop (bind mounts from the Windows filesystem do not emit inotify events), so hot reload must use polling.

## Goals / Non-Goals

**Goals:**
- One command (`pnpm dev`) to run db + backend + frontend with hot reload.
- Same-origin API access from the browser so the HTTP-only cookie works without CORS friction.
- Reproducible installs (committed `pnpm-lock.yaml`, committed Prisma migration).

**Non-Goals:**
- Real email delivery, OAuth, refresh tokens, rate limiting, production Docker images, CI.
- Any plan/group domain model beyond `User` (`/mis-planes` is a welcome placeholder).

## Decisions

1. **Language: TypeScript on both apps.** Backend runs with `tsx`; frontend uses Vite's React-TS template. Alternative (plain JS) rejected: contributing guide asks for strict typing.
2. **Prisma 6 (not 7).** `prisma db seed` must be configured in `apps/backend/package.json` (`"prisma": { "seed": "tsx prisma/seed.ts" }`); Prisma 7 moved this to `prisma.config.ts` and requires driver adapters.
3. **Session: JWT in an HTTP-only, SameSite=Lax cookie** (`planazo_session`, 7 days, `secure` only in production). Stateless, survives refresh, not readable from JS. Alternative: server-side sessions table — rejected as extra schema for this scope.
4. **Same-origin via Vite proxy.** The browser only talks to `:5173`; Vite proxies `/api` to `http://backend:3000` (target from env). CORS is still enabled for `http://localhost:5173` with credentials as a safety net.
5. **Password hashing: `bcryptjs`** (pure JS) to avoid native build issues in containers; cost 10.
6. **Validation: `zod`** on every auth endpoint; errors returned as `{ message, errors? }`.
7. **Recovery (simulated):** `User` carries `resetTokenHash` and `resetTokenExpiresAt`. `POST /api/auth/recover` stores a SHA-256 hash of a random token (15 min TTL) and returns the plain token in the body (stands in for the email). `POST /api/auth/recover/confirm` validates, sets the new bcrypt hash and clears the fields. Unknown emails get the same response shape without a token.
8. **Docker layout.** Build context is the repo root so each `Dockerfile.dev` can copy workspace manifests + `pnpm-lock.yaml` and run `pnpm install --frozen-lockfile --filter <app>...`. Base image `node:22-bookworm-slim` (+ `openssl` for Prisma). Compose mounts `./apps/<app>` over `/app/apps/<app>` with an anonymous volume on its `node_modules`, so image-installed deps are preserved. pnpm is activated through `corepack`.
9. **Hot reload on Windows:** backend uses `nodemon --legacy-watch --ext ts --exec tsx src/server.ts`; Vite uses `server.watch.usePolling` and `host: true`.
10. **Backend start sequence** (container command): `prisma generate && prisma migrate deploy && prisma db seed && nodemon ...`. `db` has a `pg_isready` healthcheck and the backend waits on `service_healthy`.
11. **Migrations** are committed under `apps/backend/prisma/migrations`, generated with `prisma migrate dev` against the compose db (or `migrate diff` if needed).
12. **Seed:** `prisma/seed.ts` uses `upsert` by email so reruns are idempotent. Users: `usuario1@planazo.com` / `Planazo123!`, `usuario2@planazo.com` / `Planazo123!` (documented in README; test-only credentials).
13. **Frontend state:** React context `AuthProvider` calls `GET /api/auth/me` on boot; `ProtectedRoute` waits for the loading state and redirects to `/login` (preserving the origin in router state). Routes: `/`, `/login`, `/register`, `/recover`, `/mis-planes`.
14. **Static landing:** the legacy `index.html`/`styles.css` are removed from the root (Vite owns `apps/frontend/index.html`); the new React landing reuses its content and tone.
15. **Root scripts** (all pnpm): `dev` = `docker compose up --build`, `down`, `logs`, `seed` = `pnpm --filter backend prisma db seed`, `build`, `lint`.

## Risks / Trade-offs

- [Polling watchers use more CPU] → acceptable for dev; documented.
- [Anonymous `node_modules` volumes can go stale after dependency changes] → `pnpm dev` uses `--build` and README documents `docker compose down -v` to reset.
- [Returning the recovery token in the response is insecure] → explicitly simulated, documented as dev-only.
- [Committed demo credentials] → test-only, seed refuses to run when `NODE_ENV=production`.
- [Prisma pinned to 6.x] → revisit when migrating to 7.
