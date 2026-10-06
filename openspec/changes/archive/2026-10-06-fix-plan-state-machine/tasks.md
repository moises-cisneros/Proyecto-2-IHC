## 1. Backend domain rule (TDD first)

- [x] 1.1 Create `apps/backend/src/lib/planState.test.ts` with exactly four tests: initial state is `borrador`; `confirmPlan` yields `confirmado`; confirming an already confirmed plan throws `InvalidTransitionError`; the transition preserves `description`, `dueDate`, `userId` (and other fields)
- [x] 1.2 Implement `apps/backend/src/lib/planState.ts` (`PLAN_STATES`, `INITIAL_PLAN_STATE`, `confirmPlan`, `InvalidTransitionError`) until the four tests pass

## 2. Backend persistence and API

- [x] 2.1 Update `prisma/schema.prisma` default to `borrador` and add a migration mapping `hecho→confirmado`, `pendiente|retrasado→borrador`
- [x] 2.2 Update `lib/schemas.ts`: states `borrador|confirmado`, drop `estado` from `planSchema`, remove `updatePlanStatusSchema`; adjust `schemas.test.ts`
- [x] 2.3 Update `services/plans.service.ts`: create always uses `INITIAL_PLAN_STATE`; replace `updateStatus` with `confirm(userId, planId)` using the pure rule and a guarded `updateMany`
- [x] 2.4 Update `routes/plans.ts`: replace `PATCH /:id` with `POST /:id/confirm` (`404` not found/not owned, `409` invalid transition, `200` plan); keep delete route
- [x] 2.5 Update `routes/plans.test.ts` (and the seeder if it sets states) for the new states and endpoint; keep at least four tests per file
- [x] 2.6 Run backend tests with the Vitest MCP and record results

## 3. Frontend data layer

- [x] 3.1 Update `src/api/client.ts`: `PlanStatus = "borrador" | "confirmado"`, replace `updatePlanStatus` with `confirmPlan`, remove `estado` from `PlanInput`
- [x] 3.2 Update `src/hooks/usePlans.ts` (`confirmPlan`, keep `deletePlan`) and `usePlans.test.tsx`
- [x] 3.3 Update `PlanForm.tsx` and `PlanForm.test.tsx` so no state is sent or shown

## 4. Frontend plan card UX

- [x] 4.1 Add a presentational `ConfirmDialog` (Radix `AlertDialog` from `radix-ui`) with pending/disabled state and tests
- [x] 4.2 Rework `PlanCard.tsx`: remove `<select>`, state badge (Borrador/Confirmado + check), "Confirmar plan" only for drafts opening the dialog, ⋮ `DropdownMenu` with destructive "Eliminar" opening a dialog that names the plan
- [x] 4.3 Wire `PlanList.tsx` and `MyPlansPage.tsx` to `confirmPlan`/`deletePlan` with success and error feedback
- [x] 4.4 Update `PlanCard.test.tsx`, `PlanList.test.tsx`, `MyPlansPage.test.tsx` (at least four tests each)

## 5. Navbar

- [x] 5.1 Make `Logo` (mark + name) the single link to `/mis-planes` and remove the duplicate "Mis planes" `NavLink` in `Navbar.tsx`; add/update tests

## 6. DESIGN.md alignment

- [x] 6.1 Replace gradients and blur halos with solid tokens in `button.tsx`, `AuthDialog.tsx`, `PlanDialog.tsx`, `LandingScreen.tsx`, `AppShell.tsx`, `LoadingScreen.tsx`, and `Logo.tsx`
- [x] 6.2 Remove `animate-float` and its keyframes; remove the `bg-brand-gradient`, `text-brand-gradient`, `bg-mesh` utilities
- [x] 6.3 Remove `coral`, `popover`, `brand-start/mid/end` tokens from `tokens.css` and update `apps/frontend/DESIGN.md`
- [x] 6.4 Verify no gradient/blur/infinite-animation/raw-color matches remain with `rg`, and check contrast of the solid primary button

## 7. Documentation and verification

- [x] 7.1 Add the state-test section with the command to `README.md`
- [x] 7.2 Create `docs/task-02-state-tests.md` (rule, four tests, command, expected output)
- [x] 7.3 Run backend and frontend suites with the Vitest MCP, then typecheck/lint with `pnpm`
- [x] 7.4 Manual check: create plan (borrador) → Confirmar plan with dialog → reload → still confirmado; double confirm rejected; delete via ⋮ with confirmation; brand link navigates to `/mis-planes`
