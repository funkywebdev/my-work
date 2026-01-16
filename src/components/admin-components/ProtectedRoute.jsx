import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("schoolToken");
  const adminToken = localStorage.getItem("adminToken");


  if (!token && !adminToken) {
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet/>;
};

export default ProtectedRoute;
