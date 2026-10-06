import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlanForm } from "./PlanForm";

const ok = { ok: true } as const;

describe("PlanForm", () => {
  it("shows a Spanish error next to each empty field and does not submit", async () => {
    const onSubmit = vi.fn();
    render(<PlanForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));

    expect(screen.getByText("Ingresa una descripción.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una fecha límite.")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("only asks for description and due date (no plan ID or estado field)", () => {
    render(<PlanForm onSubmit={vi.fn()} onCancel={() => {}} />);
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha límite")).toBeInTheDocument();
    expect(screen.queryByLabelText("Estado")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("ID del plan")).not.toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("rejects over-long values on the client", async () => {
    const onSubmit = vi.fn();
    render(<PlanForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByLabelText("Descripción"));
    await userEvent.paste("d".repeat(501));
    await userEvent.type(screen.getByLabelText("Fecha límite"), "2026-12-24");
    await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));
    expect(screen.getByText("La descripción debe tener máximo 500 caracteres.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the trimmed payload when valid with default estado 'pendiente'", async () => {
    const onSubmit = vi.fn().mockResolvedValue(ok);
    render(<PlanForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText("Descripción"), " Cena de grupo ");
    await userEvent.type(screen.getByLabelText("Fecha límite"), "2026-12-24");
    await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));

    expect(onSubmit).toHaveBeenCalledWith({
      description: "Cena de grupo",
      dueDate: "2026-12-24",
      estado: "pendiente",
    });
  });

  it("does not render an estado selection dropdown", () => {
    render(<PlanForm onSubmit={vi.fn()} onCancel={() => {}} />);
    expect(screen.queryByRole("combobox", { name: "Estado" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Estado")).not.toBeInTheDocument();
  });

  it("calls onCancel without submitting", async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(<PlanForm onSubmit={onSubmit} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps typed values and shows server field errors on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ok: false,
      message: "La fecha límite no es válida",
      fieldErrors: { dueDate: "La fecha límite no es válida" },
    });
    render(<PlanForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText("Descripción"), "Cena");
    await userEvent.type(screen.getByLabelText("Fecha límite"), "2026-12-24");
    await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));

    expect(await screen.findByText("La fecha límite no es válida", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toHaveValue("Cena");
    expect(screen.getByLabelText("Fecha límite")).toHaveValue("2026-12-24");
  });

  it("shows a general alert for network failures and keeps values", async () => {
    const onSubmit = vi
      .fn()
      .mockResolvedValue({ ok: false, message: "No se pudo conectar", fieldErrors: {} });
    render(<PlanForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText("Descripción"), "Cena");
    await userEvent.type(screen.getByLabelText("Fecha límite"), "2026-12-24");
    await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar");
    expect(screen.getByLabelText("Descripción")).toHaveValue("Cena");
  });
});
