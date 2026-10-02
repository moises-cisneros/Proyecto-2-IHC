import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Mark, PrimaryButton, Screen } from "../components/ui";

export default function MyPlansPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <Screen>
      <Mark />
      <h1 className="text-heading">Hola, {user?.name}</h1>
      <div className="mt-l border-t border-border pt-l">
        <div className="rounded-base border border-border bg-card p-xl">
          <p className="text-body text-text-muted">
            Aquí aparecerán tus planes. Por ahora todavía no hay ninguno.
          </p>
        </div>
        <div className="mt-l">
          <PrimaryButton type="button" onClick={handleLogout} disabled={pending}>
            {pending ? "Cerrando…" : "Cerrar sesión"}
          </PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}
