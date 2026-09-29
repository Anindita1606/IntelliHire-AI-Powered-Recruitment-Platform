import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../common/Spinner";
import type { UserRole } from "../../types";

/**
 * Guards private routes. Unauthenticated users are redirected to /login,
 * preserving the attempted destination so they return after signing in.
 */
export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}) {
  const { isAuthenticated, user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoadingUser) {
    return <div className="container-page flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    const fallback = user?.role === "EMPLOYER" ? "/recruiter" : "/candidate";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
