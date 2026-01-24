import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://pesocode-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token automatically
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

export const authService = {
  // 🔐 SIGNUP
  signup: async ({ email, password }) => {
    try {
      const response = await api.post("/auth/signup", {
        email,
        password,
      });

      // ✅ Save token if backend sends it
      if (response.data?.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      // ✅ IMPORTANT: throw Error object with better messages
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed. Please try again.";
      throw new Error(errorMsg);
    }
  },

  // 🔐 LOGIN
  login: async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  },

  // 👤 GET PROFILE
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch profile."
      );
    }
  },

  // ✏️ UPDATE PROFILE
  updateProfile: async (formData) => {
    try {
      const hasFiles =
        formData instanceof FormData ||
        formData.profile_photo instanceof File ||
        formData.cover_photo instanceof File;

      if (hasFiles) {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            data.append(key, value);
          }
        });

        const response = await api.put("/auth/profile", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
      }

      const response = await api.put("/auth/profile", formData);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Profile update failed.";
      throw new Error(errorMsg);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
