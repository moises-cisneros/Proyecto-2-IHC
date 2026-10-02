import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, KeyRound, LoaderCircle, Lock, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiError, api } from "../api/client";
import { Button } from "@/components/ui/button";
import { Field } from "../components/atoms/Field";
import { TextLink } from "../components/atoms/TextLink";
import { ErrorAlert, SuccessNotice } from "../components/molecules/Notices";
import { AuthDialog, AuthFooter } from "../components/templates/AuthDialog";

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

  const backToLogin = (
    <AuthFooter>
      <TextLink to="/login" className="inline-flex items-center gap-1.5">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a iniciar sesión
      </TextLink>
    </AuthFooter>
  );

  if (step === "done") {
    return (
      <AuthDialog
        title="Contraseña actualizada"
        description="Ya puedes entrar con tu nueva contraseña."
        icon={ShieldCheck}
      >
        <SuccessNotice>Tu contraseña se actualizó correctamente.</SuccessNotice>
        <Button asChild size="lg" className="w-full">
          <Link to="/login">Ir a iniciar sesión</Link>
        </Button>
      </AuthDialog>
    );
  }

  if (step === "confirm") {
    return (
      <AuthDialog
        title="Nueva contraseña"
        description="Ingresa el token de recuperación y elige tu nueva contraseña."
        icon={KeyRound}
      >
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
        <form onSubmit={handleConfirm} noValidate className="grid gap-4">
          <ErrorAlert message={formError} />
          <Field
            id="token"
            label="Token de recuperación"
            icon={KeyRound}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            error={errors.token}
          />
          <Field
            id="newPassword"
            label="Nueva contraseña (mínimo 8 caracteres)"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
            {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {submitting ? "Guardando…" : "Cambiar contraseña"}
          </Button>
        </form>
        {backToLogin}
      </AuthDialog>
    );
  }

  return (
    <AuthDialog
      title="Recuperar contraseña"
      description="Te enviaremos un token para que puedas crear una nueva."
      icon={KeyRound}
    >
      <form onSubmit={handleRequest} noValidate className="grid gap-4">
        <ErrorAlert message={formError} />
        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
          {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {submitting ? "Solicitando…" : "Solicitar token"}
        </Button>
      </form>
      {backToLogin}
    </AuthDialog>
  );
}
