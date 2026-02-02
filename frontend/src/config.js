const envApiUrl = process.env.REACT_APP_API_URL;
const envUploadsUrl = process.env.REACT_APP_UPLOADS_URL;

export const API_URL = envApiUrl || "http://192.168.254.234:3000/api";
export const UPLOADS_URL = envUploadsUrl || "http://192.168.254.234:3000/uploads";

if (envApiUrl) {
    console.log("✅ CONFIG: API_URL loaded from .env ->", API_URL);
} else {
    console.warn("⚠️ CONFIG: REACT_APP_API_URL not found in .env, falling back to ->", API_URL);
}
