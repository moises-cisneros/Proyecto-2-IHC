import type { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE, verifySession } from "../lib/session.js";
import { prisma } from "../lib/prisma.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    const userId = typeof token === "string" ? verifySession(token) : null;
    const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    if (!user) {
      res.status(401).json({ message: "No autenticado" });
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
