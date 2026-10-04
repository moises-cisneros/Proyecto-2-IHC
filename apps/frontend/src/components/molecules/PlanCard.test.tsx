import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Plan, PlanStatus } from "../../api/client";
import { PlanCard, STATUS_CONFIG } from "./PlanCard";

const basePlan: Plan = {
  id: "3f2a9c1e-7b4d-4e8a-9c21-5d6e7f8a9b0c",
  description: "Cena de equipo",
  dueDate: "2026-12-24",
  estado: "pendiente",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("PlanCard - status badge", () => {
  it("renders 'hecho' with green styling and accessible label", () => {
    const plan: Plan = { ...basePlan, estado: "hecho" };
    render(<PlanCard plan={plan} />);

    const badge = screen.getByTestId("plan-status-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveValue("hecho");
    expect(badge).toHaveAttribute("aria-label", "Estado: Hecho");
    expect(badge).toHaveAttribute("data-status", "hecho");
    expect(badge).toHaveStyle({
      backgroundColor: "rgb(220, 252, 231)",
      color: "rgb(22, 101, 52)",
    });
  });

  it("renders 'retrasado' with red styling and accessible label", () => {
    const plan: Plan = { ...basePlan, estado: "retrasado" };
    render(<PlanCard plan={plan} />);

    const badge = screen.getByTestId("plan-status-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveValue("retrasado");
    expect(badge).toHaveAttribute("aria-label", "Estado: Retrasado");
    expect(badge).toHaveAttribute("data-status", "retrasado");
    expect(badge).toHaveStyle({
      backgroundColor: "rgb(255, 228, 230)",
      color: "rgb(159, 18, 57)",
    });
  });

  it("renders 'pendiente' with blue styling and accessible label", () => {
    const plan: Plan = { ...basePlan, estado: "pendiente" };
    render(<PlanCard plan={plan} />);

    const badge = screen.getByTestId("plan-status-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveValue("pendiente");
    expect(badge).toHaveAttribute("aria-label", "Estado: Pendiente");
    expect(badge).toHaveAttribute("data-status", "pendiente");
    expect(badge).toHaveStyle({
      backgroundColor: "rgb(224, 242, 254)",
      color: "rgb(7, 89, 133)",
    });
  });

  it("defaults to 'pendiente' when estado is undefined", () => {
    const plan = { ...basePlan, estado: undefined as unknown as PlanStatus };
    render(<PlanCard plan={plan} />);

    const badge = screen.getByTestId("plan-status-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveValue("pendiente");
    expect(badge).toHaveAttribute("aria-label", "Estado: Pendiente");
    expect(badge).toHaveStyle({
      backgroundColor: "rgb(224, 242, 254)",
      color: "rgb(7, 89, 133)",
    });
  });
});

describe("PlanCard - interactive status change", () => {
  it("calls onStatusChange with plan id and new status when user selects a different option", () => {
    const onStatusChange = vi.fn();
    const plan: Plan = { ...basePlan, estado: "pendiente" };
    render(<PlanCard plan={plan} onStatusChange={onStatusChange} />);

    const select = screen.getByTestId("plan-status-badge");
    fireEvent.change(select, { target: { value: "hecho" } });

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenCalledWith(plan.id, "hecho");
  });

  it("calls onStatusChange when switching from hecho to retrasado", () => {
    const onStatusChange = vi.fn();
    const plan: Plan = { ...basePlan, estado: "hecho" };
    render(<PlanCard plan={plan} onStatusChange={onStatusChange} />);

    const select = screen.getByTestId("plan-status-badge");
    fireEvent.change(select, { target: { value: "retrasado" } });

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenCalledWith(plan.id, "retrasado");
  });

  it("does not crash when onStatusChange is not provided", () => {
    const plan: Plan = { ...basePlan, estado: "pendiente" };
    render(<PlanCard plan={plan} />);

    const select = screen.getByTestId("plan-status-badge");
    // Should not throw
    fireEvent.change(select, { target: { value: "hecho" } });
    expect(select).toHaveValue("pendiente"); // value controlled by prop, no state change
  });

  it("renders all three status options in the select", () => {
    const plan: Plan = { ...basePlan, estado: "pendiente" };
    render(<PlanCard plan={plan} />);

    const select = screen.getByTestId("plan-status-badge") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);

    expect(options).toEqual(["pendiente", "hecho", "retrasado"]);
  });
});
