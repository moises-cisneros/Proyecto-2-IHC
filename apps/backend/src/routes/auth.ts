import { Router, type Request, type Response, type NextFunction } from "express";
import type { User } from "@prisma/client";
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
import { authService } from "../services/auth.service.js";

const INVALID_CREDENTIALS = "Correo o contraseña incorrectos";

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
    const result = await authService.register(parsed.data);
    if (!result.ok || !result.user) {
      res.status(409).json({ message: "Ya existe una cuenta con ese correo" });
      return;
    }
    issueSession(res, result.user.id);
    res.status(201).json({ user: toPublicUser(result.user) });
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
    const user = await authService.authenticate(email, password);
    if (!user) {
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
    await authService.requestReset(email);
    res.status(200).json({
      message: "Si el correo existe, te enviamos instrucciones de recuperación.",
    });
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
    const result = await authService.confirmReset(email, token, newPassword);
    if (!result.ok) {
      res.status(400).json({ message: "Token inválido o expirado" });
      return;
    }
    res.status(200).json({ message: "Contraseña actualizada" });
  }),
);
