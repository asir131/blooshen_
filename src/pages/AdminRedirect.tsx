import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminRedirect = () => {
  const { user, loading, isMasterAdmin, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (isMasterAdmin) return <Navigate to="/admin/master" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/" replace />;
};

export default AdminRedirect;
