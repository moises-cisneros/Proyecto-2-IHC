import { CalendarDays, Clock } from "lucide-react";
import type { Plan, PlanStatus } from "../../api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDueDate, getDueStatus } from "../../lib/plans";
import type { DueTone } from "../../lib/plans";

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

const toneStyles: Record<DueTone, { badge: "danger" | "warning" | "default" | "muted"; bar: string }> = {
  overdue: { badge: "danger", bar: "bg-destructive" },
  today: { badge: "warning", bar: "bg-accent" },
  soon: { badge: "warning", bar: "bg-accent" },
  later: { badge: "default", bar: "bg-primary" },
};

interface PlanCardProps {
  plan: Plan;
  onStatusChange?: (id: string, estado: PlanStatus) => void;
  onDelete?: (id: string) => void;
}

export function PlanCard({ plan, onStatusChange, onDelete }: PlanCardProps) {
  const dueStatus = getDueStatus(plan.dueDate);
  const tone = toneStyles[dueStatus.tone];

  const statusKey = (plan.estado?.toLowerCase() ?? "pendiente") as PlanStatus;
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pendiente;

  return (
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1.5", tone.bar)} />
      <div className="flex items-center justify-between gap-2">
        <Badge variant={tone.badge}>
          <Clock aria-hidden="true" />
          {dueStatus.label}
        </Badge>
        <select
          data-testid="plan-status-badge"
          data-status={statusKey}
          aria-label={`Estado: ${status.label}`}
          value={statusKey}
          onChange={(e) => onStatusChange?.(plan.id, e.target.value as PlanStatus)}
          style={{
            ...status.style,
            cursor: onStatusChange ? "pointer" : "default",
          }}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            status.className,
          )}
        >
          {STATUS_KEYS.map((key) => (
            <option key={key} value={key} className="bg-background text-foreground">
              {STATUS_CONFIG[key].label}
            </option>
          ))}
        </select>
      </div>
      <p className="wrap-break-word text-base font-semibold leading-snug">{plan.description}</p>
      <p className="mt-auto flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        <time dateTime={plan.dueDate}>{formatDueDate(plan.dueDate)}</time>
      </p>
      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Button
          type="button"
          size="sm"
          disabled={statusKey === "hecho"}
          onClick={() => onStatusChange?.(plan.id, "hecho")}
        >
          Confirmar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          style={STATUS_CONFIG.retrasado.style}
          className={cn("font-semibold hover:opacity-90", STATUS_CONFIG.retrasado.className)}
          onClick={() => onDelete?.(plan.id)}
        >
          Eliminar
        </Button>
      </div>
    </article>
  );
}
