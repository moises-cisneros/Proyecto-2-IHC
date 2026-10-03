import type { ReactNode } from "react";

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
