// Base URL for the API
const API_BASE_URL = "https://recruter-backend.vercel.app/api"

// Types
export interface User {
  id: string
  username: string
  fullName?: string
  role: "admin" | "user"
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  status: "in_progress" | "done"
}

// Auth API calls
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Login failed")
  }

  return response.json()
}

export async function registerUser(fullName: string, username: string, password: string, role = "user") {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, username, password, role }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Registration failed")
  }

  return response.json()
}

// Tasks API calls
export async function getTasks(token: string) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to fetch tasks")
  }

  return response.json()
}

export async function getTask(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to fetch task")
  }

  return response.json()
}

export async function createTask(taskData: Omit<Task, "id">, token: string) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to create task")
  }

  return response.json()
}

export async function updateTask(id: string, taskData: Partial<Task>, token: string) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to update task")
  }

  return response.json()
}

export async function deleteTask(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to delete task")
  }

  return response.json()
}

// Users API calls
export async function getUsers(token: string) {
  console.log("Token envoyé :", token); // 👀 Vérifie si le token est bien transmis

  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erreur API getUsers:", errorText);
    throw new Error(errorText || "Failed to fetch users");
  }

  return response.json();
}

