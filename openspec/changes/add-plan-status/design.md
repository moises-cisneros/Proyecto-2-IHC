## Context

Plans currently contain `id`, `description`, `dueDate`, `userId`, and `createdAt`. Users need to distinguish between completed, delayed, and pending plans with clear visual cues.

## Design Decisions

### 1. Database Model & Migration
In `apps/backend/prisma/schema.prisma`:
```prisma
model Plan {
  id          String   @id @default(uuid())
  description String
  dueDate     DateTime @db.Date
  estado      String   @default("pendiente")
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@index([userId, dueDate])
}
```
We use a Prisma migration:
`ALTER TABLE "Plan" ADD COLUMN "estado" TEXT NOT NULL DEFAULT 'pendiente';`

### 2. Backend Validation & Serializer
In `apps/backend/src/lib/schemas.ts`:
- Define `const planStatusSchema = z.enum(["hecho", "retrasado", "pendiente"]).default("pendiente");`
- Extend `planSchema`:
  ```typescript
  export const planSchema = z.object({
    description: z.string().trim().min(1, "Ingresa una descripción.").max(500, "Máximo 500 caracteres."),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha válida.").refine(...),
    estado: planStatusSchema.optional().default("pendiente"),
  });
  ```
In `apps/backend/src/routes/plans.ts`:
- `StoredPlan`: add `estado: string`.
- `createPrismaPlansStore`: pass `estado: data.estado ?? "pendiente"`.
- `serialize`: return `estado: plan.estado`.

### 3. Frontend Types & UI
In `apps/frontend/src/api/client.ts`:
- Update `Plan` interface: `estado: "hecho" | "retrasado" | "pendiente" | string`.
- Update `PlanInput`: `estado?: string`.

In `apps/frontend/src/components/molecules/PlanCard.tsx`:
- Render status badge with text and semantic colors:
  - `"hecho"`: green badge (`bg-emerald-100 text-emerald-800 border-emerald-300` / green token)
  - `"retrasado"`: red badge (`bg-rose-100 text-rose-800 border-rose-300` / error token)
  - `"pendiente"`: blue badge (`bg-sky-100 text-sky-800 border-sky-300` / primary/info token)

In `apps/frontend/src/components/molecules/PlanForm.tsx`:
- Add a select/dropdown field for `Estado` with options:
  - `pendiente` (Pendiente) - default
  - `hecho` (Hecho)
  - `retrasado` (Retrasado)

### 4. Verification and Testing
- Backend unit tests (Vitest):
  - Validates `estado` values (`hecho`, `retrasado`, `pendiente`).
  - Rejects unknown status values with 400 error.
  - Defaults to `pendiente` when omitted.
  - Serializes `estado` in API response.
- Frontend unit tests (Vitest):
  - Renders "hecho" badge with green styling.
  - Renders "retrasado" badge with red styling.
  - Renders "pendiente" badge with blue styling.
  - Allows selecting status in `PlanForm` and submits correct payload.
