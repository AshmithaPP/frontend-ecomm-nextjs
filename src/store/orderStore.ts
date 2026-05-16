import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';
import { useCartStore } from './cartStore';
import { API_BASE } from '@/config/api';
import { usePayment } from './paymentStore';

interface OrderState {
    orders: any[];
    currentOrder: any | null;
    loading: boolean;
    error: string | null;
    getHeaders: () => { headers: { Authorization: string; 'x-guest-id': string | null } };
    placeOrder: (orderPayload: any) => Promise<any>;
    fetchOrderDetails: (orderId: string) => Promise<void>;
    fetchOrders: (page?: number, limit?: number) => Promise<void>;
    cancelOrder: (orderId: string) => Promise<any>;
    trackOrder: (orderId: string) => Promise<any>;
}


export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,

    getHeaders: () => {
        const { token } = useAuthStore.getState();
        const { guestId } = useCartStore.getState();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-guest-id': guestId
            }
        };
    },

    // 1. Create Internal Order
    placeOrder: async (orderPayload) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_BASE}/orders`, orderPayload, get().getHeaders());
            const orderId = response.data.data.order_id;
            
            // If Razorpay, initiate payment immediately
            if (orderPayload.payment_method === 'razorpay') {
                return await usePayment.getState().initiateRazorpayPayment(orderId);
            }

            // For COD or others
            set({ loading: false });
            useCartStore.getState().fetchCart(); // Refresh cart
            return { success: true, data: response.data.data };
        } catch (error: any) {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }
            const msg = error.response?.data?.message || 'Failed to place order';
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    // Removed initiateRazorpayPayment and verifyPayment as they are now in paymentStore.ts


    fetchOrderDetails: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE}/orders/${orderId}`, get().getHeaders());
            set({ currentOrder: response.data.data, loading: false });
        } catch (error: any) {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }
            set({ error: 'Failed to fetch order', loading: false });
        }
    },

    fetchOrders: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE}/orders?page=${page}&limit=${limit}`, get().getHeaders());
            set({ orders: response.data.orders, loading: false });
        } catch (error: any) {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }
            set({ error: 'Failed to fetch orders', loading: false });
        }
    },

    cancelOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_BASE}/orders/${orderId}/cancel`, {}, get().getHeaders());
            // Update local state
            const updatedOrders = get().orders.map(o => 
                o.order_id === orderId ? { ...o, status: 'cancelled' } : o
            );
            set({ orders: updatedOrders, loading: false });
            return { success: true, message: response.data.message };
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Cancellation failed';
            set({ loading: false, error: msg });
            return { success: false, message: msg };
        }
    },

    trackOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_BASE}/orders/${orderId}/track`, get().getHeaders());
            set({ loading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ loading: false, error: 'Tracking failed' });
            return { success: false, message: 'Tracking failed' };
        }
    }
}));
