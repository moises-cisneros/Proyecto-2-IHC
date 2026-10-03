import type { InputHTMLAttributes } from "react";

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
