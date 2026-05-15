"use client";

import React, { useEffect, useRef } from 'react';
import './shopByPrice.css';
import PriceCard from './PriceCard';

// Import images
import everydaySaree from 'assets/images/bridal/occasion1.png';
import officeSaree from 'assets/images/bridal/occasion2.png';
import weddingSaree from 'assets/images/bridal/bridal_saree.png';
import festiveSaree from 'assets/images/bridal/occasion4.png';
import largeSaree from 'assets/images/bridal/occasion1.png'; // Reusing large image for consistency

const priceData = [
    {
        id: 1,
        title: 'Under ₹5k - Everyday Sarees',
        type: 'large',
        image: largeSaree,
        url: '/shop?min_price=0&max_price=5000'
    },
    {
        id: 2,
        title: 'Under ₹5k - Everyday Sarees',
        type: 'small',
        image: everydaySaree,
        url: '/shop?min_price=0&max_price=5000'
    },
    {
        id: 3,
        title: '₹5k – ₹10k - Office Wear Sarees',
        type: 'small',
        image: officeSaree,
        url: '/shop?min_price=5000&max_price=10000'
    },
    {
        id: 4,
        title: '₹10k – ₹20k - Wedding & Bridal Sarees',
        type: 'small',
        image: weddingSaree,
        url: '/shop?min_price=10000&max_price=20000'
    },
    {
        id: 5,
        title: '₹30k – ₹50k - Festive Wear Sarees',
        type: 'small',
        image: festiveSaree,
        url: '/shop?min_price=30000&max_price=50000'
    }
];

import { IMAGE_BASE } from '@/config/api';

interface ShopByPriceProps {
    data?: any[];
}

const ShopByPrice = ({ data }: ShopByPriceProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const IMAGE_BASE_URL = IMAGE_BASE;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            const reveals = sectionRef.current.querySelectorAll('.reveal');
            reveals.forEach((reveal) => observer.observe(reveal));

            return () => {
                reveals.forEach((reveal) => observer.unobserve(reveal));
            };
        }
    }, []);

    const displayData = data && data.length > 0 ? data.map((item, index) => ({
        id: index + 1,
        title: item.label,
        type: index === 0 ? 'large' : 'small',
        image: item.image_url 
            ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE_URL}${item.image_url}`)
            : (index === 0 ? largeSaree : (index === 1 ? everydaySaree : (index === 2 ? officeSaree : (index === 3 ? weddingSaree : festiveSaree)))),
        url: `/shop?min_price=${item.min_price}&max_price=${item.max_price}`
    })) : priceData;

    // Layout configuration from data
    const largeCard = displayData.find(item => item.type === 'large');
    const smallCards = displayData.filter(item => item.type === 'small');

    return (
        <section className="shop-by-price-section" ref={sectionRef}>
            <div className="container shop-by-price-container reveal">
                <h2 className="title">Shop By Price</h2>
                
                <div className="row g-4 d-flex align-items-stretch">
                    {/* Left Side - Large Card */}
                    <div className="col-lg-6 col-md-12">
                        {largeCard && (
                            <PriceCard 
                                image={largeCard.image} 
                                title={largeCard.title} 
                                type="large" 
                                url={largeCard.url}
                            />
                        )}
                    </div>

                    {/* Right Side - Small Cards */}
                    <div className="col-lg-6 col-md-12">
                        <div className="small-cards-column">
                            {smallCards.map((item) => (
                                <PriceCard 
                                    key={item.id}
                                    image={item.image}
                                    title={item.title}
                                    type="small"
                                    url={item.url}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopByPrice;
