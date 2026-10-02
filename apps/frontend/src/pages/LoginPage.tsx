import { useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Lock, LogIn, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { Button } from "@/components/ui/button";
import { Field } from "../components/atoms/Field";
import { TextLink } from "../components/atoms/TextLink";
import { ErrorAlert } from "../components/molecules/Notices";
import { AuthDialog, AuthFooter } from "../components/templates/AuthDialog";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Ingresa un correo válido.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from ?? "/mis-planes", { replace: true });
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthDialog
      title="Iniciar sesión"
      description="Entra para ver y organizar los planes de tu grupo."
      icon={LogIn}
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
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
        <Field
          id="password"
          label="Contraseña"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
          {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <AuthFooter>
        <TextLink to="/recover">¿Olvidaste tu contraseña?</TextLink>
        <TextLink to="/register">Crear cuenta</TextLink>
      </AuthFooter>
    </AuthDialog>
  );
}
