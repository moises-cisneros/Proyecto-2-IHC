import { prisma } from "../lib/prisma.js";
import { INITIAL_PLAN_STATE, confirmPlan } from "../lib/planState.js";
import type { PlanInput } from "../lib/schemas.js";

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
  /**
   * Moves an owned draft to `confirmado`. Resolves `null` when the plan does not
   * exist or is not owned; rejects with `InvalidTransitionError` when it is already confirmed.
   */
  confirm(userId: string, planId: string): Promise<StoredPlan | null>;
  delete(userId: string, planId: string): Promise<boolean>;
}

export function createPrismaPlansStore(): PlansStore {
  return {
    list: (userId: string) =>
      prisma.plan.findMany({
        where: { userId },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      }),
    create: (userId: string, data: PlanInput) =>
      prisma.plan.create({
        data: {
          userId,
          description: data.description,
          dueDate: new Date(`${data.dueDate}T00:00:00.000Z`),
          estado: INITIAL_PLAN_STATE,
        },
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      }),
    confirm: async (userId: string, planId: string) => {
      const select = {
        id: true,
        description: true,
        dueDate: true,
        estado: true,
        createdAt: true,
      } as const;
      const existing = await prisma.plan.findFirst({ where: { id: planId, userId }, select });
      if (!existing) return null;
      const next = confirmPlan(existing);
      // Guarded write: a concurrent confirm cannot succeed twice.
      const result = await prisma.plan.updateMany({
        where: { id: planId, userId, estado: existing.estado },
        data: { estado: next.estado },
      });
      if (result.count === 0) {
        const current = await prisma.plan.findFirst({ where: { id: planId, userId }, select });
        if (!current) return null;
        return confirmPlan(current);
      }
      return next;
    },
    delete: async (userId: string, planId: string) => {
      const result = await prisma.plan.deleteMany({
        where: { id: planId, userId },
      });
      return result.count > 0;
    },
  };
}
