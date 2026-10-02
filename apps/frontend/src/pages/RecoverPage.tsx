import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError, api } from "../api/client";
import {
  ErrorAlert,
  Field,
  FormCard,
  PrimaryButton,
  SuccessNotice,
  linkClass,
} from "../components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "request" | "confirm" | "done";

export default function RecoverPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; token?: string; newPassword?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequest(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrors({ email: "Ingresa un correo válido." });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const data = await api.recover(email.trim());
      setSimulatedToken(data.token ?? null);
      setStep("confirm");
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "No se pudo solicitar el token.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const nextErrors: typeof errors = {};
    if (!token.trim()) nextErrors.token = "Ingresa el token.";
    if (newPassword.length < 8) {
      nextErrors.newPassword = "La contraseña debe tener al menos 8 caracteres.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.recoverConfirm(email.trim(), token.trim(), newPassword);
      setStep("done");
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <FormCard title="Recuperar contraseña">
        <SuccessNotice>Tu contraseña se actualizó correctamente.</SuccessNotice>
        <Link to="/login" className={linkClass}>
          Ir a iniciar sesión
        </Link>
      </FormCard>
    );
  }

  if (step === "confirm") {
    return (
      <FormCard title="Recuperar contraseña">
        <SuccessNotice>
          {simulatedToken ? (
            <>
              <strong>Token:</strong>{" "}
              <code data-testid="simulated-token" className="break-all">
                {simulatedToken}
              </code>
            </>
          ) : (
            "Si el correo existe, se generó un token de recuperación."
          )}
        </SuccessNotice>
        <form onSubmit={handleConfirm} noValidate>
          <ErrorAlert message={formError} />
          <Field
            id="token"
            label="Token de recuperación"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={errors.token}
          />
          <Field
            id="newPassword"
            label="Nueva contraseña (mínimo 8 caracteres)"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Guardando…" : "Cambiar contraseña"}
          </PrimaryButton>
        </form>
      </FormCard>
    );
  }

  return (
    <FormCard title="Recuperar contraseña">
      <form onSubmit={handleRequest} noValidate>
        <ErrorAlert message={formError} />
        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "Solicitando…" : "Solicitar token"}
        </PrimaryButton>
      </form>
      <p className="mt-l text-body text-text-muted">
        <Link to="/login" className={linkClass}>
          Volver a iniciar sesión
        </Link>
      </p>
    </FormCard>
  );
}
