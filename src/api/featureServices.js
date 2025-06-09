const API_BASE_URL = 'http://localhost:5000/api/features'; // Adjust if using a different port

export const saveFeature = async (feature) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feature),
  });
  if (!response.ok) throw new Error('Failed to save feature');
  return response.json();
};

export const fetchFeatures = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch features');
  const data = await response.json(); // Await the JSON data
  // console.log(data); // Now you log the actual parsed data

  return data;
};

export const deleteFeature = async (sourceId) => {
  const response = await fetch(`${API_BASE_URL}/${sourceId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete feature');
  }
  return response.json();
};