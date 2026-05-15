"use client";

import React from 'react';
import './wishlistCard.css';
import { useWishlistStore } from '@/store/wishlistStore';
import { useRouter } from 'next/navigation';
import { IMAGE_BASE } from '@/config/api';

interface WishlistCardProps {
    product: any;
}

const WishlistCard = ({ product }: WishlistCardProps) => {
    const { toggleWishlist } = useWishlistStore();
    const router = useRouter();

    const pid = product.product_id || product.id;
    const slug = product.slug || pid;
    const name = product.product_name || product.name || product.title;

    const handleCardClick = () => {
        router.push(`/products/${slug}`);
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(pid, product.variant_id || null);
    };

    const displayPrice = product.price || product.discountedPrice || product.originalPrice;
    const imageUrl = product.image_url 
        ? (product.image_url.startsWith('http') ? product.image_url : `${IMAGE_BASE}${product.image_url}`) 
        : (product.image || "");

    return (
        <div className="wishlist-item-card text-center" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="wishlist-img-wrapper">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="wishlist-product-img" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button 
                    className="wishlist-remove-btn" 
                    onClick={handleRemove}
                    aria-label="Remove item"
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
            <div className="wishlist-product-details mt-2">
                <h5 className="wishlist-product-title mb-1">{name}</h5>
                <p className="wishlist-product-price font-weight-bold mb-0">
                    ₹{parseFloat(String(displayPrice).replace(/[^0-9.]/g, '') || '0').toLocaleString('en-IN')}
                </p>
            </div>
        </div>
    );
};

export default WishlistCard;

