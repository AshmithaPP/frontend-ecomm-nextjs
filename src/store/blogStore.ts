import { create } from 'zustand';
import { API_BASE } from '@/config/api';

export interface BlogItem {
    blog_id: number;
    title: string;
    slug: string;
    category: string;
    published_date: string;
    excerpt: string;
    image_url: string;
    content?: string;
    author?: string;
    status?: string;
    tags?: string;
    seo_title?: string;
    seo_description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface BlogPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface BlogState {
    blogs: BlogItem[];
    selectedBlog: BlogItem | null;
    loading: boolean;
    error: string | null;
    pagination: BlogPagination;
    fetchBlogs: (params?: { page?: number; limit?: number; category?: string }) => Promise<void>;
    fetchBlogBySlug: (slug: string) => Promise<void>;
}

const API_BASE_URL = API_BASE;

export const useBlogStore = create<BlogState>((set) => ({
    blogs: [],
    selectedBlog: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    },

    fetchBlogs: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const { page = 1, limit = 10, category = '' } = params;
            const queryParams = new URLSearchParams({ page: String(page), limit: String(limit), category }).toString();
            
            const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch blogs');
            const result = await response.json();
            
            if (result.success) {
                set({ 
                    blogs: result.data, 
                    pagination: result.pagination,
                    loading: false 
                });
            } else {
                set({ error: result.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchBlogBySlug: async (slug) => {
        set({ loading: true, error: null, selectedBlog: null });
        try {
            const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
            if (!response.ok) throw new Error('Failed to fetch blog');
            const result = await response.json();
            if (result.success) {
                set({ selectedBlog: result.data, loading: false });
            } else {
                set({ error: result.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
