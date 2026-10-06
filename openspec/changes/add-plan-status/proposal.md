## Why

Users need to see and track the state of their plans on `/mis-planes`. Adding an `estado` attribute to plans enables categorization into three distinct states ("hecho", "retrasado", "pendiente") with immediate visual feedback via color-coded badges (green, red, and blue).

## What Changes

- Add an `estado` field (type `String`, default `"pendiente"`) to the `Plan` model in `schema.prisma`.
- Generate and apply a new Prisma database migration for `estado`.
- Validate `estado` on the backend using Zod (`"hecho"`, `"retrasado"`, `"pendiente"`), defaulting to `"pendiente"` if not provided.
- Update `GET /api/plans` and `POST /api/plans` to handle and serialize `estado`.
- Update frontend `Plan` type in `api/client.ts`.
- Update `PlanCard` to render a status badge with text and the required color scheme:
  - `"hecho"`: green (verde)
  - `"retrasado"`: red (rojo)
  - `"pendiente"`: blue (azul)
- Allow selecting the `estado` in `PlanForm` (or default to `"pendiente"`).
- Write at least 4 unit tests in Vitest for backend validation/routes and 4 unit tests for frontend card rendering.

## Capabilities

### Modified Capabilities
- `plans`: adds the `estado` attribute with allowed values `"hecho"`, `"retrasado"`, `"pendiente"`, server-side validation, and color-coded badge presentation on each plan card.

## Impact

- Database: New Prisma migration in `apps/backend/prisma/migrations` adding `estado` column with default `'pendiente'`.
- Backend: `apps/backend/prisma/schema.prisma`, `apps/backend/src/lib/schemas.ts`, `apps/backend/src/routes/plans.ts`, and test files.
- Frontend: `apps/frontend/src/api/client.ts`, `apps/frontend/src/components/molecules/PlanCard.tsx`, `apps/frontend/src/components/molecules/PlanForm.tsx`, and test files.
