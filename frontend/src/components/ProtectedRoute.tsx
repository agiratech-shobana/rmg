// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading message while the context is checking for a user
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If not loading and there is no user, redirect to the login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If a user exists, show the page they were trying to access
  return <Outlet />;
};

export default ProtectedRoute;