import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { AppShell, LoadingScreen } from "../components/domain";


export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/mis-planes" replace />;
  return <Outlet />;
}
