import { useState } from "react";
import { CalendarClock, ListChecks, Plus, TriangleAlert } from "lucide-react";
import type { PlanInput } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ErrorAlert, SuccessNotice } from "../components/molecules/Notices";
import { StatCard } from "../components/molecules/StatCard";
import { PlanDialog } from "../components/organisms/PlanDialog";
import { PlanList } from "../components/organisms/PlanList";
import { usePlans } from "../hooks/usePlans";
import { daysUntil, getDueStatus } from "../lib/plans";

export default function MyPlansPage() {
  const { user } = useAuth();
  const { plans, loading, loadError, addPlan, updatePlanStatus } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(input: PlanInput) {
    const result = await addPlan(input);
    if (result.ok) {
      setDialogOpen(false);
      setCreated(true);
    }
    return result;
  }

  function openDialog() {
    setCreated(false);
    setDialogOpen(true);
  }

  const nextPlan = plans.find((plan) => daysUntil(plan.dueDate) >= 0);
  const overdue = plans.filter((plan) => daysUntil(plan.dueDate) < 0).length;

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Hola, {user?.name}</h1>
          <p className="text-muted-foreground">
            Organiza y da seguimiento a los planes de tu grupo.
          </p>
        </div>
        <Button type="button" size="lg" onClick={openDialog}>
          <Plus aria-hidden="true" />
          Nuevo plan
        </Button>
      </header>

      {created ? <SuccessNotice>Plan creado correctamente.</SuccessNotice> : null}
      <ErrorAlert message={loadError} />

      {loading ? (
        <p role="status" className="text-muted-foreground">
          Cargando tus planes…
        </p>
      ) : (
        <>
          {plans.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={ListChecks} label="Planes" value={String(plans.length)} />
              <StatCard
                icon={CalendarClock}
                label="Próximo plan"
                tone="accent"
                value={nextPlan ? getDueStatus(nextPlan.dueDate).label : "Sin pendientes"}
              />
              <StatCard
                icon={TriangleAlert}
                label="Vencidos"
                tone="danger"
                value={String(overdue)}
              />
            </div>
          ) : null}
          <PlanList plans={plans} onCreate={openDialog} onStatusChange={updatePlanStatus} />
        </>
      )}

      <PlanDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} />
    </div>
  );
}
