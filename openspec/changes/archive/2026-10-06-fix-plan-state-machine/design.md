## Context

- Backend: `plans.ts` (routes) → `plans.service.ts` (Prisma store) with Zod schemas in `lib/schemas.ts`. `estado` is a `String` column defaulting to `pendiente`; `PATCH /api/plans/:id` accepts any of `hecho|retrasado|pendiente`; creation accepts an optional `estado`.
- Frontend: `PlanCard` renders a `<select>` plus "Confirmar"/"Eliminar" buttons; `usePlans` exposes `updatePlanStatus` and `deletePlan`; `Navbar` renders two adjacent links to `/mis-planes`.
- `getDueStatus()` already derives overdue/today/soon/later from the due date.
- `radix-ui` (umbrella package) and `lucide-react` are already dependencies; `dialog.tsx` is built on Radix.
- AGENTS.md: layered backend (routes → services), no DB access in routes, pnpm only, co-located Vitest tests (≥4 per test file), Vitest MCP for verification, no AI attribution.

## Goals / Non-Goals

**Goals:**
- Formal `borrador` → `confirmado` state machine with an explicit confirm action, enforced server-side.
- Pure, directly unit-testable transition rule.
- Safer, cleaner card UX (confirm dialog, ⋮ menu, delete confirmation) and a single brand link.
- Frontend aligned with `DESIGN.md` (no gradients, no infinite animation, no dead tokens).

**Non-Goals:**
- Editing plan description or due date; an "Editar" menu entry.
- Reverting a confirmed plan; additional states.
- Reworking auth, landing copy, or layout beyond removing gradients/animation.

## Decisions

1. **Pure transition module** `apps/backend/src/lib/planState.ts` exporting `PLAN_STATES`, `INITIAL_PLAN_STATE`, and `confirmPlan(plan)`, which returns a new plan object with `estado: "confirmado"` or throws `InvalidTransitionError` when already confirmed. No Prisma or Express imports. The four required tests live in `planState.test.ts` and cover exactly: initial state, valid transition, invalid transition rejected, data preserved (`description`, `dueDate`, `userId`). *Alternative:* test through the HTTP route; rejected because it mixes layers and hides the rule.
2. **Dedicated endpoint** `POST /api/plans/:id/confirm` replaces `PATCH /api/plans/:id`. The body is empty, so an arbitrary state can never be sent. Route: auth → load via service → `404` if missing/not owned → `409` on `InvalidTransitionError` → `200` with the serialized plan. *Alternative:* keep `PATCH` with an enum of two values; rejected because it keeps a generic "set any state" surface and does not match the "Confirmar plan" action.
3. **Service owns persistence.** `PlansStore.updateStatus` becomes `confirm(userId, planId)`, which reads the owned plan, applies `confirmPlan`, and persists only `estado`. Race: use `updateMany` with `where: { id, userId, estado: "borrador" }` so a concurrent double confirm cannot both succeed; zero rows then resolves to `404` or `409` by re-reading.
4. **Initial state is server-forced.** `planSchema` drops `estado`; the store always writes `INITIAL_PLAN_STATE`. Unknown keys sent by clients are ignored.
5. **Migration.** New Prisma migration: map `hecho → confirmado`, `pendiente|retrasado → borrador`, and set the column default to `borrador`. The enum stays a `String` column validated by Zod (consistent with the existing schema) to avoid a heavier enum migration. Seeders must create plans in valid states only.
6. **Frontend contract.** `PlanStatus = "borrador" | "confirmado"`; `api.confirmPlan(id)` replaces `updatePlanStatus`; `usePlans.confirmPlan(id)` updates local state from the server response. `PlanForm` stops sending `estado`.
7. **Card UI.** `PlanCard` shows a `Badge` for state (muted "Borrador" / success "Confirmado" with a check icon) next to the existing due-date badge, and a primary "Confirmar plan" button only for drafts. Confirmation and deletion use Radix `AlertDialog` (from `radix-ui`) with a shared presentational `ConfirmDialog` component; the ⋮ menu uses Radix `DropdownMenu` (keyboard support, Escape, focus return built in). Components stay presentational; pages/hooks own the calls. *Alternative:* hand-rolled menu; rejected for accessibility cost.
8. **Navbar.** One `Link` wrapping `Logo` (mark + name) to `/mis-planes`; remove the `NavLink`. Active-route underline is dropped since the app has a single authenticated destination.
9. **Gradient/animation cleanup.** Primary `Button` variant becomes `bg-primary` with `hover:bg-primary/90`; icon tiles in `AuthDialog`/`PlanDialog` use `bg-primary`; landing headline uses `text-primary`; `bg-mesh` surfaces become `bg-background`; `Logo` uses a solid fill; remove blur halos and `animate-float` plus its keyframes; delete the `bg-brand-gradient`, `text-brand-gradient`, `bg-mesh` utilities and the `coral`, `popover`, `brand-*` tokens. Update `DESIGN.md` accordingly. Existing component tests asserting those classes are updated.
10. **Docs.** `README.md` gets a short "Pruebas del estado del plan" section with `pnpm --filter backend test planState`; `docs/task-02-state-tests.md` documents the rule, the four tests, and the command. `docs/project-card.md` stays untouched.

## Risks / Trade-offs

- **Breaking API/data change:** clients using the old `PATCH` or states break. Mitigation: only this repo's frontend consumes the API; migration maps existing data.
- **Stale pending changes:** six unarchived changes describe the old model. Mitigation: archive them first; this change's deltas use ADDED requirements with new names so they do not collide.
- **Visual regression from removing gradients:** accepted per `DESIGN.md`; verify contrast of solid `primary` buttons (white on `#0f766e` ≥ 4.5:1).
- **Hover underline of the active nav item is lost** with the single brand link; acceptable with one destination.
- **Test count:** the state-rule file has exactly four tests, while component/route tests updated for the new behavior each keep at least four, as AGENTS.md requires.
