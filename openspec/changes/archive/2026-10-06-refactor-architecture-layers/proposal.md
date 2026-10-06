## Why

Alinear el código existente del backend y frontend con los estándares y responsabilidades establecidos en `ARCHITECTURE.md` y `AGENTS.md`. Actualmente, la lógica de base de datos se encuentra incrustada en los archivos de rutas de Express (`routes/plans.ts`, `routes/auth.ts`), y los componentes de frontend se encuentran dispersos en subcarpetas de diseño atómico poco prácticas para una defensa académica, en lugar de una separación clara entre componentes base (`ui/`) y de dominio (`domain/`).

## What Changes

- **Backend:**
  - Extraer el acceso a datos y reglas de negocio de `routes/plans.ts` hacia `services/plans.service.ts`.
  - Extraer las consultas directas de Prisma y lógica de hashing/sesión de `routes/auth.ts` hacia `services/auth.service.ts`.
  - Mantener `routes/` exclusivamente enfocado en enrutamiento HTTP y validación con Zod.
- **Frontend:**
  - Reorganizar componentes de interfaz agrupándolos en `components/ui/` (primitivos base) y `components/domain/` (tarjetas, formularios, listas y navbar de la aplicación).
  - Actualizar todas las importaciones relativas correspondientes en `pages/`, `hooks/` y suites de prueba.
  - Asegurar que todas las pruebas unitarias existentes (35 de backend y 41 de frontend) continúen pasando sin regresiones.

## Capabilities

### New Capabilities
<!-- None: Pure structural refactor -->

### Modified Capabilities
<!-- None: Pure structural refactor (skip_specs: true) -->

## Impact

- `apps/backend/src/routes/` y nueva carpeta `apps/backend/src/services/`.
- `apps/frontend/src/components/`.
- Importaciones en `pages/`, `auth/` y tests unitarios.
- Sin cambios en la API pública HTTP ni en el comportamiento visible de la interfaz.
