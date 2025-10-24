// authService.js
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

/**
 * Fetch all roles from backend
 * returns an array
 */
export async function fetchRoles() {
  const res = await fetch(`${API_BASE}/api/roles/all`);
  if (!res.ok) throw new Error(`Could not load roles: ${res.status}`);
  return res.json();
}

/**
 * Create a new user
 * payload should be an object matching backend shape
 */
export async function createUser(payload) {
  const res = await fetch(`${API_BASE}/api/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error ${res.status}`);
  }
  return res.json();
}
