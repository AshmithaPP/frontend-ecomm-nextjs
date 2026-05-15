import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';
import { useAuthStore } from './authStore';
import { API_BASE } from '@/config/api';

interface WishlistState {
    items: any[];
    loading: boolean;
    getHeaders: () => any;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: any, variantId?: any) => Promise<{ success: boolean; action?: string; message?: string }>;
    mergeWishlist: () => Promise<void>;
    clearWishlist: () => void;
    isInWishlist: (productId: any) => boolean;
}

const API_URL = `${API_BASE}/wishlist`;

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            getHeaders: () => {
                const guestId = useCartStore.getState().guestId;
                const headers: any = {
                    'Content-Type': 'application/json',
                    'x-guest-id': guestId || ''
                };
                const token = useAuthStore.getState().token;
                if (token) headers['Authorization'] = `Bearer ${token}`;
                return headers;
            },

            fetchWishlist: async () => {
                useCartStore.getState().initGuest();
                set({ loading: true });
                try {
                    const res = await fetch(API_URL, { headers: get().getHeaders() });
                    const data = await res.json();
                    if (data.success) {
                        set({ items: data.items || [] });
                    }
                } catch (err) {
                    console.error("Fetch wishlist failed", err);
                } finally {
                    set({ loading: false });
                }
            },

            toggleWishlist: async (productIdOrProduct: any, variantId: any = null) => {
                useCartStore.getState().initGuest();
                const productId = typeof productIdOrProduct === 'object' 
                    ? (productIdOrProduct.product_id || productIdOrProduct.id) 
                    : productIdOrProduct;

                const isExist = get().items.some(item => 
                    (item.product_id === productId || item.id === productId) && (variantId ? item.variant_id === variantId : true)
                );

                const endpoint = isExist ? '/remove' : '/add';
                const method = isExist ? 'DELETE' : 'POST';

                try {
                    const res = await fetch(`${API_URL}${endpoint}`, {
                        method,
                        headers: get().getHeaders(),
                        body: JSON.stringify({ product_id: productId, variant_id: variantId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchWishlist();
                        return { success: true, action: isExist ? 'removed' : 'added' };
                    }
                    return { success: false, message: data.message };
                } catch (err: any) {
                    console.error("Wishlist toggle failed", err);
                    return { success: false, message: err.message };
                }
            },

            mergeWishlist: async () => {
                const guestId = useCartStore.getState().guestId;
                const token = useAuthStore.getState().token;
                if (!token || !guestId) return;

                try {
                    const res = await fetch(`${API_URL}/merge`, {
                        method: 'POST',
                        headers: get().getHeaders(),
                        body: JSON.stringify({ guest_id: guestId })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await get().fetchWishlist();
                    }
                } catch (err) {
                    console.error("Wishlist merge failed", err);
                }
            },

            clearWishlist: () => set({ items: [] }),

            isInWishlist: (productId: any) => {
                return get().items.some(item => (item.product_id === productId || item.id === productId));
            }
        }),
        {
            name: 'wishlist-storage',
            partialize: (state: WishlistState) => ({ items: state.items })
        }
    )
);
