import { useState } from "react";
import type { PlanInput } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/atoms/Button";
import { ErrorAlert, SuccessNotice } from "../components/molecules/Notices";
import { PlanForm } from "../components/molecules/PlanForm";
import { PlanList } from "../components/organisms/PlanList";
import { usePlans } from "../hooks/usePlans";

export default function MyPlansPage() {
  const { user } = useAuth();
  const { plans, loading, loadError, addPlan, updatePlanStatus } = usePlans();
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(input: PlanInput) {
    const result = await addPlan(input);
    if (result.ok) {
      setFormOpen(false);
      setCreated(true);
    }
    return result;
  }

  function toggleForm() {
    setCreated(false);
    setFormOpen((open) => !open);
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
        <ErrorAlert message={loadError} />
        {loading ? (
          <p role="status" className="text-text-muted">
            Cargando tus planes…
          </p>
        ) : (
          <PlanList plans={plans} onStatusChange={updatePlanStatus} />
        )}
      </div>
    </>
  );
}
