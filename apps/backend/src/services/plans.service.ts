import { prisma } from "../lib/prisma.js";
import type { PlanInput, PlanStatus } from "../lib/schemas.js";

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
          estado: data.estado ?? "pendiente",
        },
        select: { id: true, description: true, dueDate: true, estado: true, createdAt: true },
      }),
    updateStatus: async (userId: string, planId: string, estado: PlanStatus) => {
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
