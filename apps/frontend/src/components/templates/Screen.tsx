import type { ReactNode } from "react";
import { Mark } from "../atoms/Mark";

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
