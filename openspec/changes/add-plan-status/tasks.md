## 1. Backend: Schema and Migration

- [x] 1.1 Update `apps/backend/prisma/schema.prisma` adding `estado String @default("pendiente")` to `Plan`
- [x] 1.2 Generate Prisma migration `add_plan_status` in `apps/backend/prisma/migrations`
- [x] 1.3 Add backend schema unit tests in `apps/backend/src/lib/schemas.test.ts` for `estado` validation (accepting "hecho", "retrasado", "pendiente", defaulting to "pendiente", rejecting invalid values)
- [x] 1.4 Update `apps/backend/src/lib/schemas.ts` and `apps/backend/src/routes/plans.ts` to validate, store, and serialize `estado`
- [x] 1.5 Update `apps/backend/src/routes/plans.test.ts` to test `estado` in API responses

## 2. Frontend: Client Types and Form

- [x] 2.1 Update `Plan` and `PlanInput` types in `apps/frontend/src/api/client.ts` to include `estado`
- [x] 2.2 Update `apps/frontend/src/components/molecules/PlanForm.tsx` to include an `Estado` select field with options "Pendiente", "Hecho", "Retrasado" defaulting to "pendiente"
- [x] 2.3 Update `apps/frontend/src/components/molecules/PlanForm.test.tsx` to verify status selection and submission

## 3. Frontend: PlanCard Badge Display

- [x] 3.1 Update `apps/frontend/src/components/molecules/PlanCard.tsx` to display the status badge with designated colors: green for "hecho", red for "retrasado", and blue for "pendiente"
- [x] 3.2 Write 4 unit tests in `apps/frontend/src/components/molecules/PlanCard.test.tsx` verifying badge text, accessibility, and color styling for all 3 states

## 4. Verification

- [x] 4.1 Run Vitest tests on backend (`pnpm --filter backend test`) and confirm all pass
- [x] 4.2 Run Vitest tests on frontend (`pnpm --filter frontend test`) and confirm all pass
- [x] 4.3 Verify full monorepo typecheck and build (`pnpm build`)
