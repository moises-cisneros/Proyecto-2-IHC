-- Plan state machine: hecho -> confirmado; pendiente/retrasado -> borrador
UPDATE "Plan" SET "estado" = 'confirmado' WHERE "estado" = 'hecho';
UPDATE "Plan" SET "estado" = 'borrador' WHERE "estado" IN ('pendiente', 'retrasado');

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "estado" SET DEFAULT 'borrador';
