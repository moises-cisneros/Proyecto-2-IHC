## 1. Frontend: Implementation

- [x] 1.1 Disable "Confirmar" button in `PlanCard.tsx` when `statusKey === "hecho"` and enable otherwise
- [x] 1.2 Add `actionError` state and validation in `MyPlansPage.tsx` to display `"Esta acción ya fue confirmada."` when confirmation is triggered on a plan already "hecho"

## 2. Verification

- [x] 2.1 Run Vitest tests (`pnpm --filter frontend test`)
- [x] 2.2 Run monorepo build (`pnpm build`)
