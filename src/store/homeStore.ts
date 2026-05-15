import { create } from 'zustand';
import { API_BASE } from '@/config/api';

interface HomeState {
    homeData: any;
    loading: boolean;
    error: string | null;
    fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
    homeData: null,
    loading: false,
    error: null,

    fetchHomeData: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE}/home`);
            if (!response.ok) throw new Error('Failed to fetch homepage data');
            const result = await response.json();
            if (result.success) {
                set({ homeData: result.data, loading: false });
            } else {
                set({ error: result.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
