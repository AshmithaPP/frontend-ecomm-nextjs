import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Required for cookies (refreshToken)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh logic for authentication endpoints (login, signup, forgot/reset password)
        const isAuthEndpoint = originalRequest.url && (
            originalRequest.url.includes('/auth/login') ||
            originalRequest.url.includes('/auth/signup') ||
            originalRequest.url.includes('/auth/forgot-password') ||
            originalRequest.url.includes('/auth/reset-password') ||
            originalRequest.url.includes('/customer/auth/')
        );

        // If error is 401, not already retried, and not an auth endpoint
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data.data;
                const { user, setAuth } = useAuthStore.getState();

                if (user) {
                    setAuth(user, accessToken);
                }

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout and redirect to login
                useAuthStore.getState().logout();
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
