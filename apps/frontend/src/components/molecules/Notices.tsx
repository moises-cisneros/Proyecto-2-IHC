import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert role="alert" variant="error">
      <CircleAlert aria-hidden="true" />
      <span>{message}</span>
    </Alert>
  );
}

export function SuccessNotice({ children }: { children: ReactNode }) {
  return (
    <Alert role="status" variant="success">
      <CircleCheck aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </Alert>
  );
}
