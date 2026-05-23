import React, { useState, useEffect } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { resolveMediaUrl } from '@/config/api';
import './customerReviews.css';

// ── Inline sub-components ───────────────────────────────────────────────────

interface RatingStarsProps {
    rating: number;
    size?: 'normal' | 'large';
    onClick?: (rating: number) => void;
}

const RatingStars = ({ rating, size = 'normal', onClick }: RatingStarsProps) => {
    const starSize = size === 'large' ? 26 : 18;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        stars.push(
            <span 
                key={i} 
                className={`star-wrap ${onClick ? 'cursor-pointer' : ''}`} 
                style={{ fontSize: starSize, position: 'relative', display: 'inline-block', lineHeight: 1 }}
                onClick={() => onClick && onClick(i)}
            >
                <span style={{ color: '#D1D5DB' }}>★</span>
                {fill > 0 && (
                    <span style={{
                        color: '#FBBF24',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        overflow: 'hidden',
                        width: `${fill * 100}%`
                    }}>★</span>
                )}
            </span>
        );
    }
    return <span className="rating-stars">{stars}</span>;
};

interface RatingBreakdownProps {
    distribution: Array<{ star: number; count: number }>;
    totalReviews: number;
}

const RatingBreakdown = ({ distribution, totalReviews }: RatingBreakdownProps) => {
    return (
        <div className="rating-breakdown">
            {distribution.map(({ star, count }) => {
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                    <div key={star} className="breakdown-row" title={`${percentage}%`}>
                        <span className="breakdown-label">{star} Star</span>
                        <div className="breakdown-bar-track">
                            <div
                                className="breakdown-bar-fill"
                                style={{ width: `${percentage}%` }}
                                role="progressbar"
                                aria-valuenow={percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <span className="breakdown-count">{count}</span>
                    </div>
                );
            })}
        </div>
    );
};

const ThumbsUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
);

const EditPencilIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

interface ReviewCardProps {
    review: any;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    // Mapping API fields to UI component fields
    const customerName = review.userName || review.user_name || review.customer_name || review.Customer?.name || review.customer?.name || review.user?.name || "Guest User";
    const rating = review.rating;
    const date = new Date(review.date || review.createdAt || review.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const comment = review.comment || review.review_text;
    const verifiedPurchase = review.verifiedPurchase || review.verified_purchase || false;
    const helpfulCount = review.helpfulCount || review.helpful_count || 0;
    const avatar = review.avatar || review.Customer?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=e5e7eb&color=374151`;

    const videoUrl = typeof review.video === 'object' && review.video !== null
        ? review.video.url
        : (typeof review.video === 'string' ? review.video : null);
    const videoThumb = typeof review.video === 'object' && review.video !== null
        ? review.video.thumbnailUrl
        : null;

    const resolvedVideoUrl = videoUrl ? resolveMediaUrl(videoUrl) : null;
    const resolvedThumbUrl = videoThumb ? resolveMediaUrl(videoThumb) : null;

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="reviewer-info">
                    <img
                        src={avatar}
                        alt={customerName}
                        className="reviewer-avatar"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=e5e7eb&color=374151`; 
                        }}
                    />
                    <div className="reviewer-meta">
                        <span className="reviewer-name">{customerName}</span>
                        <div className="reviewer-stars">
                            <RatingStars rating={rating} onClick={undefined} />
                        </div>
                    </div>
                </div>
                <span className="review-date">{date}</span>
            </div>

            <p className="review-comment">{comment}</p>

            {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                <div className="review-images">
                    {review.images.map((img: any, idx: number) => (
                        <img key={idx} src={img} alt="Review" className="review-image-thumb" />
                    ))}
                </div>
            )}

            {resolvedVideoUrl && (
                <div className="review-video-wrapper mt-3 mb-3 ms-md-5 ps-md-3" style={{ maxWidth: '400px' }}>
                    <video
                        src={resolvedVideoUrl}
                        poster={resolvedThumbUrl || undefined}
                        controls
                        className="review-video-player rounded border"
                        style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', backgroundColor: '#000' }}
                        preload="none"
                    />
                </div>
            )}

            <div className="review-footer ms-md-5 ps-md-3">
                <button className="helpful-btn">
                    <ThumbsUpIcon />
                    <span>Helpful ({helpfulCount})</span>
                </button>
                {verifiedPurchase && (
                    <span className="verified-badge">Verified Purchase</span>
                )}
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────

interface CustomerReviewsProps {
    productId: string | number;
}

const CustomerReviews = ({ productId }: CustomerReviewsProps) => {
    const { 
        reviews, 
        totalReviews, 
        averageRating, 
        ratingDistribution, 
        loading, 
        summaryLoading,
        fetchReviews, 
        fetchReviewSummary,
        submitReview,
        hasMore,
        page,
        uploadProgress,
        cancelSubmitReview
    } = useReviewStore();
    const { user, token, isAuthenticated } = useAuthStore();

    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Video upload states
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            fetchReviewSummary(productId);
            fetchReviews(productId, 1, 10, true);
        }
    }, [productId, fetchReviewSummary, fetchReviews]);

    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    const handleLoadMore = () => {
        fetchReviews(productId, page + 1, 10);
    };

    const handleCancelClick = () => {
        if (showForm) {
            if (submitLoading) {
                // Abort active upload stream
                cancelSubmitReview();
                setSubmitLoading(false);
                toast.warning("Review upload cancelled", { position: "top-right" });
            }
            // Clear all uploader inputs and previews
            setNewReview({ rating: 0, comment: '' });
            clearSelectedVideo();
            setShowForm(false);
        } else {
            setShowForm(true);
        }
    };

    const validateVideo = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            // Extension check & MIME check
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext !== 'mp4' || file.type !== 'video/mp4') {
                resolve("Only MP4 videos are allowed");
                return;
            }
            
            // Max size 50MB
            if (file.size > 50 * 1024 * 1024) {
                resolve("Video exceeds 50MB limit");
                return;
            }

            // Duration check
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 60) {
                    resolve("Video duration cannot exceed 60 seconds");
                } else {
                    resolve(null);
                }
            };
            video.onerror = () => {
                window.URL.revokeObjectURL(video.src);
                resolve("Failed to load video metadata");
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Run validation immediately upon file selection
        const error = await validateVideo(file);
        if (error) {
            toast.error(error, { position: "top-right" });
            e.target.value = ''; // Reset input element
            setVideoFile(null);
            setVideoPreview(null);
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const clearSelectedVideo = () => {
        setVideoFile(null);
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate rating
        if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
            toast.error("Rating is required and must be between 1 and 5", { position: "top-right" });
            return;
        }

        // 2. Validate video presence & authentication
        if (videoFile) {
            if (!isAuthenticated) {
                toast.error("Video uploads require authentication", { position: "top-right" });
                return;
            }

            const error = await validateVideo(videoFile);
            if (error) {
                toast.error(error, { position: "top-right" });
                return;
            }
        }

        setSubmitLoading(true);
        
        // Construct FormData for upload
        const formData = new FormData();
        formData.append("rating", String(newReview.rating));
        if (newReview.comment.trim()) {
            formData.append("comment", newReview.comment.trim());
        }
        if (videoFile) {
            formData.append("video", videoFile);
        }

        const result = await submitReview(productId, formData, token);
        
        if (result.success) {
            toast.success("Review added successfully", { position: "top-right" });
            setShowForm(false);
            setNewReview({ rating: 0, comment: '' });
            clearSelectedVideo();
        } else {
            toast.error(result.error || "Failed to submit review", { position: "top-right" });
        }
        setSubmitLoading(false);
    };


    return (
        <div className="customer-reviews-section container p-4 shadow-sm mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h3 className="reviews-section-title mb-0">Customer Reviews</h3>
                <button 
                    onClick={handleCancelClick} 
                    className={`write-review-btn ${showForm ? 'cancel-mode' : ''}`}
                >
                    {showForm ? (
                        <>
                            <CloseIcon />
                            <span>Cancel</span>
                        </>
                    ) : (
                        <>
                            <EditPencilIcon />
                            <span>Write a Review</span>
                        </>
                    )}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="review-form-container mb-5 p-4 border rounded bg-light shadow-sm">
                    <h4 className="mb-4 text-dark fw-bold">Share Your Thoughts</h4>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="form-label d-block fw-bold text-dark">Overall Rating </label>
                            <div className="star-rating-input">
                                <RatingStars 
                                    rating={newReview.rating} 
                                    size="large" 
                                    onClick={(val: number) => !submitLoading && setNewReview({...newReview, rating: val})} 
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark">Your Review (Optional)</label>
                            <textarea 
                                className="form-control" 
                                rows={4}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                placeholder="What did you like or dislike about the product?"
                                disabled={submitLoading}
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark">Add Video Review (Optional - MP4 only, max 50MB, max 60s)</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                accept="video/mp4"
                                onChange={handleVideoChange}
                                disabled={submitLoading}
                            />
                            {videoPreview && (
                                <div className="mt-3 video-preview-container position-relative rounded border p-1 bg-white" style={{ maxWidth: '300px' }}>
                                    <video 
                                        src={videoPreview} 
                                        controls 
                                        className="rounded w-100" 
                                        style={{ maxHeight: '180px', objectFit: 'contain', backgroundColor: '#000' }}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center shadow"
                                        onClick={clearSelectedVideo}
                                        style={{ width: '26px', height: '26px', padding: 0, border: 'none', zIndex: 10 }}
                                        title="Remove Video"
                                        disabled={submitLoading}
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            )}
                        </div>

                        {submitLoading && (
                            <div className="upload-progress-container mb-4 p-3 border rounded bg-white shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="upload-label small fw-bold text-dark">Uploading Video & Review...</span>
                                    <span className="upload-percent small fw-bold text-success">{uploadProgress}%</span>
                                </div>
                                <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                        role="progressbar"
                                        style={{ width: `${uploadProgress}%` }}
                                        aria-valuenow={uploadProgress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="submit-review-btn btn btn-dark px-4 py-2 fw-bold text-uppercase" disabled={submitLoading}>
                            {submitLoading ? 'Uploading Review...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Rating summary + breakdown */}
            <div className="row mb-5 align-items-center summary-section">
                {summaryLoading ? (
                    <div className="col-12 py-4">
                        <div className="skeleton-summary"></div>
                    </div>
                ) : (
                    <>
                        <div className="col-md-4 text-center rating-summary-col">
                            <div className="rating-value mb-2">
                                {typeof averageRating === 'number' ? averageRating.toFixed(1) : averageRating}
                            </div>
                            <div className="d-flex justify-content-center mb-2">
                                <RatingStars rating={averageRating} size="large" onClick={undefined} />
                            </div>
                            <div className="rating-based-on">Based on {totalReviews} reviews</div>
                        </div>

                        <div className="col-md-8 px-md-5 mt-4 mt-md-0">
                            <RatingBreakdown
                                distribution={ratingDistribution}
                                totalReviews={totalReviews}
                            />
                        </div>
                    </>
                )}
            </div>

            <hr className="reviews-divider" />

            {/* Reviews list */}
            <div className="reviews-list">
                {loading && reviews.length === 0 ? (
                    <div className="review-skeletons">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton-card mb-3"></div>)}
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review: any, index: number) => (
                        <ReviewCard key={review.id || `review-${index}`} review={review} />
                    ))
                ) : totalReviews === 0 ? (
                    <div className="text-center py-5 empty-reviews">
                        <p className="text-muted fs-5">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : null}
            </div>


            {/* Load more */}
            {hasMore && reviews.length > 0 && (
                <div className="text-center mt-5">
                    <button 
                        onClick={handleLoadMore} 
                        className="btn load-more-btn fw-bold"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More Reviews'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerReviews;