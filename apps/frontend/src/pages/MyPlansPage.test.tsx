import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/client";
import type { Plan } from "../api/client";
import MyPlansPage from "./MyPlansPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1", name: "Ana", email: "a@x.com", createdAt: "" } }),
}));

vi.mock("../api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/client")>();
  return { ...actual, api: { listPlans: vi.fn(), createPlan: vi.fn(), updatePlanStatus: vi.fn() } };
});

const listPlans = vi.mocked(api.listPlans);
const createPlan = vi.mocked(api.createPlan);

const saved: Plan = {
  id: "3f2a9c1e-7b4d-4e8a-9c21-5d6e7f8a9b0c",
  description: "Cena de grupo",
  dueDate: "2026-12-24",
  estado: "pendiente",
  createdAt: "2026-01-01T00:00:00.000Z",
};

async function createViaForm() {
  await userEvent.click(screen.getByRole("button", { name: "Nuevo plan" }));
  await userEvent.type(screen.getByLabelText("Descripción"), "Cena de grupo");
  await userEvent.type(screen.getByLabelText("Fecha límite"), "2026-12-24");
  await userEvent.click(screen.getByRole("button", { name: "Crear plan" }));
}

describe("MyPlansPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("greets the user and shows the empty state with no logout button in the body", async () => {
    listPlans.mockResolvedValue({ plans: [] });
    render(<MyPlansPage />);
    expect(screen.getByRole("heading", { name: "Hola, Ana" })).toBeInTheDocument();
    expect(await screen.findByText(/todavía no tienes planes/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cerrar sesión" })).not.toBeInTheDocument();
  });

  it("opens the form, creates a plan and shows its card without reloading", async () => {
    listPlans.mockResolvedValue({ plans: [] });
    createPlan.mockResolvedValue({ plan: saved });
    render(<MyPlansPage />);
    await screen.findByText(/todavía no tienes planes/i);
    expect(screen.queryByLabelText("ID del plan")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Nuevo plan" }));
    expect(screen.queryByLabelText("ID del plan")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    await createViaForm();

    expect(await screen.findByRole("article")).toHaveTextContent("Cena de grupo");
    expect(screen.getByText("24 de diciembre de 2026")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Plan creado");
    expect(screen.queryByLabelText("ID del plan")).not.toBeInTheDocument();
    expect(createPlan).toHaveBeenCalledWith({
      description: "Cena de grupo",
      dueDate: "2026-12-24",
      estado: "pendiente",
    });
    expect(listPlans).toHaveBeenCalledTimes(1);
  });

  it("still shows the card after a remount with the persisted list", async () => {
    listPlans.mockResolvedValue({ plans: [saved] });
    const first = render(<MyPlansPage />);
    expect(await screen.findByRole("article")).toHaveTextContent("Cena de grupo");
    first.unmount();

    render(<MyPlansPage />);
    expect(await screen.findByRole("article")).toHaveTextContent("Cena de grupo");
  });

  it("allows changing status on a rendered card and persists the change", async () => {
    listPlans.mockResolvedValue({ plans: [saved] });
    const updateMock = vi.mocked(api.updatePlanStatus);
    updateMock.mockResolvedValue({ plan: { ...saved, estado: "hecho" } });

    render(<MyPlansPage />);
    const badge = await screen.findByTestId("plan-status-badge");
    expect(badge).toHaveValue("pendiente");

    await userEvent.selectOptions(badge, "hecho");
    expect(updateMock).toHaveBeenCalledWith(saved.id, "hecho");
  });

  it("keeps the form open with an error when the server rejects the plan", async () => {
    listPlans.mockResolvedValue({ plans: [saved] });
    const { ApiError } = await import("../api/client");
    createPlan.mockRejectedValue(new ApiError(400, "inválido", { dueDate: "Ingresa una fecha válida" }));
    render(<MyPlansPage />);
    await screen.findByRole("article");

    await createViaForm();

    await waitFor(() =>
      expect(screen.getByText("Ingresa una fecha válida", { selector: "p" })).toBeInTheDocument(),
    );
    expect(screen.getByLabelText("Descripción")).toHaveValue("Cena de grupo");
    // The modal hides the page behind it from the accessibility tree, hence `hidden: true`.
    expect(screen.getAllByRole("article", { hidden: true })).toHaveLength(1);
  });

  it("closes the form on cancel without creating a plan", async () => {
    listPlans.mockResolvedValue({ plans: [] });
    render(<MyPlansPage />);
    await screen.findByText(/todavía no tienes planes/i);
    await userEvent.click(screen.getByRole("button", { name: "Nuevo plan" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByLabelText("ID del plan")).not.toBeInTheDocument();
    expect(createPlan).not.toHaveBeenCalled();
  });
});
