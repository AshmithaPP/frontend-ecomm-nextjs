"use client";

import React from 'react';
import RatingStars from '../RatingStars/RatingStars';
import thumbsUpIcon from 'assets/icons/ui/hand.png';
import './reviewCard.css';
import Image from 'next/image';

interface ReviewCardProps {
    review: {
        customerName: string;
        avatar?: string;
        rating: number;
        date: string;
        comment: string;
        images?: string[];
        helpfulCount?: number;
        verifiedPurchase?: boolean;
    };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    return (
        <div className="review-card py-4">
            <div className="d-flex align-items-start mb-2">
                {/* Avatar */}
                <div className="reviewer-avatar flex-shrink-0 me-3">
                    <img 
                        src={review.avatar || `https://ui-avatars.com/api/?name=${review.customerName}&background=random`} 
                        alt={review.customerName} 
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                </div>
                
                {/* Name, Rating, Date */}
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-baseline mb-1">
                        <h6 className="reviewer-name fw-bold mb-0">{review.customerName}</h6>
                        <span className="review-date text-muted" style={{ fontSize: '12px' }}>{review.date}</span>
                    </div>
                    <RatingStars rating={review.rating} size="small" />
                </div>
            </div>

            {/* Comment Body */}
            <div className="review-body mt-3">
                <p className="review-text text-muted mb-3" style={{ fontSize: '14px', lineHeight: '1.6' }}>{review.comment}</p>
                
                {/* Optional Review Images */}
                {review.images && review.images.length > 0 && (
                    <div className="review-images d-flex gap-2 mb-3">
                        {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`review-${idx}`} className="review-thumbnail rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions (Helpful, Verified) */}
            <div className="review-footer d-flex align-items-center mt-2">
                <button className="review-action-btn d-flex align-items-center gap-1 bg-transparent border-0 text-muted" style={{ fontSize: '13px' }}>
                    <Image src={thumbsUpIcon} alt="helpful" className="review-action-icon" width={14} height={14} />
                    Helpful ({review.helpfulCount || 0})
                </button>
                {review.verifiedPurchase && (
                    <span className="verified-badge d-flex align-items-center ms-3 text-success" style={{ fontSize: '12px', fontWeight: '500' }}>
                        Verified Purchase
                    </span>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
