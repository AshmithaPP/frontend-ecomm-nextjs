export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Derived base URL from API URL if image base URL is not explicitly configured
const getFallbackImageBase = () => {
  if (process.env.NEXT_PUBLIC_IMAGE_BASE_URL) {
    return process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Remove '/api' from the end of the URL to get the host base
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  return 'http://localhost:5000';
};

export const IMAGE_BASE = getFallbackImageBase();

