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

/**
 * Resolves media URLs by mapping localhost absolute addresses to the correct IMAGE_BASE
 * so they load correctly in live production environments, while keeping external URLs and
 * relative paths properly handled.
 */
export const resolveMediaUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string') return '';
  
  // Expose backend API host base
  const apiHost = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
    : 'http://localhost:5000';

  // If it starts with local development backend URL, replace it
  if (url.startsWith('http://localhost:5000')) {
    if (url.includes('/uploads/reviews/')) {
      return url.replace('http://localhost:5000', apiHost);
    }
    return url.replace('http://localhost:5000', IMAGE_BASE);
  }
  if (url.startsWith('https://localhost:5000')) {
    if (url.includes('/uploads/reviews/')) {
      return url.replace('https://localhost:5000', apiHost);
    }
    return url.replace('https://localhost:5000', IMAGE_BASE);
  }
  if (url.startsWith('http://127.0.0.1:5000')) {
    if (url.includes('/uploads/reviews/')) {
      return url.replace('http://127.0.0.1:5000', apiHost);
    }
    return url.replace('http://127.0.0.1:5000', IMAGE_BASE);
  }
  if (url.startsWith('https://127.0.0.1:5000')) {
    if (url.includes('/uploads/reviews/')) {
      return url.replace('https://127.0.0.1:5000', apiHost);
    }
    return url.replace('https://127.0.0.1:5000', IMAGE_BASE);
  }

  // If it's already an absolute external URL (e.g. S3 bucket, third-party, etc.), keep it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a review asset relative path, resolve it using the active backend API host instead of IMAGE_BASE
  if (url.includes('/uploads/reviews/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${apiHost}${cleanPath}`;
  }

  // If it's a relative path, ensure it starts with / and prepend IMAGE_BASE
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${IMAGE_BASE}${cleanPath}`;
};

