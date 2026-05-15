"use client";

import React, { useState } from 'react';
import TestimonialCard from './TestimonialCard';
import ArrowButton from 'components/common/ArrowButton';
import './testimonials.css';
import collection1 from 'assets/images/bridal/testimonial.png';

import { IMAGE_BASE } from '@/config/api';

interface TestimonialItem {
    testimonial_id: string;
    customer_name: string;
    designation: string;
    rating: string | number;
    comment: string;
    image_url: string;
}

interface TestimonialsProps {
    dynamicTestimonials?: TestimonialItem[];
}

const Testimonials = ({ dynamicTestimonials }: TestimonialsProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const IMAGE_BASE_URL = IMAGE_BASE;

    const testimonials = dynamicTestimonials && dynamicTestimonials.length > 0 
        ? dynamicTestimonials.map(t => ({
            image: t.image_url ? (t.image_url.startsWith('http') ? t.image_url : `${IMAGE_BASE_URL}${t.image_url}`) : collection1,
            name: t.customer_name,
            role: t.designation,
            review: t.comment,
            rating: Number(t.rating)
        }))
        : [
            {
                image: collection1,
                name: 'Anthony Bahringer',
                role: 'Senior Research Manager',
                review: 'Lorem ipsum dolor sit amet consectetur. Consequat auctor consectetur nunc vitae dolor blandit. Elit enim massa etiam neque laoreet lorem sed.',
                rating: 5
            }
        ];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const getCardClass = (index: number) => {
        const total = testimonials.length;
        if (total === 1) return 'center-card';
        if (index === activeIndex) return 'center-card';
        if (index === (activeIndex - 1 + total) % total) return 'prev-card';
        if (index === (activeIndex + 1) % total) return 'next-card';
        return 'hidden-card';
    };

    return (
        <section className="testimonials-section">
            <div className="container">
                <h2 className="testimonials-section-title">Our Customer Testimonials</h2>
                
                <div className="carousel-wrapper">
                    <div className="carousel-container">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={index} 
                                className={`carousel-item-wrapper ${getCardClass(index)}`}
                            >
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-controls">
                    <div className="arrow-wrapper">
                        <ArrowButton direction="left" onClick={handlePrev} />
                    </div>
                    <div className="arrow-wrapper">
                        <ArrowButton direction="right" onClick={handleNext} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
