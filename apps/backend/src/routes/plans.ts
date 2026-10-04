import { Router, type NextFunction, type Request, type Response } from "express";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  fieldErrors,
  planSchema,
  updatePlanStatusSchema,
  type PlanInput,
  type PlanStatus,
} from "../lib/schemas.js";

export interface StoredPlan {
  id: string;
  description: string;
  dueDate: Date;
  estado: string;
  createdAt: Date;
}

export interface PlansStore {
  list(userId: string): Promise<StoredPlan[]>;
  /** The store generates the plan id. */
  create(userId: string, data: PlanInput): Promise<StoredPlan>;
  updateStatus(userId: string, planId: string, estado: PlanStatus): Promise<StoredPlan | null>;
}

export function createPrismaPlansStore(): PlansStore {
  return {
    list: (userId) =>
      prisma.plan.findMany({
        where: { userId },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      }),
    create: (userId, data) =>
      prisma.plan.create({
        data: {
          userId,
          description: data.description,
          dueDate: new Date(`${data.dueDate}T00:00:00.000Z`),
          estado: data.estado ?? "pendiente",
        },
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      }),
    updateStatus: async (userId, planId, estado) => {
      const existing = await prisma.plan.findFirst({
        where: { id: planId, userId },
        select: { id: true },
      });
      if (!existing) return null;
      return prisma.plan.update({
        where: { id: planId },
        data: { estado },
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      });
    },
  };
}

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
      const updated = await store.updateStatus(user.id, req.params.id, parsed.data.estado);
      if (!updated) {
        res.status(404).json({ message: "Plan no encontrado" });
        return;
      }
      res.status(200).json({ plan: serialize(updated) });
    }),
  );

  return router;
}
