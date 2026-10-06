## 1. Backend Layering Refactor

- [x] 1.1 Crear `apps/backend/src/services/plans.service.ts` y mover la lógica de persistencia `PlansStore` y `createPrismaPlansStore` desde `routes/plans.ts`
- [x] 1.2 Actualizar `apps/backend/src/routes/plans.ts` y `apps/backend/src/app.ts` para consumir el servicio de planes
- [x] 1.3 Crear `apps/backend/src/services/auth.service.ts` con funciones para registro, login y reseteo de contraseñas desacopladas de Express
- [x] 1.4 Actualizar `apps/backend/src/routes/auth.ts` para delegar la persistencia a `auth.service.ts`
- [x] 1.5 Verificar que todos los tests unitarios de backend sigan pasando con `pnpm --filter backend test`

## 2. Frontend Components Reorganization

- [x] 2.1 Crear `apps/frontend/src/components/domain/` y reubicar componentes de negocio (`PlanCard`, `PlanForm`, `PlanList`, `Navbar`, `AppShell`, `StatCard`, `Notices`, `ProfileMenu`, `AuthDialog`)
- [x] 2.2 Limpiar carpetas redundantes de Atomic Design (`atoms/`, `molecules/`, `organisms/`, `templates/`) preservando `ui/` para primitivos
- [x] 2.3 Actualizar rutas de importación en `pages/`, `hooks/`, `auth/` y suites de test
- [x] 2.4 Verificar que todos los tests unitarios de frontend sigan pasando con `pnpm --filter frontend test`

## 3. Final Verification

- [x] 3.1 Ejecutar suite de pruebas completa en todo el monorepo

- [x] 3.2 Verificar compilación TypeScript sin errores en backend y frontend
