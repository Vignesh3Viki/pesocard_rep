import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const contactService = {
  // Add a new contact
  addContact: async (contactData) => {
    try {
      const response = await api.post("/contacts", contactData);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add contact";
      throw new Error(errorMsg);
    }
  },

  // Get all contacts
  getContacts: async () => {
    try {
      const response = await api.get("/contacts");
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contacts";
      throw new Error(errorMsg);
    }
  },

  // Get a specific contact
  getContact: async (contactId) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contact";
      throw new Error(errorMsg);
    }
  },

  // Update a contact
  updateContact: async (contactId, contactData) => {
    try {
      const response = await api.put(`/contacts/${contactId}`, contactData);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update contact";
      throw new Error(errorMsg);
    }
  },

  // Delete a contact
  deleteContact: async (contactId) => {
    try {
      const response = await api.delete(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete contact";
      throw new Error(errorMsg);
    }
  },
};

export default contactService;
