const PROJECT_API_BASE_URL = 'http://34.30.147.189:5000/api/projects'; // Change if deployed

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

export const fetchLatestUserProject = async (token) => {
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

  const projects = await response.json();
  
  // Assuming projects are returned in an array and sorted by most recent first
  const latestProject = projects[0];

  if (!latestProject) throw new Error('No projects found for this user');

  return latestProject;
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
