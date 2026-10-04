import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { ErrorAlert, Field, FormCard, PrimaryButton, linkClass } from "../components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLOR_CYCLE = [
  { name: "Rojo", bg: "#dc2626", text: "#ffffff" },
  { name: "Amarillo", bg: "#facc15", text: "#1f1b2e" },
  { name: "Verde", bg: "#16a34a", text: "#ffffff" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const [colorIndex, setColorIndex] = useState(0);
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
    <FormCard title="Iniciar sesión">
      <form onSubmit={handleSubmit} noValidate>
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
        <Field
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </PrimaryButton>

        <div className="mt-m pt-m border-t border-border flex flex-col items-center gap-s">
          <span className="text-caption text-text-muted">Botón de prueba:</span>
          <button
            type="button"
            data-testid="color-test-button"
            onClick={() => setColorIndex((prev) => (prev + 1) % COLOR_CYCLE.length)}
            style={{
              backgroundColor: COLOR_CYCLE[colorIndex].bg,
              color: COLOR_CYCLE[colorIndex].text,
            }}
            className="w-full min-h-11 rounded-pill py-s font-semibold text-button transition-colors duration-200 cursor-pointer shadow-xs"
          >
            Color: {COLOR_CYCLE[colorIndex].name} (clic para cambiar)
          </button>
        </div>
      </form>
      <p className="mt-l text-body text-text-muted">
        <Link to="/recover" className={linkClass}>
          ¿Olvidaste tu contraseña?
        </Link>
        {" · "}
        <Link to="/register" className={linkClass}>
          Crear cuenta
        </Link>
      </p>
    </FormCard>
  );
}
