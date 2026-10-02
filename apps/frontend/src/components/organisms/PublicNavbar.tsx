import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "../atoms/Logo";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
      <nav
        aria-label="Acceso"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        <Link
          to="/"
          className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Crear cuenta</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
