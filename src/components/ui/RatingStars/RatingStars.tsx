"use client";

import React from 'react';
import starIcon from 'assets/icons/ui/stars.png';
import halfStarIcon from 'assets/icons/ui/halfstariocn.png';
import './ratingStars.css';
import Image from 'next/image';

interface RatingStarsProps {
    rating?: number;
    size?: 'small' | 'medium' | 'large';
}

const RatingStars = ({ rating = 5, size = 'small' }: RatingStarsProps) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <div className={`rating-stars d-inline-flex align-items-center ${size}`}>
            {[...Array(fullStars)].map((_, i) => (
                <Image key={`full-${i}`} src={starIcon} alt="star" className="star star-full" width={16} height={16} />
            ))}
            
            {hasHalfStar && (
                <div className="star-half-container d-inline-flex align-items-center">
                    <Image src={halfStarIcon} alt="half-star" className="star star-half" width={16} height={16} />
                </div>
            )}
            
            {[...Array(emptyStars)].map((_, i) => (
                <Image key={`empty-${i}`} src={starIcon} alt="empty star" className="star star-empty" width={16} height={16} />
            ))}
        </div>
    );
};

export default RatingStars;
