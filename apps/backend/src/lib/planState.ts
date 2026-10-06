/** Pure plan state machine: no Prisma or Express imports. */
export const PLAN_STATES = ["borrador", "confirmado"] as const;
export type PlanState = (typeof PLAN_STATES)[number];

export const INITIAL_PLAN_STATE: PlanState = "borrador";

export class InvalidTransitionError extends Error {
  constructor(
    public readonly from: PlanState,
    public readonly to: PlanState,
  ) {
    super(`Invalid plan transition: ${from} -> ${to}`);
    this.name = "InvalidTransitionError";
  }
}

/** Returns a new plan in `confirmado`; only a `borrador` plan can be confirmed. */
export function confirmPlan<T extends { estado: string }>(plan: T): T & { estado: "confirmado" } {
  if (plan.estado !== "borrador") {
    throw new InvalidTransitionError(plan.estado as PlanState, "confirmado");
  }
  return { ...plan, estado: "confirmado" };
}
