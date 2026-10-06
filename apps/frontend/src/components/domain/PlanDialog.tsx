import { CalendarPlus } from "lucide-react";
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
}

export function PlanDialog({ open, onOpenChange, onSubmit }: PlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span className="mb-1 inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CalendarPlus aria-hidden="true" className="size-6" />
          </span>
          <DialogTitle>Nuevo plan</DialogTitle>
          <DialogDescription>
            Describe el plan y elige la fecha en la que debe estar listo.
          </DialogDescription>
        </DialogHeader>
        <PlanForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
