## Context

`/mis-planes` is a placeholder (`MyPlansPage.tsx`) with the logout button in its body. Auth is cookie-session (JWT) with `requireAuth` middleware; the API client (`api/client.ts`) wraps `fetch` with `credentials: "include"` and `ApiError` carrying `fieldErrors`. Shared UI lives in a single `components/ui.tsx`; tokens in `tokens.css` (Tailwind v4 `@theme`). There is no test runner yet. See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Server is the source of truth; the UI adds the created plan from the POST response, so the card shows instantly without refetching or reloading.
- Reuse existing patterns (zod schemas + `fieldErrors`, `requireAuth`, `ApiError`, `Field`, `PrimaryButton`).
- Build UI in design order and keep `ui.tsx` consumers working.
- Testable units that do not need a live database.

**Non-Goals:**
- Edit/delete, pagination, filtering, optimistic updates, offline mode, real-time sync across tabs.
- New design tokens (existing roles, scale, and radii are enough).

## Decisions

1. **Data model: `Plan` table with composite uniqueness.** Fields: `id` (uuid PK, internal), `code` (user-entered plan ID, string ≤ 30), `description` (≤ 500), `dueDate` (`@db.Date`), `userId` (FK → User, cascade delete), `createdAt`. `@@unique([userId, code])` enforces per-user uniqueness; `@@index([userId, dueDate])` supports the list order. The user-visible "ID" maps to `code`; the UUID is never shown. *Alternative:* user-entered value as the primary key — rejected: collides across users.

2. **API: `GET /api/plans` and `POST /api/plans`** in `routes/plans.ts`, mounted under `requireAuth`. POST validates with a zod `planSchema` (trim, length limits, `YYYY-MM-DD` real calendar date) and returns `201 { plan }`; validation → `400 { errors }`, duplicate (Prisma `P2002`) → `409 { message, errors: { code } }`. Responses serialize `dueDate` as `YYYY-MM-DD`. List is ordered `dueDate asc, createdAt asc` and filtered by session user.

3. **Testable seam on the backend.** The router is built by `createPlansRouter(store)` where `store` is a small interface (`list(userId)`, `create(userId, data)`); production wires a Prisma-backed store. Unit tests use an in-memory store, so no DB is required. *Alternative:* mock `@prisma/client` — rejected: couples tests to Prisma internals.

4. **Frontend state: page-level `usePlans` hook.** Loads with `api.listPlans()` on mount; `addPlan` calls `api.createPlan`, then inserts the returned plan into state using the same comparator as the server (due date, then creation time). No refetch → no flicker; reload re-reads from the DB, which proves persistence. *Alternative:* refetch after create — rejected: extra round-trip and a visible loading state.

5. **Atomic design layout** under `apps/frontend/src/components/`, built in this order: tokens (unchanged) → **atoms** (`Button`, `Field`, `TextArea`/date via `Field`, `Icon` profile, `Mark`) → **molecules** (`PlanCard`, `PlanForm`, `ProfileMenu` = icon + name) → **organisms** (`Navbar`, `PlanList`) → **template** (`AppShell` = Navbar + `<main>`) → **page** (`MyPlansPage`). `ui.tsx` becomes a re-export barrel so auth pages keep working unchanged ("No behavior or content change" from design-tokens still holds).

6. **Navbar.** `Navbar` renders `Mark` on the left; on the right a profile icon (inline SVG, `role="img"`, `aria-label="Perfil de {name}"`, name shown from `sm` up) and the "Cerrar sesión" button. Logout reuses `useAuth().logout` + `navigate("/login")`, disabled while pending. Targets `min-h-11`; flex with wrap-safe gaps for 320px. Used only by `AppShell`, which only the protected route renders.

7. **Dates.** Stored and transported as `YYYY-MM-DD`; displayed with `Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" })` on a UTC-parsed date to avoid off-by-one shifts across time zones.

8. **Testing.** Vitest in both workspaces (`pnpm --filter <ws> add -D vitest`; frontend also `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`). Tests are run through the vitest MCP server per AGENTS.md. Per feature, at least 4 tests, planned:
   - Backend: `planSchema` validation; plans router (create → 201, list returns it; duplicate → 409; unauthenticated → 401; per-user isolation) using the in-memory store.
   - Frontend: `PlanForm` (validation errors, valid submit payload); `PlanList` (cards, ordering, empty state); `Navbar` (profile accessible name, logout click); `MyPlansPage` flow with mocked API (open form → submit → card visible without reload; remount → still visible via mocked persisted list).
   Strict TDD: each task writes the failing test first.

## Risks / Trade-offs

- [Prisma migration drifts from the schema] → generate it with `prisma migrate dev --name add_plans` against the Docker DB and commit it; seeders are unaffected.
- [Race: two quick submits create a duplicate request] → submit button disabled while pending; DB unique constraint is the final guard (409).
- [Splitting `ui.tsx` breaks auth pages] → keep `ui.tsx` as a barrel re-exporting the same names; verify with typecheck and build.
- [Client sort differs from server sort] → one shared comparator definition mirrored with a test asserting the same order.
- [New dev dependencies (Vitest, Testing Library, jsdom)] → dev-only, installed with pnpm per AGENTS.md; no runtime impact.
