import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';
import { API_BASE } from '@/config/api';

const API_URL = `${API_BASE}/addresses`;

export const useAddressStore = create<any>((set, get) => ({
    addresses: [],
    loading: false,
    error: null,

    getHeaders: () => {
        const { token } = useAuthStore.getState();
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    },

    fetchAddresses: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(API_URL, get().getHeaders());
            set({ addresses: response.data.addresses, loading: false });
        } catch (error: any) {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }
            set({ 
                error: error.response?.data?.message || 'Failed to fetch addresses', 
                loading: false 
            });
        }
    },

    addAddress: async (addressData: any) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(API_URL, addressData, get().getHeaders());
            const newAddress = response.data.data;
            
            // If the new address is default, update local list to reflect that
            let updatedAddresses = [...get().addresses];
            if (newAddress.is_default) {
                updatedAddresses = updatedAddresses.map((addr: any) => ({ ...addr, is_default: 0 }));
            }
            updatedAddresses.unshift(newAddress);

            set({ addresses: updatedAddresses, loading: false });
            return { success: true, data: newAddress };
        } catch (error: any) {
            if (error.response?.status === 401) {
                useAuthStore.getState().logout();
            }
            set({ 
                error: error.response?.data?.message || 'Failed to add address', 
                loading: false 
            });
            return { success: false, message: get().error };
        }
    },

    updateAddress: async (addressId: any, addressData: any) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${addressId}`, addressData, get().getHeaders());
            const updatedAddress = response.data.data;

            let updatedAddresses = get().addresses.map((addr: any) => 
                addr.address_id === addressId ? updatedAddress : addr
            );

            // Handle default logic locally if needed
            if (addressData.is_default) {
                updatedAddresses = updatedAddresses.map((addr: any) => 
                    addr.address_id !== addressId ? { ...addr, is_default: 0 } : addr
                );
            }

            set({ addresses: updatedAddresses, loading: false });
            return { success: true };
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Failed to update address', 
                loading: false 
            });
            return { success: false, message: get().error };
        }
    },

    deleteAddress: async (addressId: any) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${addressId}`, get().getHeaders());
            
            // Refetch to ensure default logic (backend auto-assigns new default) is synced
            await get().fetchAddresses();
            return { success: true };
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Failed to delete address', 
                loading: false 
            });
            return { success: false, message: get().error };
        }
    },

    setDefaultAddress: async (addressId: any) => {
        return get().updateAddress(addressId, { is_default: true });
    }
}));
