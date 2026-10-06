import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, LoaderCircle } from "lucide-react";
import type { PlanInput, PlanStatus } from "../../api/client";
import type { AddPlanResult } from "../../hooks/usePlans";
import { Button } from "@/components/ui/button";
import { Field } from "../atoms/Field";
import { TextArea } from "../atoms/TextArea";
import { ErrorAlert } from "./Notices";

const DESCRIPTION_MAX = 500;

type Errors = Partial<Record<keyof PlanInput, string>>;

function validate(values: PlanInput): Errors {
  const errors: Errors = {};
  if (!values.description) errors.description = "Ingresa una descripción.";
  else if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `La descripción debe tener máximo ${DESCRIPTION_MAX} caracteres.`;
  }
  if (!values.dueDate) errors.dueDate = "Selecciona una fecha límite.";
  return errors;
}

interface PlanFormProps {
  onSubmit: (input: PlanInput) => Promise<AddPlanResult>;
  onCancel: () => void;
}

export function PlanForm({ onSubmit, onCancel }: PlanFormProps) {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estado, setEstado] = useState<PlanStatus>("pendiente");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const values: PlanInput = { description: description.trim(), dueDate, estado };
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await onSubmit(values);
      if (!result.ok) {
        const { description: descriptionError, dueDate: dueDateError } = result.fieldErrors;
        setErrors({ description: descriptionError, dueDate: dueDateError });
        if (!descriptionError && !dueDateError) setFormError(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <ErrorAlert message={formError} />
      <TextArea
        id="plan-description"
        label="Descripción"
        placeholder="Ej. Cena de cumpleaños en casa de Ana"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <Field
        id="plan-due-date"
        label="Fecha límite"
        type="date"
        icon={CalendarDays}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
      />
      <div className="grid gap-1.5">
        <label
          htmlFor="plan-estado"
          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Estado
        </label>
        <select
          id="plan-estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as PlanStatus)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="pendiente">Pendiente</option>
          <option value="hecho">Hecho</option>
          <option value="retrasado">Retrasado</option>
        </select>
      </div>
      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {submitting ? "Creando…" : "Crear plan"}
        </Button>
      </div>
    </form>
  );
}
