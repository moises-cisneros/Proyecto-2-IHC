import { createHash, randomBytes } from "node:crypto";
import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { clearSession, issueSession } from "../lib/session.js";
import { toPublicUser } from "../lib/publicUser.js";
import {
  fieldErrors,
  loginSchema,
  recoverConfirmSchema,
  recoverSchema,
  registerSchema,
} from "../lib/schemas.js";
import { requireAuth } from "../middleware/requireAuth.js";

const BCRYPT_COST = 10;
const RESET_TTL_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS = "Correo o contraseña incorrectos";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

type Handler = (req: Request, res: Response) => Promise<void>;
const wrap = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res).catch(next);
};

export const authRouter = Router();

authRouter.post(
  "/register",
  wrap(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Datos inválidos", errors: fieldErrors(parsed.error) });
      return;
    }
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Ya existe una cuenta con ese correo" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    issueSession(res, user.id);
    res.status(201).json({ user: toPublicUser(user) });
  }),
);

authRouter.post(
  "/login",
  wrap(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(401).json({ message: INVALID_CREDENTIALS });
      return;
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) {
      res.status(401).json({ message: INVALID_CREDENTIALS });
      return;
    }
    issueSession(res, user.id);
    res.status(200).json({ user: toPublicUser(user) });
  }),
);

authRouter.post("/logout", (_req, res) => {
  clearSession(res);
  res.status(200).json({ message: "Sesión cerrada" });
});

authRouter.get("/me", requireAuth, (_req, res) => {
  const user = res.locals.user as User;
  res.status(200).json({ user: toPublicUser(user) });
});

authRouter.post(
  "/recover",
  wrap(async (req, res) => {
    const parsed = recoverSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Datos inválidos", errors: fieldErrors(parsed.error) });
      return;
    }
    const { email } = parsed.data;
    const message =
      "Si el correo existe, se generó un token de recuperación.";
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(200).json({ message });
      return;
    }
    const token = randomBytes(24).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: sha256(token),
        resetTokenExpiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });
    res.status(200).json({ message, token });
  }),
);

authRouter.post(
  "/recover/confirm",
  wrap(async (req, res) => {
    const parsed = recoverConfirmSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Datos inválidos", errors: fieldErrors(parsed.error) });
      return;
    }
    const { email, token, newPassword } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    const valid =
      user !== null &&
      user.resetTokenHash === sha256(token) &&
      user.resetTokenExpiresAt !== null &&
      user.resetTokenExpiresAt.getTime() > Date.now();
    if (!user || !valid) {
      res.status(400).json({ message: "Token inválido o expirado" });
      return;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(newPassword, BCRYPT_COST),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });
    res.status(200).json({ message: "Contraseña actualizada" });
  }),
);
