# Proposal: Add Delete and Confirm Action Buttons to Plans

## Why

Users need convenient, direct actions on their plan cards in `/mis-planes`:
1. **Eliminar (Delete)**: Permanently remove a plan that is no longer needed.
2. **Confirmar (Confirm)**: Mark a plan as completed ("hecho") with a single click without having to toggle through the status dropdown.

## What Changes

### Backend
- Add `delete(userId: string, planId: string): Promise<boolean>` to `PlansStore` interface and `createPrismaPlansStore`.
- Add `DELETE /api/plans/:id` endpoint to `createPlansRouter`.
  - Returns `200` with `{ message: "Plan eliminado" }` (or `204 No Content`) on success.
  - Returns `404` with `{ message: "Plan no encontrado" }` if plan does not exist or belongs to another user.
  - Returns `401` if unauthenticated.
- Add unit tests for `DELETE /api/plans/:id` in `apps/backend/src/routes/plans.test.ts`.

### Frontend
- Add `api.deletePlan(id: string)` in `apps/frontend/src/api/client.ts`.
- Add `deletePlan(id: string)` in `usePlans.ts` hook which removes the plan from local state upon successful deletion.
- Add "Confirmar" and "Eliminar" buttons to `PlanCard.tsx`:
  - "Confirmar": updates plan status to `"hecho"`.
  - "Eliminar": triggers plan deletion.
- Forward `onDelete` through `PlanList.tsx` and wire with `deletePlan` in `MyPlansPage.tsx`.
- Add unit tests for buttons in `PlanCard.test.tsx`, `usePlans.test.tsx`, and `MyPlansPage.test.tsx`.

## Capabilities

### Modified Capabilities
- `plans`: adds plan deletion via API and adds "Eliminar" and "Confirmar" buttons to the UI.

## Impact

- Backend: `apps/backend/src/routes/plans.ts`, `apps/backend/src/routes/plans.test.ts`.
- Frontend: `apps/frontend/src/api/client.ts`, `apps/frontend/src/hooks/usePlans.ts`, `apps/frontend/src/components/molecules/PlanCard.tsx`, `apps/frontend/src/components/organisms/PlanList.tsx`, `apps/frontend/src/pages/MyPlansPage.tsx`, and test files.
