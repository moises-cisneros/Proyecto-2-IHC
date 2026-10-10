import { useState } from "react";
import { CalendarClock, ListChecks, Plus, TriangleAlert, Users } from "lucide-react";
import type { Plan, PlanInput } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ErrorAlert,
  JoinPlanDialog,
  PlanDialog,
  PlanList,
  StatCard,
  SuccessNotice,
} from "../components/domain";

import { usePlans } from "../hooks/usePlans";
import { daysUntil, getDueStatus } from "../lib/plans";

export default function MyPlansPage() {
  const { user } = useAuth();
  const {
    plans,
    loading,
    loadError,
    addPlan,
    joinPlan,
    updatePlan,
    confirmPlan,
    cancelPlan,
    deletePlan,
  } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSubmit(input: PlanInput) {
    setActionError(null);
    if (editingPlan) {
      const result = await updatePlan(editingPlan.id, input);
      if (result.ok) {
        setDialogOpen(false);
        setEditingPlan(null);
        setNotice("Plan actualizado correctamente.");
      }
      return result;
    }
    const result = await addPlan(input);
    if (result.ok) {
      setDialogOpen(false);
      setNotice("Plan creado correctamente.");
    }
    return result;
  }

  async function handleJoin(code: string) {
    setActionError(null);
    const result = await joinPlan(code);
    if (result.ok) {
      setNotice("Te has unido al plan correctamente.");
    }
    return result;
  }

  function openCreateDialog() {
    setEditingPlan(null);
    setNotice(null);
    setActionError(null);
    setDialogOpen(true);
  }

  function handleEdit(plan: Plan) {
    setEditingPlan(plan);
    setNotice(null);
    setActionError(null);
    setDialogOpen(true);
  }

  async function handleConfirm(id: string) {
    setNotice(null);
    setActionError(null);
    const result = await confirmPlan(id);
    if (result.ok) setNotice("Plan confirmado correctamente.");
    else setActionError(result.message);
  }

  async function handleCancel(id: string) {
    setNotice(null);
    setActionError(null);
    const result = await cancelPlan(id);
    if (result.ok) setNotice("Plan cancelado correctamente.");
    else setActionError(result.message);
  }

  async function handleDelete(id: string) {
    setNotice(null);
    setActionError(null);
    const result = await deletePlan(id);
    if (result.ok) setNotice("Plan eliminado correctamente.");
    else setActionError(result.message);
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
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setNotice(null);
              setActionError(null);
              setJoinDialogOpen(true);
            }}
          >
            <Users aria-hidden="true" />
            Unirse con código
          </Button>
          <Button type="button" size="lg" onClick={openCreateDialog}>
            <Plus aria-hidden="true" />
            Nuevo plan
          </Button>
        </div>
      </header>

      {notice ? (
        <SuccessNotice onClose={() => setNotice(null)}>{notice}</SuccessNotice>
      ) : null}
      <ErrorAlert message={loadError || actionError} />

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
          <PlanList
            plans={plans}
            onEdit={handleEdit}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        </>
      )}

      <PlanDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingPlan(null);
        }}
        initialData={editingPlan}
        onSubmit={handleSubmit}
      />

      <JoinPlanDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onJoin={handleJoin}
      />
    </div>
  );
}
