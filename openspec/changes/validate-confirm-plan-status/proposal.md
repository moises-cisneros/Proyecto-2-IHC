# Proposal: Validate Plan Confirmation and Disable Button When Already "Hecho"

## Why

If a plan has already been completed (`estado === "hecho"`), clicking "Confirmar" should be prevented.
The UI should:
1. Disable the "Confirmar" button whenever a plan's status is "hecho", and enable it for any other status ("pendiente", "retrasado").
2. Validate that if "Confirmar" is triggered on a plan that is already in "hecho" status, the screen displays the error message: `"Esta acción ya fue confirmada."`.

## What Changes

- In `PlanCard.tsx`:
  - Set `disabled={statusKey === "hecho"}` on the "Confirmar" button.
  - When status is not "hecho" ("pendiente" or "retrasado"), the button remains enabled.
- In `MyPlansPage.tsx`:
  - Add state `actionError: string | null` to track action-level errors.
  - In the status change / confirm handler, validate if the targeted plan already has `estado === "hecho"`:
    - If so, set `actionError` to `"Esta acción ya fue confirmada."` and do not submit redundant update requests.
    - If not, clear `actionError` and proceed with `updatePlanStatus`.
  - Render `<ErrorAlert message={actionError} />` on the screen.

## Capabilities

### Modified Capabilities
- `plans`: disables the "Confirmar" button when a plan is already "hecho" and displays `"Esta acción ya fue confirmada."` if triggered.

## Impact

- Frontend: `apps/frontend/src/components/molecules/PlanCard.tsx`, `apps/frontend/src/pages/MyPlansPage.tsx`.
