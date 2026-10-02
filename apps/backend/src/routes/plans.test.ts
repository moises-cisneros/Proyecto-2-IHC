import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { config } from "../lib/config.js";
import { SESSION_COOKIE } from "../lib/session.js";
import type { PlansStore, StoredPlan } from "./plans.js";

const users = vi.hoisted(
  () => new Map<string, { id: string; email: string; name: string; passwordHash: string }>(),
);

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: async ({ where }: { where: { id: string } }) => users.get(where.id) ?? null,
    },
  },
}));

function createMemoryStore(): PlansStore {
  const rows: Array<StoredPlan & { userId: string }> = [];
  let counter = 0;
  return {
    async list(userId) {
      return rows.filter((row) => row.userId === userId);
    },
    async create(userId, data) {
      counter += 1;
      const row = {
        id: randomUUID(),
        userId,
        description: data.description,
        dueDate: new Date(`${data.dueDate}T00:00:00.000Z`),
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, 0, counter)),
      };
      rows.push(row);
      return row;
    },
  };
}

const cookieFor = (userId: string) =>
  `${SESSION_COOKIE}=${jwt.sign({ sub: userId }, config.jwtSecret)}`;

const body = { description: "Cena de grupo", dueDate: "2026-12-24" };

describe("plans router", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    users.clear();
    users.set("u1", { id: "u1", email: "a@x.com", name: "Ana", passwordHash: "x" });
    users.set("u2", { id: "u2", email: "b@x.com", name: "Beto", passwordHash: "x" });
    app = createApp({ plansStore: createMemoryStore() });
  });

  it("creates a plan (201) and lists it with a YYYY-MM-DD due date", async () => {
    const created = await request(app).post("/api/plans").set("Cookie", cookieFor("u1")).send(body);
    expect(created.status).toBe(201);
    expect(created.body.plan).toMatchObject(body);
    expect(created.body.plan.id).toBeTypeOf("string");

    const listed = await request(app).get("/api/plans").set("Cookie", cookieFor("u1"));
    expect(listed.status).toBe(200);
    expect(listed.body.plans).toHaveLength(1);
    expect(listed.body.plans[0]).toMatchObject(body);
  });

  it("generates the id server-side and ignores any client-sent id or code", async () => {
    const res = await request(app)
      .post("/api/plans")
      .set("Cookie", cookieFor("u1"))
      .send({ ...body, id: "client-id", code: "PLAN-001" });
    expect(res.status).toBe(201);
    expect(res.body.plan.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(res.body.plan.id).not.toBe("client-id");
    expect(res.body.plan).not.toHaveProperty("code");
  });

  it("generates a distinct id for each plan, even with identical content", async () => {
    const a = await request(app).post("/api/plans").set("Cookie", cookieFor("u1")).send(body);
    const b = await request(app).post("/api/plans").set("Cookie", cookieFor("u1")).send(body);
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
    expect(a.body.plan.id).not.toBe(b.body.plan.id);
  });

  it("trims input before saving", async () => {
    const res = await request(app)
      .post("/api/plans")
      .set("Cookie", cookieFor("u1"))
      .send({ description: " hola ", dueDate: "2026-01-02" });
    expect(res.status).toBe(201);
    expect(res.body.plan).toMatchObject({ description: "hola" });
  });

  it("rejects invalid bodies with 400 and errors keyed by field", async () => {
    const res = await request(app)
      .post("/api/plans")
      .set("Cookie", cookieFor("u1"))
      .send({ description: "   ", dueDate: "2026-02-30" });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.errors).sort()).toEqual(["description", "dueDate"]);
  });

  it("responds 401 without a session", async () => {
    expect((await request(app).get("/api/plans")).status).toBe(401);
    const post = await request(app).post("/api/plans").send(body);
    expect(post.status).toBe(401);
    const listed = await request(app).get("/api/plans").set("Cookie", cookieFor("u1"));
    expect(listed.body.plans).toEqual([]);
  });

  it("isolates plans per user and allows identical content for different users", async () => {
    await request(app).post("/api/plans").set("Cookie", cookieFor("u1")).send(body);
    const other = await request(app).post("/api/plans").set("Cookie", cookieFor("u2")).send(body);
    expect(other.status).toBe(201);

    const first = await request(app).get("/api/plans").set("Cookie", cookieFor("u1"));
    const second = await request(app).get("/api/plans").set("Cookie", cookieFor("u2"));
    expect(first.body.plans).toHaveLength(1);
    expect(second.body.plans).toHaveLength(1);
    expect(first.body.plans[0].id).not.toBe(second.body.plans[0].id);
  });

  it("orders by due date, then by creation time", async () => {
    const send = (description: string, dueDate: string) =>
      request(app)
        .post("/api/plans")
        .set("Cookie", cookieFor("u1"))
        .send({ description, dueDate });
    await send("late", "2026-12-01");
    await send("early-first", "2026-03-01");
    await send("early-second", "2026-03-01");
    const listed = await request(app).get("/api/plans").set("Cookie", cookieFor("u1"));
    expect(listed.body.plans.map((p: { description: string }) => p.description)).toEqual([
      "early-first",
      "early-second",
      "late",
    ]);
  });
});
