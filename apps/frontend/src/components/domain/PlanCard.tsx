import { useState } from "react";
import { CalendarDays, CircleCheck, Clock, EllipsisVertical, Trash2 } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { Plan } from "../../api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDueDate, getDueStatus } from "../../lib/plans";
import type { DueTone } from "../../lib/plans";
import { ConfirmDialog } from "./ConfirmDialog";

const toneStyles: Record<DueTone, { badge: "danger" | "warning" | "default" | "muted"; bar: string }> = {
  overdue: { badge: "danger", bar: "bg-destructive" },
  today: { badge: "warning", bar: "bg-accent" },
  soon: { badge: "warning", bar: "bg-accent" },
  later: { badge: "default", bar: "bg-primary" },
};

interface PlanCardProps {
  plan: Plan;
  onConfirm?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}

type OpenDialog = "confirm" | "delete" | null;

export function PlanCard({ plan, onConfirm, onDelete }: PlanCardProps) {
  const dueStatus = getDueStatus(plan.dueDate);
  const tone = toneStyles[dueStatus.tone];
  const isConfirmed = plan.estado === "confirmado";

  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const [pending, setPending] = useState(false);

  async function run(action?: (id: string) => Promise<void> | void) {
    setPending(true);
    try {
      await action?.(plan.id);
    } finally {
      setPending(false);
      setOpenDialog(null);
    }
  }

  return (
    <article className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-xs transition-shadow hover:shadow-sm">
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1.5", tone.bar)} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone.badge}>
            <Clock aria-hidden="true" />
            {dueStatus.label}
          </Badge>
          <Badge
            data-testid="plan-status-badge"
            data-status={plan.estado}
            variant={isConfirmed ? "success" : "muted"}
          >
            {isConfirmed ? <CircleCheck aria-hidden="true" /> : null}
            {isConfirmed ? "Confirmado" : "Borrador"}
          </Badge>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Más acciones"
              className="-mr-2 -mt-2 size-11 p-0 text-muted-foreground"
            >
              <EllipsisVertical aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-40 rounded-lg border bg-card p-1 shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
            >
              <DropdownMenu.Item
                onSelect={() => setOpenDialog("delete")}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold text-destructive outline-none data-highlighted:bg-destructive/10"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Eliminar
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <p className="wrap-break-word text-base font-semibold leading-snug">{plan.description}</p>
      <p className="mt-auto flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        <time dateTime={plan.dueDate}>{formatDueDate(plan.dueDate)}</time>
      </p>
      {isConfirmed ? null : (
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" size="sm" onClick={() => setOpenDialog("confirm")}>
            Confirmar plan
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={openDialog === "confirm"}
        onOpenChange={(open) => {
          if (!pending) setOpenDialog(open ? "confirm" : null);
        }}
        title="¿Confirmar este plan?"
        description={`«${plan.description}» pasará a Confirmado y ya no podrá volver a borrador.`}
        confirmLabel="Confirmar"
        pendingLabel="Confirmando…"
        pending={pending}
        onConfirm={() => void run(onConfirm)}
      />
      <ConfirmDialog
        open={openDialog === "delete"}
        onOpenChange={(open) => {
          if (!pending) setOpenDialog(open ? "delete" : null);
        }}
        title="¿Eliminar este plan?"
        description={`«${plan.description}» se eliminará de forma permanente.`}
        confirmLabel="Eliminar"
        pendingLabel="Eliminando…"
        pending={pending}
        destructive
        onConfirm={() => void run(onDelete)}
      />
    </article>
  );
}
