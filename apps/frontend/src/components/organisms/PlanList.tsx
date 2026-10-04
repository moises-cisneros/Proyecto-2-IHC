import type { Plan, PlanStatus } from "../../api/client";
import { PlanCard } from "../molecules/PlanCard";

interface PlanListProps {
  plans: Plan[];
  onStatusChange?: (id: string, estado: PlanStatus) => void;
}

export function PlanList({ plans, onStatusChange }: PlanListProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-base border border-border bg-card p-xl">
        <p className="text-body text-text-muted">
          Todavía no tienes planes. Pulsa &ldquo;Nuevo plan&rdquo; para crear el primero.
        </p>
      </div>
    );
  }
  return (
    <ul className="m-0 flex list-none flex-col gap-m p-0">
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard plan={plan} onStatusChange={onStatusChange} />
        </li>
      ))}
    </ul>
  );
}
