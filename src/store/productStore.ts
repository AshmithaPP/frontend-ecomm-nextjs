import { create } from 'zustand';
import { API_BASE, IMAGE_BASE } from '@/config/api';

interface ProductState {
    products: any[];
    availableFilters: any;
    activeFilters: any;
    pagination: { current_page: number; total_pages: number; total_products: number };
    loading: boolean;
    error: string | null;
    selectedProduct: any;
    updateFilter: (key: string, value: string, isChecked: boolean) => void;
    setPriceRange: (min: number, max: number) => void;
    clearAllFilters: () => void;
    fetchProducts: (queryParams?: any) => Promise<void>;
    fetchProductBySlug: (slug: string) => Promise<void>;
    setSelectedVariant: (variantId: any) => void;
}

const API_BASE_URL = API_BASE;

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    availableFilters: {},
    activeFilters: {},
    pagination: { current_page: 1, total_pages: 1, total_products: 0 },
    loading: false,
    error: null,
    selectedProduct: null,

    updateFilter: (key, value, isChecked) => {
        set((state) => {
            const currentValues = state.activeFilters[key] ? state.activeFilters[key].split(',') : [];
            let newValues;
            
            if (isChecked) {
                newValues = [...new Set([...currentValues, value])];
            } else {
                newValues = currentValues.filter((v: string) => v !== value);
            }

            const updatedFilters = { ...state.activeFilters };
            if (newValues.length > 0) {
                updatedFilters[key] = newValues.join(',');
            } else {
                delete updatedFilters[key];
            }

            return { activeFilters: updatedFilters };
        });
    },

    setPriceRange: (min, max) => {
        set((state) => ({
            activeFilters: {
                ...state.activeFilters,
                min_price: min,
                max_price: max
            }
        }));
    },

    clearAllFilters: () => {
        set({ activeFilters: {} });
    },

    fetchProducts: async (queryParams = null) => {
        set({ loading: true, error: null });
        const paramsToUse = queryParams || get().activeFilters;
        const searchParams = new URLSearchParams();
        Object.entries(paramsToUse).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, value as string);
            }
        });

        if (!searchParams.has('limit')) searchParams.append('limit', '12');

        try {
            const response = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
            if (!response.ok) throw new Error(`Error fetching products: ${response.statusText}`);
            const data = await response.json();
            
            if (data.success) {
                const mappedProducts = data.products.map((p: any) => {
                    const fullImageUrl = p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `${IMAGE_BASE}${p.image_url}`) : '';
                    return {
                        ...p,
                        id: p.product_id,
                        product_id: p.product_id,
                        title: p.product_name,
                        name: p.product_name,
                        slug: p.slug,
                        image: fullImageUrl,
                        thumbnail: fullImageUrl,
                        discount: p.discount_percentage ? `${p.discount_percentage}% OFF` : null,
                        discountedPrice: `₹${parseFloat(p.price).toLocaleString('en-IN')}`,
                        price: parseFloat(p.price),
                        originalPrice: p.original_price ? `₹${parseFloat(p.original_price).toLocaleString('en-IN')}` : null,
                        discountBg: p.discount_percentage > 30 ? "#E11D48" : "#10B981",
                        rating: { average: p.rating, count: p.reviews_count },
                        stockStatus: p.stock_status
                    };
                });

                set({ 
                    products: mappedProducts, 
                    availableFilters: data.filters,
                    pagination: data.pagination,
                    loading: false 
                });
            } else {
                set({ error: "Failed to fetch products", loading: false });
            }
        } catch (err: any) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    fetchProductBySlug: async (slug) => {
        set({ loading: true, error: null, selectedProduct: null });
        try {
            const searchParams = new URLSearchParams();
            Object.entries(get().activeFilters).forEach(([key, value]) => {
                if (value) searchParams.append(key, value as string);
            });
            const qs = searchParams.toString();
            const response = await fetch(`${API_BASE_URL}/products/${slug}${qs ? '?' + qs : ''}`);
            if (!response.ok) throw new Error(`Error fetching product details: ${response.statusText}`);
            const data = await response.json();
            if (data.success) {
                set({ selectedProduct: data.data, loading: false });
            } else {
                set({ error: "Failed to fetch product details", loading: false });
            }
        } catch (err: any) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    setSelectedVariant: (variantId) => {
        set((state) => {
            if (!state.selectedProduct) return state;
            const variant = state.selectedProduct.variants.find((v: any) => v.variant_id === variantId);
            if (!variant) return state;

            let updatedSpecs = [...(state.selectedProduct.specifications || [])];
            
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    const displayValue: any = typeof value === 'object' && value !== null ? (value as any).name : value;
                    
                    const existingIndex = updatedSpecs.findIndex((s: any) => s.label.toLowerCase().includes(key.toLowerCase()));
                    if (existingIndex > -1) {
                        updatedSpecs[existingIndex] = { label, value: displayValue };
                    } else {
                        updatedSpecs.push({ label, value: displayValue });
                    }
                });
            }

            return {
                selectedProduct: {
                    ...state.selectedProduct,
                    selected_variant: variant,
                    specifications: updatedSpecs
                }
            };
        });
    }
}));
