## Why

`/mis-planes` is an empty placeholder: signed-in users cannot create or see any plan, and "Cerrar sesión" sits in the page body. Planazo needs its first real flow (create a plan, see it instantly, still see it after a reload) and a persistent navbar for session actions.

## What Changes

- Add a "Nuevo plan" button on `/mis-planes` that opens a form with three fields: plan ID, description, and due date.
- Submitting the form creates the plan and shows it as a card in a list, without a page refresh.
- Plans are persisted per user in PostgreSQL via Prisma, so the flow Create → card visible → reload → card still visible holds.
- Add `GET /api/plans` and `POST /api/plans` (both protected by the session cookie), with server-side validation.
- Add a navbar to the authenticated area containing the Planazo mark, a profile icon (showing the user's name), and the "Cerrar sesión" button, which moves out of the page body.
- Follow the existing design order: tokens first (`tokens.css`), then atoms, molecules, organisms, and finally the page. No raw color values.
- Introduce Vitest in both workspaces with at least 4 unit tests for the new functionality, run via the vitest MCP server.

Assumptions (recorded, not asked):
- The plan ID is entered by the user (a short code such as `PLAN-001`) and is unique per user; a duplicate is rejected with a field error.
- The due date is a calendar date (no time). Past dates are allowed.
- Scope is create + list only; edit and delete are out of scope.
- The list is ordered by due date ascending, then creation time.

## Capabilities

### New Capabilities
- `plans`: creating a plan (ID, description, due date) and listing the signed-in user's plans as cards, live and persisted.
- `app-navbar`: navbar shown on authenticated screens with the brand mark, profile icon, and the logout button.

### Modified Capabilities
- `access-routes`: the "Protected plans route" requirement changes: the logout button moves from the page body into the navbar.

## Impact

- Backend: `apps/backend/prisma/schema.prisma` (new `Plan` model + migration), new `routes/plans.ts`, `lib/schemas.ts`, `app.ts`; Vitest + supertest-style tests.
- Frontend: `api/client.ts`, `components/ui.tsx` split into atoms/molecules/organisms, `pages/MyPlansPage.tsx`; Vitest + Testing Library + jsdom as devDependencies.
- Database: one new migration versioned in `apps/backend/prisma/migrations`.
- Seeders and auth endpoints are untouched; no new runtime dependencies.
