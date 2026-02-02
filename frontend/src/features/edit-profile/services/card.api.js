import { API_URL } from "../../../config";

/**
 * Save / Update profile data
 */
export async function saveProfile(data) {
  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save profile");
  }

  return response.json();
}

/**
 * Get saved profile data
 */
export async function getProfile() {
  const response = await fetch(`${API_URL}/profile`);

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}
