import { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Legacy flag — equivalent to requiredRole="admin" */
  requireAdmin?: boolean;
  /** Minimum role required to view the route */
  requiredRole?: Extract<AppRole, "admin" | "master_admin">;
}

const ProtectedRoute = ({ children, requireAdmin = false, requiredRole }: ProtectedRouteProps) => {
  const { user, isAdmin, isMasterAdmin, loading } = useAuth();
  const location = useLocation();

  const effectiveRole: "admin" | "master_admin" | null =
    requiredRole ?? (requireAdmin ? "admin" : null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (effectiveRole) {
    const hasAccess = effectiveRole === "master_admin" ? isMasterAdmin : isAdmin;
    if (!hasAccess) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="mb-2 font-heading text-2xl font-bold uppercase tracking-wider text-foreground">
              Access Denied
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              You don't have permission to view this page.{" "}
              {effectiveRole === "master_admin" ? "Master admin" : "Admin"} access is required.
            </p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
