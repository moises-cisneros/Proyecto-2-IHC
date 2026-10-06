import { Router, type NextFunction, type Request, type Response } from "express";
import type { User } from "@prisma/client";
import {
  fieldErrors,
  planSchema,
  updatePlanStatusSchema,
} from "../lib/schemas.js";
import {
  type StoredPlan,
  type PlansStore,
  createPrismaPlansStore,
} from "../services/plans.service.js";

export { type StoredPlan, type PlansStore, createPrismaPlansStore };

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

function serialize(plan: StoredPlan) {
  return {
    id: plan.id,
    description: plan.description,
    dueDate: toDateString(plan.dueDate),
    estado: plan.estado,
    createdAt: plan.createdAt.toISOString(),
  };
}

function comparePlans(a: StoredPlan, b: StoredPlan): number {
  return (
    a.dueDate.getTime() - b.dueDate.getTime() || a.createdAt.getTime() - b.createdAt.getTime()
  );
}

type Handler = (req: Request, res: Response) => Promise<void>;
const wrap = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res).catch(next);
};

export function createPlansRouter(store: PlansStore): Router {
  const router = Router();

  router.get(
    "/",
    wrap(async (_req, res) => {
      const user = res.locals.user as User;
      const plans = (await store.list(user.id)).slice().sort(comparePlans);
      res.status(200).json({ plans: plans.map(serialize) });
    }),
  );

  router.post(
    "/",
    wrap(async (req, res) => {
      const user = res.locals.user as User;
      const parsed = planSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ message: "Datos inválidos", errors: fieldErrors(parsed.error) });
        return;
      }
      const plan = await store.create(user.id, parsed.data);
      res.status(201).json({ plan: serialize(plan) });
    }),
  );

  router.patch(
    "/:id",
    wrap(async (req, res) => {
      const user = res.locals.user as User;
      const parsed = updatePlanStatusSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ message: "Datos inválidos", errors: fieldErrors(parsed.error) });
        return;
      }
      const planId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await store.updateStatus(user.id, planId, parsed.data.estado);
      if (!updated) {
        res.status(404).json({ message: "Plan no encontrado" });
        return;
      }
      res.status(200).json({ plan: serialize(updated) });
    }),
  );

  router.delete(
    "/:id",
    wrap(async (req, res) => {
      const user = res.locals.user as User;
      const planId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await store.delete(user.id, planId);
      if (!deleted) {
        res.status(404).json({ message: "Plan no encontrado" });
        return;
      }
      res.status(200).json({ message: "Plan eliminado" });
    }),
  );

  return router;
}
