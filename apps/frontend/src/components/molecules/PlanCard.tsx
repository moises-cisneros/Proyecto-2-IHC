import type { Plan } from "../../api/client";
import { formatDueDate } from "../../lib/plans";

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className="rounded-base border border-border bg-card p-l">
      <p className="text-label tracking-wide text-text-muted">
        ID:{" "}
        <span title={plan.id} aria-label={`ID completo: ${plan.id}`} className="font-mono">
          {plan.id.slice(0, 8)}
        </span>
      </p>
      <p className="mt-xs break-words text-body">{plan.description}</p>
      <p className="mt-s text-label text-text-muted">
        Fecha límite: <time dateTime={plan.dueDate}>{formatDueDate(plan.dueDate)}</time>
      </p>
    </article>
  );
}
