## 1. Test tooling

- [x] 1.1 Add Vitest to `apps/backend` with `pnpm --filter backend add -D vitest` and a `test` script
- [x] 1.2 Add Vitest, jsdom, `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom` to `apps/frontend` with pnpm; configure the jsdom environment and a `test` script
- [x] 1.3 Verify both workspaces run an empty suite through the vitest MCP server (`run_tests`)

## 2. Backend: data model and validation

- [x] 2.1 Write failing tests for `planSchema` (empty/over-long fields, invalid and impossible dates, whitespace trimming, valid input)
- [x] 2.2 Add the `Plan` model (`code`, `description`, `dueDate @db.Date`, `userId`, `createdAt`, `@@unique([userId, code])`, `@@index([userId, dueDate])`) and the `plans` relation on `User`
- [x] 2.3 Generate and commit the migration `add_plans` in `apps/backend/prisma/migrations`
- [x] 2.4 Implement `planSchema` in `lib/schemas.ts` until 2.1 passes

## 3. Backend: plans API

- [x] 3.1 Write failing router tests with an in-memory store: create → 201 and listed; duplicate code → 409 with `errors.code`; invalid body → 400 with `errors`; no session → 401; per-user isolation; ordering by due date then creation
- [x] 3.2 Implement the `PlansStore` interface, the Prisma-backed store, and `createPlansRouter(store)` in `routes/plans.ts` (`GET` and `POST`, serialize `dueDate` as `YYYY-MM-DD`, map Prisma `P2002` to 409)
- [x] 3.3 Mount the router at `/api/plans` behind `requireAuth` in `app.ts`
- [x] 3.4 Run backend tests via the vitest MCP server and `pnpm --filter backend typecheck`

## 4. Frontend: API client and state

- [x] 4.1 Write failing tests for `usePlans` (loads list, `addPlan` inserts in due-date order without refetch, surfaces field errors and keeps data on failure)
- [x] 4.2 Add the `Plan` type, `api.listPlans`, and `api.createPlan` to `api/client.ts`
- [x] 4.3 Implement `usePlans` and the shared plan comparator until 4.1 passes

## 5. Frontend: atoms and design order

- [x] 5.1 Create `components/atoms/` (`Button`, `Field`, `TextArea`, `ProfileIcon`, `Mark`) moving existing code from `ui.tsx`, using tokens only
- [x] 5.2 Turn `components/ui.tsx` into a barrel re-exporting the same public names so auth pages are untouched
- [x] 5.3 Verify `pnpm --filter frontend build` passes and no auth page changed behavior or copy

## 6. Frontend: molecules and organisms

- [x] 6.1 Write failing tests for `PlanForm` (Spanish validation errors per field, valid submit payload, cancel, keeps values on failure)
- [x] 6.2 Implement `molecules/PlanForm` and `molecules/PlanCard` (ID, description, due date formatted in Spanish via UTC)
- [x] 6.3 Write failing tests for `PlanList` (cards render, order, empty-state message)
- [x] 6.4 Implement `organisms/PlanList`
- [x] 6.5 Write failing tests for `Navbar` (mark, profile icon accessible name includes the user name, logout click calls the handler and disables while pending)
- [x] 6.6 Implement `molecules/ProfileMenu` and `organisms/Navbar` (min 44px targets, wraps at 320px)

## 7. Frontend: template and page

- [x] 7.1 Write a failing `MyPlansPage` flow test with a mocked API: open "Nuevo plan" → submit → card visible with no reload; remount with the persisted list → card still visible
- [x] 7.2 Implement `templates/AppShell` (Navbar + main) and rewrite `MyPlansPage` (greeting, "Nuevo plan" button, form toggle, list, success notice); remove the logout button from the page body
- [x] 7.3 Update the protected-route usage so the navbar only appears on authenticated screens

## 8. Verification

- [x] 8.1 Run all backend and frontend tests via the vitest MCP server and confirm at least 4 new tests per workspace pass
- [x] 8.2 Search the new components for raw hex/rgb/palette colors and for legacy tokens (design-tokens spec)
- [x] 8.3 Manual check with `pnpm dev`: create a plan → card appears → reload → card still visible; duplicate ID shows an error; logout from the navbar works at 320px width
- [x] 8.4 Update the README with the new flow and note it in the OpenSpec change before archiving
