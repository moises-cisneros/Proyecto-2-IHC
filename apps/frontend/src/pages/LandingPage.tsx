import { Link } from "react-router-dom";
import { Mark, Screen } from "../components/ui";

export default function LandingPage() {
  return (
    <Screen>
      <Mark />
      <h1 className="text-[clamp(3.5rem,10vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
        Planazo
      </h1>
      <p className="mt-l border-t border-border pt-m text-[clamp(1.35rem,3vw,1.8rem)] leading-tight text-text-muted">
        Ayudar a un grupo
        <br />
        a organizar un plan.
      </p>
      <nav aria-label="Acceso" className="mt-xl flex flex-wrap gap-m">
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center rounded-pill bg-primary px-l text-button text-on-primary"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="inline-flex min-h-11 items-center rounded-pill border border-primary px-l text-button text-primary"
        >
          Crear cuenta
        </Link>
      </nav>
    </Screen>
  );
}
