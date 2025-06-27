import { jwtDecode } from 'jwt-decode';
const API_BASE_URL = 'http://34.30.147.189:5000/api/features'; // Adjust if using a different port

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);  // Decode the JWT
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if token has expired
    if (decodedToken.exp < currentTime) {
      console.error('[ERROR] Token has expired');
      return false;
    }

    console.log('[DEBUG] Token is valid');
    return true;
  } catch (error) {
    console.error('[ERROR] Invalid token:', error);
    return false;
  }
};

export const saveFeature = async (feature, token) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(feature),
  });
  if (!response.ok) throw new Error('Failed to save feature');
  return response.json();
};

export const fetchFeatures = async (token) => {
  // Check if the token is valid
  if (!isTokenValid(token)) {
    console.log('[ERROR] Invalid or expired token. Deleting authToken from localStorage.');

    // Remove the token from localStorage if invalid
    localStorage.removeItem('authToken');

    // Optionally, redirect the user to the login page
    alert('Session expired. Please log in again.');
    window.location.href = '/login'; // Redirect to the login page

    return;
  }

  const projectId = localStorage.getItem('projectId');
  if (!projectId) throw new Error('Missing projectId.');

  const queryParams = new URLSearchParams({ projectId });

  const response = await fetch(`${API_BASE_URL}/my-projects?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('[ERROR] Failed to fetch features:', response.status, response.statusText);
    throw new Error('Failed to fetch features');
  }

  return response.json();
};

export const deleteFeature = async (sourceId, token) => {
  const response = await fetch(`${API_BASE_URL}/${sourceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete feature');
  }
  return response.json();
};
