import axiosInstance from '../utils/axiosInstance';
import { AuthResponse, User } from '../types/auth';

const authService = {
    signup: async (userData: any): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/signup', userData);
        return response.data;
    },

    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },

    logout: async (userId: string | number): Promise<void> => {
        await axiosInstance.post('/auth/logout', { user_id: userId });
    },

    getMe: async (): Promise<{ success: boolean; data: User }> => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    }
};

export default authService;
