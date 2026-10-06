import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: ReactNode }) {
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
    <div className="min-h-screen bg-background">
      <Navbar name={user?.name ?? ""} onLogout={handleLogout} pending={pending} />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">{children}</main>
    </div>
  );
}
