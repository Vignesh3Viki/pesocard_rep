import { UPLOADS_URL } from "../config";

/**
 * Construct a valid image URL
 * Handles both Cloudinary URLs and relative paths
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // If URL is already absolute (http:// or https://), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Otherwise, prepend the uploads URL
  // Ensure we don't end up with double slashes if url starts with /
  const base = UPLOADS_URL.endsWith("/")
    ? UPLOADS_URL.slice(0, -1)
    : UPLOADS_URL;
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${base}${path}`;
};
