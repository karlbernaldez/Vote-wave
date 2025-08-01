import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element: Element, requireAuth = true, onDeny = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Check authentication and the user's role
  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem('authToken');
    const refreshToken = document.cookie.match('(^|;)\\s*refreshToken\\s*=\\s*([^;]+)')?.pop(); // Extract refresh token from cookies

    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // If the access token is present, check if it's expired
    const isAccessTokenExpired = isTokenExpired(accessToken);
    if (isAccessTokenExpired && refreshToken) {
      try {
        // Try to refresh the token using the refresh token
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          localStorage.setItem('authToken', newAccessToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(true);
      const decoded = jwtDecode(accessToken);
      setUserRole(decoded.role); // Set user role from decoded token
    }

    setIsLoading(false);
  };

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Check if token is expired
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include', // Make sure cookies are sent
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token.');
      }

      const data = await response.json();
      return data.accessToken; // Return new access token
    } catch (err) {
      console.error('Error refreshing access token:', err);
      return null;
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Show a loading spinner while checking the authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If authentication is required and the user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return typeof onDeny === 'function' ? onDeny() : navigate('/login');
  }

  // If the user is not an admin, deny access
  if (userRole !== 'admin') {
    return typeof onDeny === 'function' ? onDeny() : navigate('/unauthorized'); // Redirect to an unauthorized page if role doesn't match
  }

  return <Element />;
};

export default ProtectedAdminRoute;
