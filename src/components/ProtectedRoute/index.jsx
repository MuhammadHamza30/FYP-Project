import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { readSession, roleOf, dashboardFor } from "../../utils/session";
export const ProtectedRoute = ({ role }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  if (role === "admin")
    return readSession("spms-admin")?.isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate to="/admin" replace />
    );
  if (!isAuthenticated || !user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roleOf(user) !== role)
    return <Navigate to={dashboardFor(user)} replace />;
  return <Outlet />;
};
