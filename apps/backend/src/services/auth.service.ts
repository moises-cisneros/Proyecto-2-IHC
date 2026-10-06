import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { sendPasswordResetEmail } from "../lib/mailer.js";

const BCRYPT_COST = 10;
const RESET_TTL_MS = 15 * 60 * 1000;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  ok: boolean;
  user?: User;
  conflict?: boolean;
}

export interface ConfirmResetResult {
  ok: boolean;
  error?: "invalid_or_expired";
}

export const authService = {
  async register({ name, email, password }: RegisterInput): Promise<RegisterResult> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { ok: false, conflict: true };
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return { ok: true, user };
  },

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  },

  async requestReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = randomBytes(24).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: sha256(token),
        resetTokenExpiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    // Fire-and-forget: sendPasswordResetEmail never rejects and must not delay the response.
    void sendPasswordResetEmail(user.email, token);
  },

  async confirmReset(email: string, token: string, newPassword: string): Promise<ConfirmResetResult> {
    const user = await prisma.user.findUnique({ where: { email } });
    const valid =
      user !== null &&
      user.resetTokenHash === sha256(token) &&
      user.resetTokenExpiresAt !== null &&
      user.resetTokenExpiresAt.getTime() > Date.now();

    if (!user || !valid) {
      return { ok: false, error: "invalid_or_expired" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(newPassword, BCRYPT_COST),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    return { ok: true };
  },
};
