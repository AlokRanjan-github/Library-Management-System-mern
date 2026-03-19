import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, guestOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token and not guestOnly, redirect to login
  if (!token && !guestOnly) {
    return <Navigate to="/login" replace />;
  }

  // If guestOnly is true and user is logged in, redirect to Home
  if (guestOnly && token) {
    return <Navigate to="/" replace />;
  }

  // If role is required and does not match, redirect to Home or Unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
