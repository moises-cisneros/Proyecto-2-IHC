import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Plan } from "../../api/client";
import { PlanCard } from "./PlanCard";

const basePlan: Plan = {
  id: "3f2a9c1e-7b4d-4e8a-9c21-5d6e7f8a9b0c",
  description: "Cena de equipo",
  dueDate: "2026-12-24",
  estado: "borrador",
  createdAt: "2026-01-01T00:00:00.000Z",
};
const confirmed: Plan = { ...basePlan, estado: "confirmado" };

async function openMenu() {
  await userEvent.click(screen.getByRole("button", { name: "Más acciones" }));
}

describe("PlanCard - state", () => {
  it("shows a text 'Borrador' badge and the confirm button for a draft", () => {
    render(<PlanCard plan={basePlan} />);
    expect(screen.getByTestId("plan-status-badge")).toHaveTextContent("Borrador");
    expect(screen.getByTestId("plan-status-badge")).toHaveAttribute("data-status", "borrador");
    expect(screen.getByRole("button", { name: "Confirmar plan" })).toBeInTheDocument();
  });

  it("shows a 'Confirmado' badge with a check icon and no confirm button", () => {
    render(<PlanCard plan={confirmed} />);
    const badge = screen.getByTestId("plan-status-badge");
    expect(badge).toHaveTextContent("Confirmado");
    expect(badge.querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Confirmar plan" })).not.toBeInTheDocument();
  });

  it("does not render a state select", () => {
    render(<PlanCard plan={basePlan} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});

describe("PlanCard - confirm flow", () => {
  it("opens a dialog naming the plan and sends nothing until accepted", async () => {
    const onConfirm = vi.fn();
    render(<PlanCard plan={basePlan} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar plan" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent("Cena de equipo");
    expect(dialog).toHaveTextContent(/no podrá volver a borrador/i);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm with the plan id when the user accepts", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(<PlanCard plan={basePlan} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar plan" }));
    await userEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Confirmar" }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(basePlan.id);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("does not call onConfirm when the user cancels", async () => {
    const onConfirm = vi.fn();
    render(<PlanCard plan={basePlan} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar plan" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("disables the accept button while the request is pending", async () => {
    let finish: () => void = () => {};
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<PlanCard plan={basePlan} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar plan" }));
    await userEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Confirmar" }),
    );
    expect(await screen.findByRole("button", { name: "Confirmando…" })).toBeDisabled();
    finish();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });
});

describe("PlanCard - actions menu", () => {
  it("has no standalone delete button and exposes an accessible menu button", () => {
    render(<PlanCard plan={basePlan} />);
    expect(screen.queryByRole("button", { name: "Eliminar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Más acciones" }).className).toContain("size-11");
  });

  it("shows a destructive 'Eliminar' item when the menu opens", async () => {
    render(<PlanCard plan={basePlan} />);
    await openMenu();
    const item = await screen.findByRole("menuitem", { name: "Eliminar" });
    expect(item.className).toContain("text-destructive");
  });

  it("closes the menu with Escape and returns focus to the trigger", async () => {
    render(<PlanCard plan={basePlan} />);
    await openMenu();
    await screen.findByRole("menuitem", { name: "Eliminar" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menuitem")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Más acciones" })).toHaveFocus();
  });

  it("asks for confirmation naming the plan before deleting", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<PlanCard plan={basePlan} onDelete={onDelete} />);
    await openMenu();
    await userEvent.click(await screen.findByRole("menuitem", { name: "Eliminar" }));

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveTextContent("Cena de equipo");
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(basePlan.id);
  });

  it("keeps the plan when the delete dialog is cancelled", async () => {
    const onDelete = vi.fn();
    render(<PlanCard plan={basePlan} onDelete={onDelete} />);
    await openMenu();
    await userEvent.click(await screen.findByRole("menuitem", { name: "Eliminar" }));
    await userEvent.click(await screen.findByRole("button", { name: "Cancelar" }));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
