# Proposal: Remove status selector on plan creation and default to "pendiente"

## Why

Currently, when creating a new plan via `PlanForm`, users can choose between "pendiente", "hecho", and "retrasado". However, business requirements dictate that all newly created plans must start in the "pendiente" (pending) status by default and users should not select the status at creation time. Once created, users can change the status directly from the plan card in the plan list.

## What Changes

- Remove the `Estado` select dropdown from `PlanForm.tsx`.
- Ensure `PlanForm` submits `estado: "pendiente"` (or omits it if the backend sets default "pendiente").
- Update `PlanForm.test.tsx` to verify that `Estado` field is no longer present in the creation form, and that submitting always sets `estado: "pendiente"`.
- Ensure all other existing tests (MyPlansPage, usePlans, etc.) continue to pass.

## Capabilities

### Modified Capabilities
- `plans`: creation form no longer asks for status; initial status is automatically "pendiente".

## Impact

- Frontend: `apps/frontend/src/components/molecules/PlanForm.tsx`, `apps/frontend/src/components/molecules/PlanForm.test.tsx`.
