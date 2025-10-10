import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext); // ✅ 1. Get the loading state
  const location = useLocation();

  // ✅ 2. Wait for the authentication check to complete
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  // ✅ 3. Now, perform the checks after loading is false
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;