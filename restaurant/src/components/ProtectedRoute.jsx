import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role.toLowerCase() !== "admin")
    return <Navigate to="/" />;

  return children;
}
