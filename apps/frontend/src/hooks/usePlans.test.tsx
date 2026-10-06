import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, api } from "../api/client";
import type { Plan } from "../api/client";
import { comparePlans } from "../lib/plans";
import { usePlans } from "./usePlans";

vi.mock("../api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/client")>();
  return {
    ...actual,
    api: {
      listPlans: vi.fn(),
      createPlan: vi.fn(),
      updatePlanStatus: vi.fn(),
      deletePlan: vi.fn(),
    },
  };
});

const plan = (name: string, dueDate: string, createdAt: string): Plan => ({
  id: `3f2a9c1e-0000-4000-8000-${name.padStart(12, "0")}`,
  description: `Descripción ${name}`,
  dueDate,
  estado: "pendiente",
  createdAt,
});

const listPlans = vi.mocked(api.listPlans);
const createPlan = vi.mocked(api.createPlan);
const updatePlanStatusMock = vi.mocked(api.updatePlanStatus);
const deletePlanMock = vi.mocked(api.deletePlan);

describe("usePlans", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("loads the list on mount", async () => {
    listPlans.mockResolvedValue({ plans: [plan("A", "2026-05-01", "2026-01-01T00:00:00.000Z")] });
    const { result } = renderHook(() => usePlans());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.plans.map((p) => p.description)).toEqual(["Descripción A"]);
  });

  it("inserts a created plan in due-date order without refetching", async () => {
    listPlans.mockResolvedValue({
      plans: [
        plan("A", "2026-03-01", "2026-01-01T00:00:00.000Z"),
        plan("C", "2026-09-01", "2026-01-02T00:00:00.000Z"),
      ],
    });
    createPlan.mockResolvedValue({ plan: plan("B", "2026-05-01", "2026-01-03T00:00:00.000Z") });
    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let outcome: Awaited<ReturnType<typeof result.current.addPlan>> | undefined;
    await act(async () => {
      outcome = await result.current.addPlan({
        description: "d",
        dueDate: "2026-05-01",
      });
    });
    expect(outcome).toEqual({ ok: true });
    expect(result.current.plans.map((p) => p.description)).toEqual(["Descripción A", "Descripción B", "Descripción C"]);
    expect(listPlans).toHaveBeenCalledTimes(1);
  });

  it("surfaces field errors and keeps existing data on failure", async () => {
    listPlans.mockResolvedValue({ plans: [plan("A", "2026-03-01", "2026-01-01T00:00:00.000Z")] });
    createPlan.mockRejectedValue(new ApiError(400, "Datos inválidos", { dueDate: "Ingresa una fecha válida" }));
    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let outcome: Awaited<ReturnType<typeof result.current.addPlan>> | undefined;
    await act(async () => {
      outcome = await result.current.addPlan({ description: "d", dueDate: "2026-03-01" });
    });
    expect(outcome).toEqual({ ok: false, message: "Datos inválidos", fieldErrors: { dueDate: "Ingresa una fecha válida" } });
    expect(result.current.plans).toHaveLength(1);
  });

  it("reports a load error without crashing", async () => {
    listPlans.mockRejectedValue(new ApiError(0, "Sin conexión"));
    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.loadError).toBe("Sin conexión");
    expect(result.current.plans).toEqual([]);
  });

  it("updates plan status in place on success", async () => {
    const existing = plan("A", "2026-05-01", "2026-01-01T00:00:00.000Z");
    listPlans.mockResolvedValue({ plans: [existing] });
    updatePlanStatusMock.mockResolvedValue({ plan: { ...existing, estado: "hecho" } });

    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let outcome: Awaited<ReturnType<typeof result.current.updatePlanStatus>> | undefined;
    await act(async () => {
      outcome = await result.current.updatePlanStatus(existing.id, "hecho");
    });

    expect(outcome).toEqual({ ok: true });
    expect(result.current.plans[0].estado).toBe("hecho");
  });

  it("returns error message and retains previous status on failure", async () => {
    const existing = plan("A", "2026-05-01", "2026-01-01T00:00:00.000Z");
    listPlans.mockResolvedValue({ plans: [existing] });
    updatePlanStatusMock.mockRejectedValue(new ApiError(400, "Error al actualizar"));

    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let outcome: Awaited<ReturnType<typeof result.current.updatePlanStatus>> | undefined;
    await act(async () => {
      outcome = await result.current.updatePlanStatus(existing.id, "retrasado");
    });

    expect(outcome).toEqual({ ok: false, message: "Error al actualizar" });
    expect(result.current.plans[0].estado).toBe("pendiente");
  });

  it("removes plan from state on successful deletion", async () => {
    const plan1 = plan("A", "2026-05-01", "2026-01-01T00:00:00.000Z");
    const plan2 = plan("B", "2026-06-01", "2026-01-02T00:00:00.000Z");
    listPlans.mockResolvedValue({ plans: [plan1, plan2] });
    deletePlanMock.mockResolvedValue({ message: "Plan eliminado" });

    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.plans).toHaveLength(2);

    let outcome: Awaited<ReturnType<typeof result.current.deletePlan>> | undefined;
    await act(async () => {
      outcome = await result.current.deletePlan(plan1.id);
    });

    expect(outcome).toEqual({ ok: true });
    expect(result.current.plans).toHaveLength(1);
    expect(result.current.plans[0].id).toBe(plan2.id);
  });

  it("retains plan and returns error message on deletion failure", async () => {
    const plan1 = plan("A", "2026-05-01", "2026-01-01T00:00:00.000Z");
    listPlans.mockResolvedValue({ plans: [plan1] });
    deletePlanMock.mockRejectedValue(new ApiError(500, "Error en el servidor"));

    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let outcome: Awaited<ReturnType<typeof result.current.deletePlan>> | undefined;
    await act(async () => {
      outcome = await result.current.deletePlan(plan1.id);
    });

    expect(outcome).toEqual({ ok: false, message: "Error en el servidor" });
    expect(result.current.plans).toHaveLength(1);
  });
});

describe("comparePlans", () => {
  it("orders by due date, then by creation time", () => {
    const list = [
      plan("late", "2026-12-01", "2026-01-01T00:00:00.000Z"),
      plan("tie-2", "2026-03-01", "2026-01-02T00:00:00.000Z"),
      plan("tie-1", "2026-03-01", "2026-01-01T00:00:00.000Z"),
    ];
    expect(list.sort(comparePlans).map((p) => p.description)).toEqual(["Descripción tie-1", "Descripción tie-2", "Descripción late"]);
  });
});
