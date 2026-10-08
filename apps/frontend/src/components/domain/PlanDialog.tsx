import { AlertTriangle, CalendarPlus, Pencil } from "lucide-react";
import type { PlanInput } from "../../api/client";
import type { AddPlanResult } from "../../hooks/usePlans";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanForm } from "./PlanForm";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: PlanInput) => Promise<AddPlanResult>;
  initialData?: (PlanInput & { estado?: string }) | null;
}

export function PlanDialog({ open, onOpenChange, onSubmit, initialData }: PlanDialogProps) {
  const isEdit = Boolean(initialData);
  const isConfirmed = initialData?.estado === "confirmado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span className="mb-1 inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {isEdit ? (
              <Pencil aria-hidden="true" className="size-6" />
            ) : (
              <CalendarPlus aria-hidden="true" className="size-6" />
            )}
          </span>
          <DialogTitle>{isEdit ? "Editar plan" : "Nuevo plan"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos del plan y guarda los cambios."
              : "Describe el plan y elige la fecha en la que debe estar listo."}
          </DialogDescription>
          {isConfirmed ? (
            <div
              role="note"
              className="mt-2 flex items-start gap-2.5 rounded-lg border border-accent/40 bg-accent/15 p-3 text-xs leading-relaxed text-accent-foreground"
            >
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <span>
                <strong>Atención:</strong> Este plan ya está confirmado. Ten en cuenta que modificar la fecha o descripción puede afectar a los participantes.
              </span>
            </div>
          ) : null}
        </DialogHeader>
        <PlanForm
          initialData={initialData}
          submitLabel={isEdit ? "Guardar cambios" : "Crear plan"}
          submittingLabel={isEdit ? "Guardando…" : "Creando…"}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
