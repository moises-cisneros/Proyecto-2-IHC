import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Plan } from "../../api/client";
import { PlanList } from "./PlanList";

const plan = (name: string, dueDate: string): Plan => ({
  id: `3f2a9c1e-0000-4000-8000-${name.padStart(12, "0")}`,
  description: `Descripción de ${name}`,
  dueDate,
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("PlanList", () => {
  it("renders a card per plan with short id, description and Spanish date", () => {
    const item = plan("PLAN-001", "2026-12-24");
    render(<PlanList plans={[item]} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("3f2a9c1e")).toBeInTheDocument();
    expect(within(card).queryByText(item.id)).not.toBeInTheDocument();
    expect(within(card).getByText("Descripción de PLAN-001")).toBeInTheDocument();
    expect(within(card).getByText("24 de diciembre de 2026")).toBeInTheDocument();
  });

  it("exposes the full id through a title and aria-label", () => {
    const item = plan("X", "2026-05-05");
    render(<PlanList plans={[item]} />);
    expect(screen.getByTitle(item.id)).toHaveTextContent("3f2a9c1e");
    expect(screen.getByLabelText(`ID completo: ${item.id}`)).toBeInTheDocument();
  });

  it("does not shift the date across time zones (1 January stays 1 January)", () => {
    render(<PlanList plans={[plan("NY", "2026-01-01")]} />);
    expect(screen.getByText("1 de enero de 2026")).toBeInTheDocument();
  });

  it("keeps the order it receives", () => {
    render(<PlanList plans={[plan("A", "2026-01-01"), plan("B", "2026-02-01")]} />);
    const cards = screen.getAllByRole("article").map((a) => a.textContent);
    expect(cards[0]).toContain("Descripción de A");
    expect(cards[1]).toContain("Descripción de B");
  });

  it("shows an empty-state message when there are no plans", () => {
    render(<PlanList plans={[]} />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.getByText(/todavía no tienes planes/i)).toBeInTheDocument();
  });
});
