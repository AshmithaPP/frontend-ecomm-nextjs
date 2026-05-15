import React from 'react';
import './testimonials.css';
import starsIcon from 'assets/icons/ui/stars.png';
import quotesIcon from 'assets/icons/ui/quotesIcon.png';
import Image from 'next/image';

interface TestimonialCardProps {
    testimonial: {
        image: any;
        name: string;
        role: string;
        review: string;
        rating: number;
    };
    className?: string;
}

const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
    const { image, name, role, review} = testimonial;

    return (
        <div className={`testimonial-card ${className || ''}`}>
            <div className="card-content">
                <div className="quote-container">
                    <Image src={quotesIcon} alt="quote" className="quote-icon" width={30} height={30} />
                </div>
                <div className="rating">
                    {[...Array(5)].map((_, index) => (
                        <Image key={index} src={starsIcon} alt="star" className="star-icon" width={20} height={20} />
                    ))}
                </div>
                <p className="review-text">{review}</p>
                <div className="author-info">
                    <h4 className="name">{name}</h4>
                    <p className="role">{role}</p>
                </div>
            </div>
            <div className="card-image-container">
                {typeof image === 'string' ? (
                    <img src={image} alt={name} className="card-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                ) : (
                    <Image src={image} alt={name} className="card-img" width={200} height={200} style={{ objectFit: 'cover' }} />
                )}
            </div>

        </div>
    );
};

export default TestimonialCard;
