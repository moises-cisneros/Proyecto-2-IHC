## Context

Plans currently display a status badge, but there is no mechanism to transition a plan from "pendiente" to "hecho" or "retrasado".

## Design Decisions

### 1. Backend Endpoint: `PATCH /api/plans/:id`
In `apps/backend/src/routes/plans.ts`:
- Extend `PlansStore`:
  ```typescript
  export interface PlansStore {
    list(userId: string): Promise<StoredPlan[]>;
    create(userId: string, data: PlanInput): Promise<StoredPlan>;
    updateStatus(userId: string, planId: string, estado: PlanStatus): Promise<StoredPlan | null>;
  }
  ```
- Implement in `createPrismaPlansStore`:
  ```typescript
  updateStatus: async (userId, planId, estado) => {
    const existing = await prisma.plan.findFirst({ where: { id: planId, userId } });
    if (!existing) return null;
    return prisma.plan.update({
      where: { id: planId },
      data: { estado },
      select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
    });
  }
  ```
- Define `updateStatusSchema = z.object({ estado: z.enum(planStatusValues) })` in `schemas.ts`.
- Mount `router.patch("/:id", ...)`:
  - If schema validation fails -> `400`
  - If `store.updateStatus` returns `null` -> `404` with `{ message: "Plan no encontrado" }`
  - Otherwise -> `200` with `{ plan: serialize(updated) }`

### 2. Frontend Client & Hook
In `apps/frontend/src/api/client.ts`:
- Add `updatePlanStatus: (id: string, estado: PlanStatus) => patch<{ plan: Plan }>(`/plans/${id}`, { estado })`
In `apps/frontend/src/hooks/usePlans.ts`:
- Add `updatePlanStatus: (id: string, estado: PlanStatus) => Promise<{ ok: boolean; message?: string }>`
- Updates state optimistically or upon server response.

### 3. Frontend Interactive Selector on PlanCard
In `apps/frontend/src/components/molecules/PlanCard.tsx`:
- Render an accessible `<select>` styled seamlessly as the status pill badge.
- The select displays the current status and color styling (Green for "Hecho", Red for "Retrasado", Blue for "Pendiente").
- Changing the select triggers `onStatusChange(plan.id, newStatus)` which calls `updatePlanStatus`.
- Disables interaction while updating to prevent race conditions.

### 4. Verification and Testing
- Backend unit tests (Vitest):
  - Updates plan status from "pendiente" to "hecho" (200).
  - Updates plan status to "retrasado" (200).
  - Returns 400 on invalid status value.
  - Returns 404 when plan does not exist or belongs to another user.
- Frontend unit tests (Vitest):
  - Renders the interactive select with the current status and corresponding color style.
  - Changing the select option triggers the update callback with the new status.
  - Successfully updates styling when status changes.
