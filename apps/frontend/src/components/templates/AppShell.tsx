import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Navbar } from "../organisms/Navbar";

/** Layout for authenticated screens: navbar on top, page content below. */
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
    <>
      <Navbar name={user?.name ?? ""} onLogout={handleLogout} pending={pending} />
      <main className="mx-auto max-w-180 px-l pb-xl pt-l">{children}</main>
    </>
  );
}
