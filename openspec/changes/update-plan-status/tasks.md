## 1. Backend: Update Status Route & Schema

- [ ] 1.1 Add `updatePlanStatusSchema` in `apps/backend/src/lib/schemas.ts` and test in `schemas.test.ts`
- [ ] 1.2 Implement `updateStatus` in `PlansStore` and Prisma store in `apps/backend/src/routes/plans.ts`
- [ ] 1.3 Add `PATCH /:id` endpoint to `createPlansRouter` in `apps/backend/src/routes/plans.ts`
- [ ] 1.4 Write unit tests in `apps/backend/src/routes/plans.test.ts` verifying `PATCH /api/plans/:id` (200 success, 400 invalid status, 404 not found/other user)

## 2. Frontend: API Client and Hook

- [ ] 2.1 Add `api.updatePlanStatus(id, estado)` in `apps/frontend/src/api/client.ts`
- [ ] 2.2 Add `updatePlanStatus` method in `apps/frontend/src/hooks/usePlans.ts` and verify with tests in `usePlans.test.tsx`

## 3. Frontend: Interactive Status Selector in PlanCard

- [ ] 3.1 Update `apps/frontend/src/components/molecules/PlanCard.tsx` to turn the badge into an interactive select element with immediate color updating
- [ ] 3.2 Wire `onStatusChange` through `PlanList.tsx` and `MyPlansPage.tsx`
- [ ] 3.3 Add unit tests in `apps/frontend/src/components/molecules/PlanCard.test.tsx` and `MyPlansPage.test.tsx` testing the status change interaction

## 4. Verification

- [ ] 4.1 Run Vitest tests on backend (`pnpm --filter backend test`) and confirm all pass
- [ ] 4.2 Run Vitest tests on frontend (`pnpm --filter frontend test`) and confirm all pass
- [ ] 4.3 Verify full monorepo typecheck and build (`pnpm build`)
