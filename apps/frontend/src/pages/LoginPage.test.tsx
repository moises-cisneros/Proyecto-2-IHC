import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ login: vi.fn(), user: null, loading: false }),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email, password inputs and login button", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("does not render the demo color test button", () => {
    renderLoginPage();
    expect(screen.queryByTestId("color-test-button")).not.toBeInTheDocument();
  });

  it("shows validation error when submitting with empty fields", async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByText("Ingresa un correo válido.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument();
  });

  it("shows validation error when email format is invalid", async () => {
    renderLoginPage();
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "invalid-email");
    await userEvent.type(screen.getByLabelText("Contraseña"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByText("Ingresa un correo válido.")).toBeInTheDocument();
  });
});
