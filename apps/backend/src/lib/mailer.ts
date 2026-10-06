import nodemailer from "nodemailer";
import { config } from "./config.js";

const { smtp } = config;

export const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function buildResetLink(to: string, token: string): string {
  return `${config.clientOrigin}/recover/confirm?token=${token}&email=${encodeURIComponent(to)}`;
}

/**
 * Sends the password reset email. Never throws: an SMTP failure is logged so
 * the API keeps responding (and does not reveal whether the account exists).
 */
export async function sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
  const link = buildResetLink(to, token);
  const text = [
    "Recibimos una solicitud para restablecer tu contraseña de Planazo.",
    "",
    `Abre este enlace (válido por 15 minutos): ${link}`,
    "",
    `O copia este código manualmente: ${token}`,
    "",
    "Si no fuiste tú, ignora este mensaje.",
  ].join("\n");
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
  <h2 style="margin-bottom: 8px;">Restablece tu contraseña</h2>
  <p>Recibimos una solicitud para restablecer tu contraseña de Planazo.</p>
  <p>
    <a href="${escapeHtml(link)}"
       style="display: inline-block; padding: 10px 18px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px;">
      Restablecer contraseña
    </a>
  </p>
  <p>El enlace es válido por 15 minutos. Si prefieres, copia este código manualmente:</p>
  <p style="font-family: monospace; background: #f3f4f6; padding: 8px 12px; border-radius: 6px; word-break: break-all;">${escapeHtml(token)}</p>
  <p style="color: #6b7280; font-size: 13px;">Si no fuiste tú, ignora este mensaje.</p>
</div>`.trim();

  try {
    await transporter.sendMail({
      from: smtp.from,
      to,
      subject: "Restablece tu contraseña de Planazo",
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error(
      "[mailer] Could not send the password reset email:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
