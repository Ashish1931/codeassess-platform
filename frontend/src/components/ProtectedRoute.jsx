import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, children }) => {
  const { user, token, isAdmin } = useAuth();

  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
