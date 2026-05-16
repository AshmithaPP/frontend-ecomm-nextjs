import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';
import { useCartStore } from './cartStore';
import { API_BASE } from '@/config/api';

interface PaymentState {
    loading: boolean;
    error: string | null;
    getHeaders: () => any;
    initiateRazorpayPayment: (orderId: string) => Promise<{ success: boolean; message?: string; data?: any }>;
    verifyPayment: (paymentDetails: any) => Promise<{ success: boolean; message: string }>;
}

export const usePayment = create<PaymentState>((set, get) => ({
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

    initiateRazorpayPayment: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_BASE}/payments/initiate`, { order_id: orderId }, get().getHeaders() as any);
            const rzpData = response.data.data;

            return new Promise((resolve) => {
                try {
                    const options = {
                        key: rzpData.key_id,
                        amount: rzpData.amount,
                        currency: rzpData.currency,
                        name: "Saree Ecommerce",
                        description: "Order Payment",
                        order_id: rzpData.razorpay_order_id,
                        handler: async (response: any) => {
                            const verifyRes = await get().verifyPayment({
                                razorpay_order_id: rzpData.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            resolve({ success: verifyRes.success, data: { order_id: orderId } });
                        },
                        prefill: {
                            name: useAuthStore.getState().user?.name || "",
                            email: useAuthStore.getState().user?.email || "",
                        },
                        theme: { color: "#A42829" },
                        modal: {
                            ondismiss: () => {
                                set({ loading: false });
                                resolve({ success: false, message: "Payment cancelled" });
                            }
                        }
                    };

                    if (!(window as any).Razorpay) {
                        set({ loading: false, error: "Razorpay SDK not loaded" });
                        resolve({ success: false, message: "Razorpay SDK not loaded" });
                        return;
                    }

                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                } catch (err: any) {
                    set({ loading: false, error: err.message });
                    resolve({ success: false, message: err.message });
                }
            });
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Payment initialization failed';
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },


    verifyPayment: async (paymentDetails: any) => {
        try {
            const response = await axios.post(`${API_BASE}/payments/verify`, paymentDetails, get().getHeaders() as any);
            set({ loading: false });
            useCartStore.getState().fetchCart(); // Refresh cart
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ loading: false, error: 'Payment verification failed' });
            return { success: false, message: 'Payment verification failed' };
        }
    }
}));
