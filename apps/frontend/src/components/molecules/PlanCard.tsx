import type { Plan, PlanStatus } from "../../api/client";
import { formatDueDate } from "../../lib/plans";

interface StatusConfig {
  label: string;
  className: string;
  style: { backgroundColor: string; color: string; borderColor: string };
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  hecho: {
    label: "Hecho",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    style: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#86efac",
    },
  },
  retrasado: {
    label: "Retrasado",
    className: "bg-rose-100 text-rose-800 border-rose-300",
    style: {
      backgroundColor: "#ffe4e6",
      color: "#9f1239",
      borderColor: "#fca5a5",
    },
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-sky-100 text-sky-800 border-sky-300",
    style: {
      backgroundColor: "#e0f2fe",
      color: "#075985",
      borderColor: "#7dd3fc",
    },
  },
};

const STATUS_KEYS: PlanStatus[] = ["pendiente", "hecho", "retrasado"];

interface PlanCardProps {
  plan: Plan;
  onStatusChange?: (id: string, estado: PlanStatus) => void;
}

export function PlanCard({ plan, onStatusChange }: PlanCardProps) {
  const statusKey = plan.estado?.toLowerCase() ?? "pendiente";
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pendiente;

  return (
    <article className="rounded-base border border-border bg-card p-l">
      <div className="flex items-center justify-between gap-s">
        <p className="text-label tracking-wide text-text-muted">
          ID:{" "}
          <span title={plan.id} aria-label={`ID completo: ${plan.id}`} className="font-mono">
            {plan.id.slice(0, 8)}
          </span>
        </p>
        <select
          data-testid="plan-status-badge"
          data-status={statusKey}
          aria-label={`Estado: ${status.label}`}
          value={statusKey}
          onChange={(e) => onStatusChange?.(plan.id, e.target.value as PlanStatus)}
          style={{
            ...status.style,
            cursor: onStatusChange ? "pointer" : "default",
            appearance: "none",
            WebkitAppearance: "none",
          }}
          className={`inline-flex items-center rounded-pill border px-s py-xs text-caption font-semibold ${status.className}`}
        >
          {STATUS_KEYS.map((key) => (
            <option key={key} value={key}>
              {STATUS_CONFIG[key].label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-xs break-words text-body">{plan.description}</p>
      <p className="mt-s text-label text-text-muted">
        Fecha límite: <time dateTime={plan.dueDate}>{formatDueDate(plan.dueDate)}</time>
      </p>
    </article>
  );
}
