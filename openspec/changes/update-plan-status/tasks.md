## 1. Backend: Update Status Route & Schema

- [x] 1.1 Add `updatePlanStatusSchema` in `apps/backend/src/lib/schemas.ts` and test in `schemas.test.ts`
- [x] 1.2 Implement `updateStatus` in `PlansStore` and Prisma store in `apps/backend/src/routes/plans.ts`
- [x] 1.3 Add `PATCH /:id` endpoint to `createPlansRouter` in `apps/backend/src/routes/plans.ts`
- [x] 1.4 Write unit tests in `apps/backend/src/routes/plans.test.ts` verifying `PATCH /api/plans/:id` (200 success, 400 invalid status, 404 not found/other user)

## 2. Frontend: API Client and Hook

- [x] 2.1 Add `api.updatePlanStatus(id, estado)` in `apps/frontend/src/api/client.ts`
- [x] 2.2 Add `updatePlanStatus` method in `apps/frontend/src/hooks/usePlans.ts` and verify with tests in `usePlans.test.tsx`

## 3. Frontend: Interactive Status Selector in PlanCard

- [x] 3.1 Update `apps/frontend/src/components/molecules/PlanCard.tsx` to turn the badge into an interactive select element with immediate color updating
- [x] 3.2 Wire `onStatusChange` through `PlanList.tsx` and `MyPlansPage.tsx`
- [x] 3.3 Add unit tests in `apps/frontend/src/components/molecules/PlanCard.test.tsx` and `MyPlansPage.test.tsx` testing the status change interaction

## 4. Verification

- [x] 4.1 Run Vitest tests on backend (`pnpm --filter backend test`) and confirm all pass
- [x] 4.2 Run Vitest tests on frontend (`pnpm --filter frontend test`) and confirm all pass
- [x] 4.3 Verify full monorepo typecheck and build (`pnpm build`)
