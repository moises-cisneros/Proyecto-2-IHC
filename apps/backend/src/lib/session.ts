import type { Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

export const SESSION_COOKIE = "planazo_session";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: config.isProduction,
  path: "/",
};

export function issueSession(res: Response, userId: string): void {
  const token = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: "7d" });
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SEVEN_DAYS_MS });
}

export function clearSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE, cookieOptions);
}

export function verifySession(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === "object" && typeof payload.sub === "string") {
      return payload.sub;
    }
    return null;
  } catch {
    return null;
  }
}
