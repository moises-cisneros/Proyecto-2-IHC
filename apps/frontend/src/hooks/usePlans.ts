import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import type { Plan, PlanInput, PlanStatus } from "../api/client";
import { comparePlans } from "../lib/plans";

export type AddPlanResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

export type UpdatePlanStatusResult =
  | { ok: true }
  | { ok: false; message: string };

export type DeletePlanResult =
  | { ok: true }
  | { ok: false; message: string };

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .listPlans()
      .then((data) => {
        if (active) setPlans([...data.plans].sort(comparePlans));
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar tus planes.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addPlan = useCallback(async (input: PlanInput): Promise<AddPlanResult> => {
    try {
      const { plan } = await api.createPlan(input);
      setPlans((current) => [...current, plan].sort(comparePlans));
      return { ok: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { ok: false, message: error.message, fieldErrors: error.fieldErrors };
      }
      return { ok: false, message: "No se pudo crear el plan.", fieldErrors: {} };
    }
  }, []);

  const updatePlanStatus = useCallback(
    async (id: string, estado: PlanStatus): Promise<UpdatePlanStatusResult> => {
      try {
        const { plan } = await api.updatePlanStatus(id, estado);
        setPlans((current) =>
          current.map((p) => (p.id === id ? { ...p, estado: plan.estado } : p)),
        );
        return { ok: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return { ok: false, message: error.message };
        }
        return { ok: false, message: "No se pudo actualizar el estado del plan." };
      }
    },
    [],
  );

  const deletePlan = useCallback(
    async (id: string): Promise<DeletePlanResult> => {
      try {
        await api.deletePlan(id);
        setPlans((current) => current.filter((p) => p.id !== id));
        return { ok: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return { ok: false, message: error.message };
        }
        return { ok: false, message: "No se pudo eliminar el plan." };
      }
    },
    [],
  );

  return { plans, loading, loadError, addPlan, updatePlanStatus, deletePlan };
}
