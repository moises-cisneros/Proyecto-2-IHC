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

describe("LoginPage - Interactive color button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. renders initially in red state", () => {
    renderLoginPage();
    const button = screen.getByTestId("color-test-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Color: Rojo/i);
    expect(button).toHaveStyle({ backgroundColor: "rgb(220, 38, 38)" });
  });

  it("2. switches to yellow state on first click", async () => {
    renderLoginPage();
    const button = screen.getByTestId("color-test-button");
    await userEvent.click(button);
    expect(button).toHaveTextContent(/Color: Amarillo/i);
    expect(button).toHaveStyle({ backgroundColor: "rgb(250, 204, 21)" });
  });

  it("3. switches to green state on second click", async () => {
    renderLoginPage();
    const button = screen.getByTestId("color-test-button");
    await userEvent.click(button);
    await userEvent.click(button);
    expect(button).toHaveTextContent(/Color: Verde/i);
    expect(button).toHaveStyle({ backgroundColor: "rgb(22, 163, 74)" });
  });

  it("4. cycles back to red state on third click", async () => {
    renderLoginPage();
    const button = screen.getByTestId("color-test-button");
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    expect(button).toHaveTextContent(/Color: Rojo/i);
    expect(button).toHaveStyle({ backgroundColor: "rgb(220, 38, 38)" });
  });
});
