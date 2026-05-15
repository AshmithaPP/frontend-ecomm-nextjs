"use client";

import React from 'react';
import './ratingBreakdown.css';

interface RatingBreakdownProps {
    distribution: { star: number; count: number }[];
    totalReviews: number;
}

const RatingBreakdown = ({ distribution, totalReviews }: RatingBreakdownProps) => {
    return (
        <div className="rating-breakdown">
            {distribution.map((item) => {
                const percentage = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
                
                return (
                    <div key={item.star} className="rating-bar-row d-flex align-items-center mb-2">
                        <div className="star-label text-muted me-3" style={{ minWidth: '50px', fontSize: '13px' }}>
                            {item.star} Star
                        </div>
                        <div className="progress flex-grow-1" style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div 
                                className="progress-bar custom-gold-bg" 
                                role="progressbar" 
                                style={{ width: `${percentage}%`, height: '100%', background: '#FBBF24' }} 
                                aria-valuenow={percentage} 
                                aria-valuemin={0} 
                                aria-valuemax={100}
                            ></div>
                        </div>
                        <div className="count-label text-muted ms-3 text-end" style={{ minWidth: '30px', fontSize: '13px' }}>
                            {item.count}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RatingBreakdown;
