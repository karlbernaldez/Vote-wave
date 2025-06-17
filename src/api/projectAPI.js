const PROJECT_API_BASE_URL = 'http://localhost:5000/api/projects'; // Change if deployed

// 📌 Create a new project
export const createProject = async (projectData, token) => {
  const response = await fetch(`${PROJECT_API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Project creation failed');
  }

  return response.json();
};

// 📌 Get all projects for the current user
export const fetchUserProjects = async (token) => {
  const response = await fetch(`${PROJECT_API_BASE_URL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch projects');
  }

  return response.json();
};

// 📌 Get a single project by ID
export const fetchProjectById = async (id, token) => {
  const response = await fetch(`${PROJECT_API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch project');
  }

  return response.json();
};

// 📌 Delete a project
export const deleteProjectById = async (id, token) => {
  const response = await fetch(`${PROJECT_API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete project');
  }

  return response.json();
};
