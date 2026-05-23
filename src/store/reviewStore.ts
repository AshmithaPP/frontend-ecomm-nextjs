import { create } from 'zustand';
import { API_BASE, IMAGE_BASE } from '@/config/api';


const API_BASE_URL = API_BASE;

export const useReviewStore = create<any>((set, get) => ({
    reviews: [],
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [
        { star: 5, count: 0 },
        { star: 4, count: 0 },
        { star: 3, count: 0 },
        { star: 2, count: 0 },
        { star: 1, count: 0 }
    ],
    loading: false,
    summaryLoading: false,
    error: null,
    page: 1,
    hasMore: true,
    uploadProgress: 0,
    activeXhr: null,

    fetchReviewSummary: async (productId: any) => {
        set({ summaryLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/summary`);
            if (!response.ok) throw new Error("Failed to fetch summary");
            
            const data = await response.json();
            const summaryData = data.data || data; // Handle nested data or flat object
            
            // Handle breakdown mapping with support for both camelCase and snake_case
            const breakdown = summaryData.ratingBreakdown || summaryData.rating_breakdown || {};
            const distribution = [5, 4, 3, 2, 1].map(star => ({
                star,
                count: Number(breakdown[star] || breakdown[String(star)] || 0)
            }));

            set({
                averageRating: parseFloat(summaryData.averageRating ?? summaryData.average_rating ?? 0),
                totalReviews: Number(summaryData.totalReviews ?? summaryData.total_reviews ?? 0),
                ratingDistribution: distribution,
                summaryLoading: false
            });
        } catch (err: any) {
            set({ error: err.message, summaryLoading: false });
        }
    },

    fetchReviews: async (productId: any, page = 1, limit = 10, refresh = false) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error("Failed to fetch reviews");
            
            const data = await response.json();
            const reviewsData = data.data || data;
            const newReviews = reviewsData.reviews || (Array.isArray(reviewsData) ? reviewsData : []);
            
            set((state: any) => ({
                reviews: refresh ? newReviews : [...state.reviews, ...newReviews],
                loading: false,
                page: page,
                hasMore: newReviews.length === limit
            }));
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    submitReview: async (productId: any, reviewData: any, token: any = null) => {
        set({ loading: true, uploadProgress: 0, error: null });
        return new Promise((resolve) => {
            try {
                let body: any;
                let headers: any = {};
                
                if (reviewData instanceof FormData) {
                    body = reviewData;
                } else if (reviewData.video) {
                    const formData = new FormData();
                    formData.append('rating', String(reviewData.rating));
                    if (reviewData.comment) {
                        formData.append('comment', reviewData.comment);
                    }
                    formData.append('video', reviewData.video);
                    body = formData;
                } else {
                    headers['Content-Type'] = 'application/json';
                    body = JSON.stringify(reviewData);
                }

                const xhr = new XMLHttpRequest();
                set({ activeXhr: xhr });
                
                xhr.open('POST', `${API_BASE_URL}/products/${productId}/reviews`);
                
                // Set authorization token if provided
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                
                // Set additional headers
                Object.keys(headers).forEach(key => {
                    xhr.setRequestHeader(key, headers[key]);
                });

                // Track upload progress
                if (xhr.upload) {
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100);
                            set({ uploadProgress: percentComplete });
                        }
                    };
                }

                xhr.onload = async () => {
                    set({ activeXhr: null });
                    let responseData: any;
                    try {
                        responseData = JSON.parse(xhr.responseText);
                    } catch (e) {
                        responseData = { success: false, message: xhr.responseText || "Unknown error occurred" };
                    }

                    if (xhr.status >= 200 && xhr.status < 300) {
                        set({ loading: false, uploadProgress: 100 });
                        // Refresh summary and list
                        get().fetchReviewSummary(productId);
                        get().fetchReviews(productId, 1, 10, true);
                        resolve({ success: true, data: responseData.data });
                    } else {
                        const errMsg = responseData.message || responseData.error || "Failed to submit review";
                        set({ error: errMsg, loading: false, uploadProgress: 0 });
                        resolve({ success: false, error: errMsg });
                    }
                };

                xhr.onerror = () => {
                    set({ activeXhr: null });
                    const errMsg = "Network request failed";
                    set({ error: errMsg, loading: false, uploadProgress: 0 });
                    resolve({ success: false, error: errMsg });
                };

                xhr.onabort = () => {
                    set({ activeXhr: null, loading: false, uploadProgress: 0 });
                    resolve({ success: false, error: "Upload cancelled" });
                };

                xhr.send(body);
            } catch (err: any) {
                set({ activeXhr: null, error: err.message, loading: false, uploadProgress: 0 });
                resolve({ success: false, error: err.message });
            }
        });
    },

    cancelSubmitReview: () => {
        const xhr = get().activeXhr;
        if (xhr) {
            xhr.abort();
            set({ activeXhr: null, loading: false, uploadProgress: 0 });
        }
    }
}));
