import React from 'react';

const ProtectedRoute = ({ element: Element, requireAuth = true, onDeny = null }) => {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  if (requireAuth && !isAuthenticated) {
    return typeof onDeny === 'function' ? onDeny() : null;
  }

  return <Element />;
};

export default ProtectedRoute;
