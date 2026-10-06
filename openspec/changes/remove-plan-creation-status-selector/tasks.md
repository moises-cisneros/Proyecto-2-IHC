## 1. Frontend: PlanForm Updates

- [x] 1.1 Remove `Estado` select element and state from `apps/frontend/src/components/molecules/PlanForm.tsx`, fixing default to `"pendiente"`
- [x] 1.2 Update unit tests in `apps/frontend/src/components/molecules/PlanForm.test.tsx` verifying no `Estado` selector and default `"pendiente"` payload

## 2. Verification

- [x] 2.1 Run Vitest tests on frontend (`pnpm --filter frontend test`)
- [x] 2.2 Verify full monorepo typecheck and build (`pnpm build`)
