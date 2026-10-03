import { Button } from "../atoms/Button";
import { Mark } from "../atoms/Mark";
import { ProfileMenu } from "../molecules/ProfileMenu";

interface NavbarProps {
  name: string;
  onLogout: () => void;
  pending?: boolean;
}

export function Navbar({ name, onLogout, pending = false }: NavbarProps) {
  return (
    <header className="border-b border-border bg-card">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-180 flex-wrap items-center justify-between gap-x-m gap-y-s px-l py-s"
      >
        <Mark inline />
        <div className="flex flex-wrap items-center gap-m">
          <ProfileMenu name={name} />
          <Button type="button" variant="secondary" onClick={onLogout} disabled={pending}>
            {pending ? "Cerrando…" : "Cerrar sesión"}
          </Button>
        </div>
      </nav>
    </header>
  );
}
