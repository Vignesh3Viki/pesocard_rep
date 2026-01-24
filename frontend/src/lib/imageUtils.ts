/**
 * Construct a valid image URL
 * Handles both Cloudinary URLs and relative paths
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // If URL is already absolute (http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the uploads URL
  const uploadsUrl = process.env.REACT_APP_UPLOADS_URL;
  return `${uploadsUrl}${url}`;
};
