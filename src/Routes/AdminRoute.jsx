import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import useUserRole from "../Hooks/UseUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // correct destructuring
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  // Show loading spinner while auth or role is loading
  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // If user is not logged in or not an admin, redirect
  if (!user || role !== "admin") {
    return (
      <Navigate to="/forbidden" replace state={{ from: location.pathname }} />
    );
  }

  // User is admin, render children
  return children;
};

export default AdminRoute;
