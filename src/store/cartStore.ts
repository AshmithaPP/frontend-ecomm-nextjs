import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE } from '@/config/api';
import { useAuthStore } from './authStore';

export interface CartItem {
    cart_item_id: number;
    product_id: number;
    product_name: string;
    name: string;
    price: string | number;
    unit_price: string | number;
    quantity: number;
    image_url: string;
    image: string;
    variant_id: number;
    variant_name: string;
    attributes: any;
    line_total: string | number;
    slug: string;
}

export interface CartSummary {
    subtotal: number | string;
    delivery: number | string;
    shipping_charge?: number | string;
    shipping_zone?: string;
    discount: number | string;
    taxable_amount?: number | string;
    gst_amount?: number | string;
    cgst_amount?: number | string;
    sgst_amount?: number | string;
    igst_amount?: number | string;
    gst_rate?: number | string;
    total: number | string;
    estimated_days?: string;
}

export interface Cart {
    items: CartItem[];
    summary: CartSummary;
    success?: boolean;
    message?: string;
}

interface CartState {
    cart: Cart;
    guestId: string | null;
    loading: boolean;
    error: string | null;
    initGuest: () => void;
    getHeaders: () => { [key: string]: string };
    fetchCart: (state?: string) => Promise<void>;
    addToCart: (productId: number | string, variantId: number | string, quantity?: number) => Promise<{ success: boolean; data?: any; message?: string }>;
    updateQuantity: (cartItemId: number | string, quantity: number) => Promise<{ success: boolean; message?: string }>;
    removeFromCart: (cartItemId: number | string) => Promise<void>;
    clearCart: () => Promise<void>;
    mergeCart: () => Promise<void>;
    applyCoupon: (code: string, subtotal: number) => Promise<{ success: boolean; data?: any; message?: string }>;
    fetchActiveCoupons: () => Promise<any[]>;
}

const API_URL = `${API_BASE}/cart`;

const initialSummary: CartSummary = {
    subtotal: 0,
    delivery: 0,
    discount: 0,
    total: 0
};

const initialCart: Cart = {
    items: [],
    summary: initialSummary
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: initialCart,
            guestId: null,
            loading: false,
            error: null,

            initGuest: () => {
                if (!get().guestId) {
                    set({ guestId: crypto.randomUUID() });
                }
            },

            getHeaders: () => {
                const headers: { [key: string]: string } = {
                    'Content-Type': 'application/json',
                    'x-guest-id': get().guestId || ""
                };
                const token = useAuthStore.getState().token;
                if (token) headers['Authorization'] = `Bearer ${token}`;
                return headers;
            },

            fetchCart: async (state = "") => {
                get().initGuest();
                set({ loading: true, error: null });
                try {
                    let url = API_URL;
                    if (state) url += `?state=${encodeURIComponent(state)}`;
                    
                    const res = await fetch(url, { headers: get().getHeaders() });
                    const data = await res.json();
                    if (data.success) {
                        set({ cart: data, loading: false });
                    } else {
                        set({ error: data.message, loading: false });
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            addToCart: async (productId, variantId, quantity = 1) => {
                get().initGuest();
                set({ loading: true, error: null });
                const headers = get().getHeaders();
                try {
                    const payload = {
                        product_id: productId,
                        variant_id: variantId || null,
                        quantity: quantity
                    };

                    console.log("Cart Store: Adding to cart", {
                        productId,
                        variantId,
                        quantity,
                        payload,
                        headers
                    });

                    const res = await fetch(`${API_URL}/add`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchCart();
                        return { success: true, data: data.data };
                    } else {
                        set({ error: data.message, loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    return { success: false, message: err.message };
                }
            },

            updateQuantity: async (cartItemId, quantity) => {
                const qty = Number(quantity);
                set({ loading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/update`, {
                        method: 'PUT',
                        headers: get().getHeaders(),
                        body: JSON.stringify({ cart_item_id: cartItemId, quantity: qty })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchCart();
                        return { success: true };
                    } else {
                        set({ error: data.message, loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    return { success: false, message: err.message };
                }
            },

            removeFromCart: async (cartItemId) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/item/${cartItemId}`, {
                        method: 'DELETE',
                        headers: get().getHeaders()
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchCart();
                    } else {
                        set({ error: data.message, loading: false });
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            clearCart: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/clear`, {
                        method: 'DELETE',
                        headers: get().getHeaders()
                    });
                    const data = await res.json();
                    if (data.success) {
                        set({ cart: initialCart, loading: false });
                    } else {
                        set({ error: data.message, loading: false });
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            mergeCart: async () => {
                const token = useAuthStore.getState().token;
                const guestId = get().guestId;
                if (!token || !guestId) return;

                set({ loading: true });
                try {
                    const res = await fetch(`${API_URL}/merge`, {
                        method: 'POST',
                        headers: get().getHeaders(),
                        body: JSON.stringify({ guest_id: guestId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchCart();
                    }
                } catch (err) {
                    console.error("Merge failed", err);
                } finally {
                    set({ loading: false });
                }
            },

            applyCoupon: async (code, subtotal) => {
                set({ loading: true, error: null });
                try {
                    const res = await fetch(`${API_BASE}/coupons/validate`, {
                        method: 'POST',
                        headers: get().getHeaders(),
                        body: JSON.stringify({ code, orderAmount: subtotal })
                    });
                    const data = await res.json();
                    if (data.success) {
                        const currentCart = get().cart;
                        const discount = parseFloat(String(data.data.discount_amount || '0'));
                        const delivery = parseFloat(String(currentCart.summary.delivery || '0'));
                        const subtotalVal = parseFloat(String(currentCart.summary.subtotal || '0'));

                        const updatedSummary: CartSummary = {
                            ...currentCart.summary,
                            discount,
                            total: subtotalVal + delivery - discount
                        };

                        set({ cart: { ...currentCart, summary: updatedSummary }, loading: false });
                        return { success: true, data: data.data };
                    } else {
                        set({ error: data.message, loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    return { success: false, message: err.message };
                }
            },

            fetchActiveCoupons: async () => {
                try {
                    const res = await fetch(`${API_BASE}/coupons/active`, {
                        headers: get().getHeaders()
                    });
                    const data = await res.json();
                    if (data.success) {
                        return data.data;
                    }
                    return [];
                } catch (err) {
                    console.error("Failed to fetch coupons", err);
                    return [];
                }
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state: CartState) => ({ guestId: state.guestId })
        }
    )
);
