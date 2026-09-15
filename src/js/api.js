const API_URL = "http://localhost:3000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function fetchTasksApi() {
  return request("/tasks");
}

export async function fetchCommentsApi(taskId) {
  return request(`/comments?taskId=${taskId}`);
}

export async function createTaskApi(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });
}

export async function updateTaskApi(id, task) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task)
  });
}

export async function updateTaskStatusApi(id, status) {
  return request(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

export async function deleteTaskApi(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
}

export async function createCommentApi(comment) {
  return request("/comments", {
    method: "POST",
    body: JSON.stringify(comment)
  });
}