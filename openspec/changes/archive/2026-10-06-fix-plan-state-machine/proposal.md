## Why

The plan lifecycle must be a formal two-state machine (`borrador` → `confirmado`) driven by an explicit "Confirmar plan" action, as required by Task 2 (vertical slice). The current model uses three free-form values (`pendiente`, `hecho`, `retrasado`) edited through a `<select>`, accepts arbitrary transitions, and mixes an overdue concept that is already derived from the due date. The surrounding UI also needs corrections: destructive actions are oversized and unconfirmed, the navbar brand and "Mis planes" read as one control, and decorative gradients contradict `apps/frontend/DESIGN.md`.

## What Changes

- **BREAKING**: plan `estado` values become `borrador` and `confirmado` only. New plans always start as `borrador`; clients can no longer choose the initial state. Existing rows are migrated (`hecho` → `confirmado`, `pendiente`/`retrasado` → `borrador`) and the column default becomes `borrador`.
- **BREAKING**: `PATCH /api/plans/:id` is replaced by a dedicated confirm transition. Confirming an already confirmed plan, or sending any unsupported state, is rejected with an error. Overdue status keeps being derived from the due date (`getDueStatus()`), never stored.
- Plan transition rules live in a pure, unit-testable domain function; the service applies it and persists the result. Description, due date, and owner are preserved by the transition.
- Plan card: remove the status `<select>` and the generic "Confirmar" button. Draft cards show a "Borrador" badge and an explicit "Confirmar plan" button that opens a confirmation dialog (the transition is irreversible). Confirmed cards show a "Confirmado" badge with a check and no action button.
- Plan card: replace the large "Eliminar" button with a three-dot (⋮) actions menu. Deleting asks for confirmation in a dialog that names the plan. No "Editar" entry is added (no edit capability exists and none is requested).
- Navbar: logo + brand name become a single link to `/mis-planes`; the duplicate "Mis planes" link is removed.
- Visual alignment with `apps/frontend/DESIGN.md`: remove gradients (`bg-brand-gradient`, `text-brand-gradient`, `bg-mesh`, the logo gradient, the blurred halos) and the infinite `animate-float` animation; retire unused tokens (`coral`, `popover`, `brand-start/mid/end`) from `tokens.css`/`index.css`, and keep `DESIGN.md` in sync.
- Exactly four Vitest unit tests for the state rule (initial state, valid transition, invalid transition rejected, data preserved), plus documentation in `README.md` and `docs/task-02-state-tests.md` including the test command.

## Capabilities

### New Capabilities
- `plan-state-machine`: two-state lifecycle (`borrador`/`confirmado`), initial state, confirm transition and its rejection rules, persistence across reloads, and the four required unit tests.

### Modified Capabilities
- `plans`: card presentation (status badge, "Confirmar plan" with confirmation dialog, ⋮ actions menu, delete confirmation) and API surface for confirm/delete.
- `app-navbar`: brand and "Mis planes" are a single link instead of two adjacent links to the same destination.
- `design-tokens`: no gradients or infinite decorative animations; unused tokens removed.

## Impact

- Backend: `apps/backend/prisma/schema.prisma` and a new migration; `src/lib/schemas.ts`, `src/services/plans.service.ts`, `src/routes/plans.ts`, and a new pure transition module with co-located tests; existing tests referencing the old values updated.
- Frontend: `src/api/client.ts`, `src/hooks/usePlans.ts`, `PlanCard`, `PlanList`, `PlanForm`, `MyPlansPage`, `Navbar`, `LandingScreen`, `AuthDialog`, `PlanDialog`, `AppShell`, `LoadingScreen`, `Logo`, `ui/button.tsx`, `tokens.css`, `index.css`, and `DESIGN.md`; new confirm dialog and actions menu components.
- Docs: `README.md`, `docs/task-02-state-tests.md` (new). `docs/project-card.md` is not touched.
- Earlier unarchived changes (`add-plan-status`, `update-plan-status`, `validate-confirm-plan-status`, `remove-plan-creation-status-selector`, `style-plan-action-buttons`, `add-plan-actions-confirm-delete`) describe the superseded three-value model; they should be archived before this change so main specs stay coherent.
- No new runtime dependencies are required if the actions menu is built on the existing dialog primitives; if a dropdown primitive is adopted it must be added with `pnpm --filter frontend add`.
