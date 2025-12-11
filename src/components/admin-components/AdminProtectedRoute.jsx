import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
