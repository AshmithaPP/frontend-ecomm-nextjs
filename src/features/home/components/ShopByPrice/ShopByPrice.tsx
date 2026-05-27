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
        min_price: 0,
        max_price: 5000
    },
    {
        id: 2,
        title: 'Under ₹5k - Everyday Sarees',
        type: 'small',
        image: everydaySaree,
        min_price: 0,
        max_price: 5000
    },
    {
        id: 3,
        title: '₹5k – ₹10k - Office Wear Sarees',
        type: 'small',
        image: officeSaree,
        min_price: 5000,
        max_price: 10000
    },
    {
        id: 4,
        title: '₹10k – ₹20k - Wedding & Bridal Sarees',
        type: 'small',
        image: weddingSaree,
        min_price: 10000,
        max_price: 20000
    },
    {
        id: 5,
        title: '₹30k – ₹50k - Festive Wear Sarees',
        type: 'small',
        image: festiveSaree,
        min_price: 30000,
        max_price: 50000
    }
];

import { resolveMediaUrl } from '@/config/api';

const getFilterUrlFromLabel = (label: string, minPrice: any, maxPrice: any) => {
    // Dynamically use price bounds passed directly from database/API
    let resolvedMin = minPrice !== undefined && minPrice !== null ? Math.round(Number(minPrice)) : 0;
    let resolvedMax = maxPrice !== undefined && maxPrice !== null ? Math.round(Number(maxPrice)) : 50000;
    
    const lowerLabel = label.toLowerCase();
    
    // In case min_price/max_price are not set or 0 on legacy structures, fallback to label parsing
    if (resolvedMin === 0 && resolvedMax === 0) {
        const cleanText = lowerLabel.replace(/₹/g, '').replace(/,/g, '');
        if (cleanText.includes('under') || cleanText.includes('below')) {
            resolvedMin = 0;
            const matches = cleanText.match(/(\d+)\s*k/);
            if (matches) {
                resolvedMax = Number(matches[1]) * 1000;
            } else {
                const numMatches = cleanText.match(/(\d+)/);
                if (numMatches) resolvedMax = Number(numMatches[1]);
            }
        } else {
            const parts = cleanText.split(/to|-|–|\//).map(p => p.trim());
            if (parts.length >= 2) {
                // Parse min
                const minPart = parts[0];
                if (minPart.includes('k')) {
                    const kVal = minPart.match(/(\d+(\.\d+)?)\s*k/);
                    if (kVal) resolvedMin = Number(kVal[1]) * 1000;
                } else {
                    const numVal = minPart.match(/(\d+)/);
                    if (numVal) resolvedMin = Number(numVal[1]);
                }
                
                // Parse max
                const maxPart = parts[1];
                if (maxPart.includes('k')) {
                    const kVal = maxPart.match(/(\d+(\.\d+)?)\s*k/);
                    if (kVal) resolvedMax = Number(kVal[1]) * 1000;
                } else {
                    const numVal = maxPart.match(/(\d+)/);
                    if (numVal) resolvedMax = Number(numVal[1]);
                }
            }
        }
    }

    let url = `/collections/products?min_price=${resolvedMin}&max_price=${resolvedMax}`;
    
    // Dynamic matching for categories
    const categoriesList = ['saree', 'lehanga', 'kurti', 'night-suit'];
    const matchedCategory = categoriesList.find(c => 
        lowerLabel.includes(c) || 
        (c === 'saree' && lowerLabel.includes('sarees')) || 
        (c === 'kurti' && lowerLabel.includes('kurtis')) ||
        (c === 'lehanga' && lowerLabel.includes('lehenga')) ||
        (c === 'night-suit' && lowerLabel.includes('nightsuit'))
    );
    
    if (matchedCategory) {
        let slug = matchedCategory;
        if (slug === 'saree') slug = 'sarees'; // Match frontend categories mapping
        if (slug === 'kurti') slug = 'kurtis';
        url += `&category=${slug}`;
    }
    
    // Dynamic matching for occasions
    const occasionsList = ['wedding', 'party', 'casual', 'office'];
    const matchedOccasion = occasionsList.find(o => 
        lowerLabel.includes(o) || 
        (o === 'wedding' && lowerLabel.includes('bridal')) ||
        (o === 'party' && lowerLabel.includes('festive')) ||
        (o === 'casual' && lowerLabel.includes('everyday')) ||
        (o === 'office' && lowerLabel.includes('work'))
    );
    
    if (matchedOccasion) {
        url += `&occasion=${matchedOccasion}`;
    }
    
    return url;
};

interface ShopByPriceProps {
    data?: any[];
}

const ShopByPrice = ({ data }: ShopByPriceProps) => {
    const sectionRef = useRef<HTMLElement>(null);

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
        id: item.price_filter_id || String(index + 1),
        title: item.label,
        type: index === 0 ? 'large' : 'small',
        image: item.image_url 
            ? resolveMediaUrl(item.image_url)
            : (index === 0 ? largeSaree : (index === 1 ? everydaySaree : (index === 2 ? officeSaree : (index === 3 ? weddingSaree : festiveSaree)))),
        url: item.redirect_url || getFilterUrlFromLabel(item.label, item.min_price, item.max_price)
    })) : priceData.map(item => ({
        ...item,
        url: getFilterUrlFromLabel(item.title, item.min_price, item.max_price)
    }));

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
