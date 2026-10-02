import { CalendarDays, Clock } from "lucide-react";
import type { Plan } from "../../api/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDueDate, getDueStatus } from "../../lib/plans";
import type { DueTone } from "../../lib/plans";

const toneStyles: Record<DueTone, { badge: "danger" | "warning" | "default" | "muted"; bar: string }> = {
  overdue: { badge: "danger", bar: "bg-destructive" },
  today: { badge: "warning", bar: "bg-accent" },
  soon: { badge: "warning", bar: "bg-accent" },
  later: { badge: "default", bar: "bg-primary" },
};

export function PlanCard({ plan }: { plan: Plan }) {
  const status = getDueStatus(plan.dueDate);
  const tone = toneStyles[status.tone];

  return (
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1.5", tone.bar)} />
      <Badge variant={tone.badge}>
        <Clock aria-hidden="true" />
        {status.label}
      </Badge>
      <p className="wrap-break-word text-base font-semibold leading-snug">{plan.description}</p>
      <p className="mt-auto flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        <time dateTime={plan.dueDate}>{formatDueDate(plan.dueDate)}</time>
      </p>
    </article>
  );
}
