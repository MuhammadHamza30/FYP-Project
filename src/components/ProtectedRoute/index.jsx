import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  isAuthenticated,
  authenticationPath,
  outlet,
}) => {
  if (isAuthenticated) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
};
