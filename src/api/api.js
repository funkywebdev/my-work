import axios from "axios";

// Base URL for backend
const BASE_URL = "https://bql-production.up.railway.app";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// ----------------- SCHOOLS -----------------

// Get all schools (public)
export const getAllSchools = () => api.get("/schools/all");

// Register a school (with FormData)
export const registerSchool = (formData) =>
  api.post("/schools/register", formData);

// Update a school (requires auth token)
export const updateSchool = (schoolId, token, data) =>
  api.patch(`/schools/${schoolId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a school (requires auth token)
export const deleteSchool = (schoolId, token) =>
  api.delete(`/schools/${schoolId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Export axios instance
export default api;
