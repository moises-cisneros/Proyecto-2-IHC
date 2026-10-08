import { useState } from "react";
import {
  Ban,
  CalendarDays,
  CircleCheck,
  Clock,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
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
  onEdit?: (plan: Plan) => void;
  onConfirm?: (id: string) => Promise<void> | void;
  onCancel?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}

type OpenDialog = "confirm" | "cancel" | "delete" | null;

export function PlanCard({ plan, onEdit, onConfirm, onCancel, onDelete }: PlanCardProps) {
  const dueStatus = getDueStatus(plan.dueDate);
  const tone = toneStyles[dueStatus.tone];
  const isConfirmed = plan.estado === "confirmado";
  const isCancelled = plan.estado === "cancelado";
  const isDraft = plan.estado === "borrador";

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
    <article
      className={cn(
        "relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-xs transition-shadow hover:shadow-sm",
        isCancelled && "border-border/80 bg-muted/20 opacity-75",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1.5", isCancelled ? "bg-muted-foreground/30" : tone.bar)}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isCancelled ? "muted" : tone.badge}>
            <Clock aria-hidden="true" />
            {dueStatus.label}
          </Badge>
          <Badge
            data-testid="plan-status-badge"
            data-status={plan.estado}
            variant={isConfirmed ? "success" : isCancelled ? "muted" : "muted"}
          >
            {isConfirmed ? (
              <CircleCheck aria-hidden="true" />
            ) : isCancelled ? (
              <Ban aria-hidden="true" />
            ) : null}
            {isConfirmed ? "Confirmado" : isCancelled ? "Cancelado" : "Borrador"}
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
              {!isCancelled ? (
                <DropdownMenu.Item
                  onSelect={() => onEdit?.(plan)}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold text-foreground outline-none data-highlighted:bg-accent/10"
                >
                  <Pencil aria-hidden="true" className="size-4" />
                  Editar
                </DropdownMenu.Item>
              ) : null}
              <DropdownMenu.Item
                disabled={isConfirmed}
                onSelect={() => {
                  if (!isConfirmed) setOpenDialog("delete");
                }}
                title={isConfirmed ? "Debes cancelar el plan antes de eliminarlo" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold outline-none",
                  isConfirmed
                    ? "cursor-not-allowed text-muted-foreground opacity-50"
                    : "cursor-pointer text-destructive data-highlighted:bg-destructive/10",
                )}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Eliminar
              </DropdownMenu.Item>
              {isConfirmed ? (
                <div
                  role="note"
                  className="border-t mt-1 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Debes cancelar el plan antes de eliminarlo
                </div>
              ) : null}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <p className={cn("wrap-break-word text-base font-semibold leading-snug", isCancelled && "text-muted-foreground")}>
        {plan.description}
      </p>
      <p className="mt-auto flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <CalendarDays aria-hidden="true" className={cn("size-4", isCancelled ? "text-muted-foreground" : "text-primary")} />
        <time dateTime={plan.dueDate} className={cn(isCancelled && "text-muted-foreground")}>
          {formatDueDate(plan.dueDate)}
        </time>
      </p>
      {isDraft ? (
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" size="sm" onClick={() => setOpenDialog("confirm")}>
            Confirmar plan
          </Button>
        </div>
      ) : isConfirmed ? (
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" size="sm" onClick={() => setOpenDialog("cancel")}>
            Cancelar plan
          </Button>
        </div>
      ) : null}

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
        open={openDialog === "cancel"}
        onOpenChange={(open) => {
          if (!pending) setOpenDialog(open ? "cancel" : null);
        }}
        title="¿Cancelar este plan?"
        description={`«${plan.description}» pasará a Cancelado. Podrás eliminarlo una vez cancelado.`}
        confirmLabel="Cancelar plan"
        pendingLabel="Cancelando…"
        pending={pending}
        destructive
        onConfirm={() => void run(onCancel)}
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
