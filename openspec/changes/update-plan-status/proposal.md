## Why

Currently, plans display their status ("hecho", "retrasado", "pendiente") as a read-only badge. Users need the ability to update a plan's status dynamically from its card on the `/mis-planes` screen to reflect changing progress.

## What Changes

- Add a `PATCH /api/plans/:id` endpoint on the backend allowing authenticated users to update their plan's status (`estado`).
- Validate that the requested status is one of `"hecho"`, `"retrasado"`, or `"pendiente"`, returning `400` on invalid values and `404` if the plan does not exist or belongs to another user.
- Update `api/client.ts` with `updatePlanStatus(id: string, estado: PlanStatus)`.
- Update `usePlans` hook with `updatePlanStatus` to update the plan list reactively.
- Update `PlanCard` to make the status selector interactive (a stylish select dropdown pill keeping the color coding: green for "hecho", red for "retrasado", and blue for "pendiente") so selecting a new status immediately updates the plan.
- Add unit tests in Vitest for backend `PATCH /api/plans/:id` endpoint and frontend interactive status change.

## Capabilities

### Modified Capabilities
- `plans`: adds the capability to update a plan's `estado` via API and UI interaction.

## Impact

- Backend: `apps/backend/src/routes/plans.ts`, `apps/backend/src/lib/schemas.ts`, and test files.
- Frontend: `apps/frontend/src/api/client.ts`, `apps/frontend/src/hooks/usePlans.ts`, `apps/frontend/src/components/molecules/PlanCard.tsx`, `apps/frontend/src/components/organisms/PlanList.tsx`, `apps/frontend/src/pages/MyPlansPage.tsx`, and test files.
