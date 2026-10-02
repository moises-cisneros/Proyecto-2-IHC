import { useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Lock, Mail, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { Button } from "@/components/ui/button";
import { Field } from "../components/atoms/Field";
import { TextLink } from "../components/atoms/TextLink";
import { ErrorAlert } from "../components/molecules/Notices";
import { AuthDialog, AuthFooter } from "../components/templates/AuthDialog";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = "Ingresa tu nombre.";
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Ingresa un correo válido.";
    if (password.length < 8) nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/mis-planes", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        setFormError(error.message);
      } else {
        setFormError("No se pudo crear la cuenta.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthDialog
      title="Crear cuenta"
      description="Regístrate y empieza a organizar planes con tu grupo."
      icon={UserPlus}
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <ErrorAlert message={formError} />
        <Field
          id="name"
          label="Nombre"
          icon={User}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
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
          label="Contraseña (mínimo 8 caracteres)"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
          {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {submitting ? "Creando…" : "Crear cuenta"}
        </Button>
      </form>
      <AuthFooter>
        <span>¿Ya tienes cuenta?</span>
        <TextLink to="/login">Iniciar sesión</TextLink>
      </AuthFooter>
    </AuthDialog>
  );
}
