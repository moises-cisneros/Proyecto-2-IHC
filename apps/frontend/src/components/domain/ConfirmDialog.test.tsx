import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "./ConfirmDialog";

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: "¿Confirmar plan?",
  description: "Cena de grupo no volverá a borrador.",
  confirmLabel: "Confirmar",
  onConfirm: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("renders title, description and both actions when open", () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByRole("alertdialog", { name: "¿Confirmar plan?" })).toBeInTheDocument();
    expect(screen.getByText("Cena de grupo no volverá a borrador.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeEnabled();
  });

  it("renders nothing when closed", () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("calls onConfirm when the user accepts", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("requests closing without confirming when the user cancels", async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("disables both actions and shows the pending label while pending", () => {
    render(<ConfirmDialog {...baseProps} pending pendingLabel="Confirmando…" />);
    expect(screen.getByRole("button", { name: "Confirmando…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });

  it("uses the destructive style for destructive confirmations", () => {
    render(<ConfirmDialog {...baseProps} confirmLabel="Eliminar" destructive />);
    expect(screen.getByRole("button", { name: "Eliminar" }).className).toContain("bg-destructive");
  });
});
