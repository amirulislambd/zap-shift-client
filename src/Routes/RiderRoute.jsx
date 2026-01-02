import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import useUserRole from "../Hooks/UseUserRole";

const RiderRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!role || role !== "rider") {
    return (
      <Navigate to="/forbidden" replace state={{ from: location.pathname }} />
    );
  }

  return children;
};

export default RiderRoute;
