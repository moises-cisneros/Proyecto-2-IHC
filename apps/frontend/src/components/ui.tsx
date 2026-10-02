import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export function Mark() {
  return (
    <Link
      to="/"
      className="mb-l block w-fit rounded-pill bg-second-surface px-s py-xs text-label uppercase tracking-wide text-on-second-surface"
    >
      Planazo
    </Link>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-180 flex-col justify-center px-l pb-xl pt-xl">
      {children}
    </main>
  );
}

export function LoadingScreen() {
  return (
    <Screen>
      <p role="status" className="text-text-muted">
        Cargando…
      </p>
    </Screen>
  );
}

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Screen>
      <Mark />
      <h1 className="text-heading">{title}</h1>
      <div className="mt-l border-t border-border pt-l">{children}</div>
    </Screen>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function Field({ id, label, error, ...props }: FieldProps) {
  return (
    <div className="mb-m">
      <label htmlFor={id} className="mb-xs block text-label">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-11 w-full rounded-sm border border-border-strong bg-card px-m py-s text-body focus:outline-2 focus:outline-primary"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-xs text-label text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mb-m rounded-sm border border-error bg-[color-mix(in_srgb,var(--color-error)_8%,var(--color-card))] px-m py-s text-label text-error"
    >
      {message}
    </p>
  );
}

export function SuccessNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mb-m rounded-sm border border-success bg-card px-m py-s text-label text-text"
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="min-h-11 rounded-pill bg-primary px-l py-s text-button text-on-primary disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

export const linkClass = "font-semibold text-primary underline underline-offset-2";
