# Design: Add Delete and Confirm Action Buttons to Plans

## Architecture Decisions

### 1. Backend Deletion
- In `apps/backend/src/routes/plans.ts`:
  - Extend `PlansStore`: `delete(userId: string, planId: string): Promise<boolean>`
  - Implement in Prisma store using `prisma.plan.deleteMany({ where: { id: planId, userId } })`. If `count === 0`, return `false`, else return `true`.
  - Add router handler for `DELETE /:id`:
    ```ts
    router.delete("/:id", wrap(async (req, res) => {
      const user = res.locals.user as User;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await store.delete(user.id, id);
      if (!deleted) {
        res.status(404).json({ message: "Plan no encontrado" });
        return;
      }
      res.status(200).json({ message: "Plan eliminado" });
    }));
    ```

### 2. Frontend API & usePlans Hook
- In `apps/frontend/src/api/client.ts`:
  - Add `del` helper or support DELETE in `request`.
  - Add `deletePlan(id: string) => request<{ message: string }>(`/plans/${id}`, { method: "DELETE" })`.
- In `apps/frontend/src/hooks/usePlans.ts`:
  - Add `deletePlan(id: string)`: calls `api.deletePlan(id)` and if successful filters out the deleted plan from `plans` state.

### 3. PlanCard UI
- In `apps/frontend/src/components/molecules/PlanCard.tsx`:
  - Add action buttons container at the bottom:
    - Button "Confirmar": calls `onStatusChange?.(plan.id, "hecho")`. Disabled if `plan.estado === "hecho"`.
    - Button "Eliminar": calls `onDelete?.(plan.id)`.
  - Update `PlanList.tsx` and `MyPlansPage.tsx` to pass `onDelete={deletePlan}` down to `PlanCard`.

### 4. Vitest Unit Testing (Rule 8: Minimum 4 unit tests per feature)
- Backend:
  - 4 tests for `DELETE /api/plans/:id`: (1) delete existing plan returns 200, (2) delete non-existent returns 404, (3) delete other user's plan returns 404, (4) unauthenticated returns 401.
- Frontend:
  - Tests in `usePlans.test.tsx` for `deletePlan`.
  - Tests in `PlanCard.test.tsx`:
    - Click "Confirmar" calls `onStatusChange` with "hecho".
    - Click "Eliminar" calls `onDelete` with plan id.
    - Confirm button is disabled when status is already "hecho".
    - Renders both buttons with proper text and roles.
