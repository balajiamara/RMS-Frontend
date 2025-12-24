// src/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  // while verifying session, show loader (do not redirect yet)
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>Checking session...</div>
      </div>
    );
  }

  // after loading finished: if no user => redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // admin check
  if (adminOnly && user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
