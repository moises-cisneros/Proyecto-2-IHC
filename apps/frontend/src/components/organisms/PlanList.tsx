import type { Plan } from "../../api/client";
import { PlanCard } from "../molecules/PlanCard";

export function PlanList({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) {
    return (
      <div className="rounded-base border border-border bg-card p-xl">
        <p className="text-body text-text-muted">
          Todavía no tienes planes. Pulsa “Nuevo plan” para crear el primero.
        </p>
      </div>
    );
  }
  return (
    <ul className="m-0 flex list-none flex-col gap-m p-0">
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard plan={plan} />
        </li>
      ))}
    </ul>
  );
}
