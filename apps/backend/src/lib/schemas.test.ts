import { describe, expect, it } from "vitest";
import { fieldErrors, planSchema, updatePlanStatusSchema } from "./schemas.js";

const valid = { description: "Cena de grupo", dueDate: "2026-12-24", estado: "pendiente" };

describe("planSchema", () => {
  it("accepts valid input and trims whitespace", () => {
    const result = planSchema.safeParse({
      description: "  Cena de grupo  ",
      dueDate: "2026-12-24",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(valid);
    }
  });

  it("rejects empty and whitespace-only description", () => {
    const result = planSchema.safeParse({ ...valid, description: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["description"]);
    }
  });

  it("rejects over-long description (>500)", () => {
    const longDesc = planSchema.safeParse({ ...valid, description: "d".repeat(501) });
    expect(longDesc.success).toBe(false);
    expect(planSchema.safeParse({ ...valid, description: "d".repeat(500) }).success).toBe(true);
  });

  it("rejects malformed and impossible dates", () => {
    for (const dueDate of ["", "24/12/2026", "2026-13-01", "2026-02-30", "2025-02-29", "abc"]) {
      const result = planSchema.safeParse({ ...valid, dueDate });
      expect(result.success, dueDate).toBe(false);
      if (!result.success) expect(fieldErrors(result.error)).toHaveProperty("dueDate");
    }
  });

  it("accepts a leap-day and past dates", () => {
    expect(planSchema.safeParse({ ...valid, dueDate: "2028-02-29" }).success).toBe(true);
    expect(planSchema.safeParse({ ...valid, dueDate: "2001-01-01" }).success).toBe(true);
  });

  it("rejects missing fields", () => {
    const result = planSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["description", "dueDate"]);
    }
  });

  it("strips client-sent id and code from the parsed data", () => {
    const result = planSchema.safeParse({ ...valid, id: "evil", code: "PLAN-001" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(valid);
  });

  it("accepts valid estado values (hecho, retrasado, pendiente)", () => {
    for (const estado of ["hecho", "retrasado", "pendiente"] as const) {
      const result = planSchema.safeParse({ description: "Plan test", dueDate: "2026-12-24", estado });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.estado).toBe(estado);
    }
  });

  it("defaults estado to pendiente when omitted", () => {
    const result = planSchema.safeParse({ description: "Plan test", dueDate: "2026-12-24" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.estado).toBe("pendiente");
  });

  it("rejects invalid estado values", () => {
    const result = planSchema.safeParse({ ...valid, estado: "archivado" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toHaveProperty("estado");
    }
  });
});

describe("updatePlanStatusSchema", () => {
  it("accepts valid estado transitions", () => {
    for (const estado of ["hecho", "retrasado", "pendiente"] as const) {
      const result = updatePlanStatusSchema.safeParse({ estado });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.estado).toBe(estado);
    }
  });

  it("rejects invalid or missing estado", () => {
    expect(updatePlanStatusSchema.safeParse({}).success).toBe(false);
    expect(updatePlanStatusSchema.safeParse({ estado: "invalido" }).success).toBe(false);
  });
});
