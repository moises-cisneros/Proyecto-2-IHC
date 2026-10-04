import { useState } from "react";
import type { FormEvent } from "react";
import type { PlanInput, PlanStatus } from "../../api/client";
import type { AddPlanResult } from "../../hooks/usePlans";
import { Button } from "../atoms/Button";
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
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Nuevo plan"
      className="mb-l rounded-base border border-border bg-card p-l"
    >
      <ErrorAlert message={formError} />
      <TextArea
        id="plan-description"
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <Field
        id="plan-due-date"
        label="Fecha límite"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
      />
      <div className="mb-m flex flex-col gap-xs">
        <label htmlFor="plan-estado" className="text-label text-text">
          Estado
        </label>
        <select
          id="plan-estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as PlanStatus)}
          className="min-h-11 rounded-base border border-border bg-card px-m py-s text-body text-text focus:border-primary focus:outline-none"
        >
          <option value="pendiente">Pendiente</option>
          <option value="hecho">Hecho</option>
          <option value="retrasado">Retrasado</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-s">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creando…" : "Crear plan"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
