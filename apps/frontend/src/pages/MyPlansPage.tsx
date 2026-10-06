import { useState } from "react";
import type { PlanInput, PlanStatus } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/atoms/Button";
import { ErrorAlert, SuccessNotice } from "../components/molecules/Notices";
import { PlanForm } from "../components/molecules/PlanForm";
import { PlanList } from "../components/organisms/PlanList";
import { usePlans } from "../hooks/usePlans";

export default function MyPlansPage() {
  const { user } = useAuth();
  const { plans, loading, loadError, addPlan, updatePlanStatus, deletePlan } = usePlans();
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSubmit(input: PlanInput) {
    setActionError(null);
    const result = await addPlan(input);
    if (result.ok) {
      setFormOpen(false);
      setCreated(true);
    }
    return result;
  }

  function toggleForm() {
    setActionError(null);
    setCreated(false);
    setFormOpen((open) => !open);
  }

  async function handleStatusChange(id: string, estado: PlanStatus) {
    const targetPlan = plans.find((p) => p.id === id);
    if (targetPlan?.estado === "hecho" && estado === "hecho") {
      setActionError("Esta acción ya fue confirmada.");
      return;
    }
    setActionError(null);
    const result = await updatePlanStatus(id, estado);
    if (!result.ok) {
      setActionError(result.message);
    }
  }

  return (
    <>
      <h1 className="text-heading">Hola, {user?.name}</h1>
      <div className="mt-l border-t border-border pt-l">
        <div className="mb-l">
          <Button type="button" onClick={toggleForm} aria-expanded={formOpen}>
            Nuevo plan
          </Button>
        </div>
        {created ? <SuccessNotice>Plan creado correctamente.</SuccessNotice> : null}
        {formOpen ? <PlanForm onSubmit={handleSubmit} onCancel={toggleForm} /> : null}
        <ErrorAlert message={loadError || actionError} />
        {loading ? (
          <p role="status" className="text-text-muted">
            Cargando tus planes…
          </p>
        ) : (
          <PlanList
            plans={plans}
            onStatusChange={handleStatusChange}
            onDelete={deletePlan}
          />
        )}
      </div>
    </>
  );
}
