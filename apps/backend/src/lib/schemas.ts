import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Correo electrónico inválido"));

const password = z.string().min(8, "La contraseña debe tener al menos 8 caracteres");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const recoverSchema = z.object({ email });

export const recoverConfirmSchema = z.object({
  email,
  token: z.string().min(1, "El token es obligatorio"),
  newPassword: password,
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "body");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}
