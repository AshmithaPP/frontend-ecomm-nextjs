import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { API_BASE } from '@/config/api';
import authService from '../services/authService';
import { useCartStore } from './cartStore';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: any, token: string) => void;
    login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
    signup: (userData: any) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => void;
    checkSession: () => Promise<void>;
    updateUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user_id', user.id || user.user_id);
                }
                set({ user, token, isAuthenticated: true });
            },

            login: async (credentials: any) => {
                try {
                    const response = await authService.login(credentials);
                    if (response.success) {
                        get().setAuth(response.data.user, response.data.accessToken);
                        // Merge guest cart into user cart after login
                        try {
                            await useCartStore.getState().mergeCart();
                        } catch (mergeErr) {
                            console.warn('Cart merge after login failed:', mergeErr);
                        }
                        return { success: true };
                    }
                    return { success: false, message: response.message };
                } catch (error: any) {
                    return { success: false, message: error.response?.data?.message || 'Login failed' };
                }
            },

            signup: async (userData: any) => {
                try {
                    const response = await authService.signup(userData);
                    if (response.success) {
                        get().setAuth(response.data.user, response.data.accessToken);
                        // Merge guest cart into user cart after signup
                        try {
                            await useCartStore.getState().mergeCart();
                        } catch (mergeErr) {
                            console.warn('Cart merge after signup failed:', mergeErr);
                        }
                        return { success: true };
                    }
                    return { success: false, message: response.message };
                } catch (error: any) {
                    return { success: false, message: error.response?.data?.message || 'Signup failed' };
                }
            },

            logout: async () => {
                const { user } = get();
                const userId = user?.id || user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('user_id') : null);

                try {
                    if (userId) {
                        await fetch(`${API_BASE}/auth/logout`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user_id: userId }),
                        });
                    }
                } catch (error) {
                    console.error('Logout API error:', error);
                } finally {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('wishlistItems');
                        localStorage.removeItem('cartItems');
                    }
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },

            checkAuth: () => {
                const state = get();
                if (state.token && state.user) {
                    set({ isAuthenticated: true });
                } else {
                    set({ isAuthenticated: false });
                }
            },

            checkSession: async () => {
                const { isAuthenticated, token } = get();
                if (isAuthenticated && token) {
                    try {
                        const response = await authService.getMe();
                        if (response.success) {
                            set({ user: response.data });
                        }
                    } catch (error) {
                        await get().logout();
                    }
                }
            },

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
