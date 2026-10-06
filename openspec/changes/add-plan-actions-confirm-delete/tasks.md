## 1. Backend: DELETE /api/plans/:id

- [x] 1.1 Add `delete(userId: string, planId: string): Promise<boolean>` to `PlansStore` and Prisma store in `apps/backend/src/routes/plans.ts`
- [x] 1.2 Implement `DELETE /:id` endpoint in `createPlansRouter` in `apps/backend/src/routes/plans.ts`
- [x] 1.3 Add 4 unit tests in `apps/backend/src/routes/plans.test.ts` for DELETE endpoint (success 200, non-existent 404, other user's plan 404, unauthenticated 401)

## 2. Frontend: API Client & usePlans Hook

- [x] 2.1 Add `deletePlan(id: string)` to `apps/frontend/src/api/client.ts`
- [x] 2.2 Add `deletePlan` method in `apps/frontend/src/hooks/usePlans.ts` and test in `usePlans.test.tsx`

## 3. Frontend: Action Buttons in PlanCard

- [x] 3.1 Update `apps/frontend/src/components/molecules/PlanCard.tsx` with "Confirmar" and "Eliminar" action buttons
- [x] 3.2 Wire `onDelete` through `PlanList.tsx` and `MyPlansPage.tsx`
- [x] 3.3 Add unit tests in `apps/frontend/src/components/molecules/PlanCard.test.tsx` for "Confirmar" and "Eliminar" buttons

## 4. Verification

- [x] 4.1 Run Vitest backend tests (`pnpm --filter backend test`)
- [x] 4.2 Run Vitest frontend tests (`pnpm --filter frontend test`)
- [x] 4.3 Verify full monorepo build (`pnpm build`)
