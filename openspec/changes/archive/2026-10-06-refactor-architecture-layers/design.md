## Context

Ver `proposal.md` y `ARCHITECTURE.md`. La base de código actual tiene lógica de Prisma directamente en los controladores Express de `routes/` y componentes de frontend distribuidos bajo subcarpetas de Atomic Design (`atoms`, `molecules`, `organisms`, `templates`).

## Goals / Non-Goals

**Goals:**
- Separar de forma nítida la capa HTTP (`routes/`) de la lógica de acceso a datos y reglas de negocio (`services/`) en el backend.
- Reorganizar los componentes de frontend bajo una estructura simple y fácil de defender: `components/ui/` (primitivos base) y `components/domain/` (componentes con lógica y visual de negocio).
- Mantener compatibilidad 100% con los tests unitarios existentes en Vitest y sin alterar endpoints ni funcionalidad de la app.

**Non-Goals:**
- Cambiar la base de datos, el esquema de Prisma o los endpoints de la API.
- Modificar estilos visuales, tokens de diseño o la experiencia de usuario.
- Introducir frameworks o librerías adicionales.

## Decisions

### 1. Servicios dedicados en Backend (`services/`)
- **Decisión:** Crear `services/plans.service.ts` y `services/auth.service.ts`. Las rutas en `routes/` reciben la petición, validan con schemas de Zod en `lib/schemas.ts`, llaman al servicio y retornan la respuesta HTTP.
- **Alternativa descartada:** Mantener funciones de Prisma dentro de los routers. Se descarta porque acopla Express a la base de datos y dificulta testear la lógica sin levantar Express.

### 2. Estructura simplificada de componentes en Frontend
- **Decisión:** Agrupar componentes visuales en:
  - `components/ui/`: Primitivos base sin reglas de negocio (Botones, Dialog, Inputs).
  - `components/domain/`: Componentes específicos del dominio de la aplicación (`PlanCard`, `PlanForm`, `PlanList`, `Navbar`, `AppShell`, `StatCard`, `Notices`, etc.).
- **Alternativa descartada:** Mantener 5 carpetas de Atomic Design (`atoms/`, `molecules/`, `organisms/`, `templates/`, `ui/`). Se descarta porque en una defensa genera dudas de categorización ("¿por qué esto es molécula y no organismo?") y complejiza la navegación.

### 3. Co-ubicación estricta de tests unitarios
- **Decisión:** Los tests se ubican junto al archivo fuente (`*.test.ts` / `*.test.tsx`). Si un componente se mueve a `components/domain/`, su archivo de prueba se mueve con él.
- **Alternativa descartada:** Crear una carpeta raíz `/tests`. Se descarta porque duplica el árbol de directorios y va contra `ARCHITECTURE.md`.

## Risks / Trade-offs

- **[Riesgo] Rutas de importación rotas tras mover componentes en frontend** ➔ **Mitigación:** Actualizar imports de forma sistemática y validar ejecutando la suite completa de tests de frontend (`pnpm --filter frontend test`).
- **[Riesgo] Desacople de contratos en backend** ➔ **Mitigación:** Mantener las mismas interfaces TypeScript (`PlansStore`, `StoredPlan`) y verificar con `pnpm --filter backend test`.
