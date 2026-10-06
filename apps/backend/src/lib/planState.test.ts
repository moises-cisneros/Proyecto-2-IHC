import { describe, expect, it } from "vitest";
import { INITIAL_PLAN_STATE, InvalidTransitionError, confirmPlan } from "./planState.js";

const draft = {
  id: "p1",
  description: "Cena de grupo",
  dueDate: new Date("2026-12-24T00:00:00.000Z"),
  userId: "u1",
  estado: INITIAL_PLAN_STATE,
};

describe("plan state machine", () => {
  it("starts every plan as borrador", () => {
    expect(INITIAL_PLAN_STATE).toBe("borrador");
  });

  it("moves a borrador plan to confirmado", () => {
    expect(confirmPlan(draft).estado).toBe("confirmado");
  });

  it("rejects confirming a plan that is already confirmado", () => {
    const confirmed = confirmPlan(draft);
    expect(() => confirmPlan(confirmed)).toThrow(InvalidTransitionError);
  });

  it("preserves description, dueDate and userId when confirming", () => {
    const confirmed = confirmPlan(draft);
    expect(confirmed).toMatchObject({
      id: draft.id,
      description: draft.description,
      dueDate: draft.dueDate,
      userId: draft.userId,
    });
    expect(draft.estado).toBe("borrador");
  });
});
