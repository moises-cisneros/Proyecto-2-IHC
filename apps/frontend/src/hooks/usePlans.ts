import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import type { Plan, PlanInput } from "../api/client";
import { comparePlans } from "../lib/plans";

export type AddPlanResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

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

  return { plans, loading, loadError, addPlan };
}
