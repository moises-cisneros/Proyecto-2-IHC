import { LoaderCircle } from "lucide-react";
import { LogoMark } from "../atoms/Logo";

export function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-mesh">
      <div role="status" className="flex flex-col items-center gap-4 text-muted-foreground">
        <LogoMark className="size-14 animate-pulse" />
        <p className="flex items-center gap-2 text-sm font-semibold">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          Cargando…
        </p>
      </div>
    </main>
  );
}
