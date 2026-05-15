"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './productCard.css';
import CartIcon from 'assets/icons/ui/shopping-cart.png';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { IMAGE_BASE } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { 
        name, title, 
        price, originalPrice, 
        discount, image, image_url, 
        isBestSeller, id, product_id, slug, stockStatus, stock_status 
    } = product;
    
    const router = useRouter();
    const pathname = usePathname();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const rawId = product.product_id || product.id || (product.product && (product.product.product_id || product.product.id));
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const isLiked = isInWishlist(pid);
    const displayTitle = name || title;
    
    const displayPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    const displayOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.]/g, '')) : originalPrice;
    const imageUrl = image_url ? (image_url.startsWith('http') ? image_url : `${IMAGE_BASE}${image_url}`) : image;

    const isOutOfStock = stock_status === 'out_of_stock' || stockStatus === 'out_of_stock' || stock_status === 'sold_out';

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
            return;
        }
        toggleWishlist(product);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isOutOfStock) return;

        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
            return;
        }

        const variantId = product.variant_id || product.default_variant_id || (product.variants && product.variants[0]?.variant_id) || null;
        const productIdToSend = (typeof pid === 'string' && !isNaN(pid as any)) ? Number(pid) : pid;

        console.log("ProductCard: Adding to cart", {
            pid,
            productIdToSend,
            variantId,
            product
        });

        const result = await addToCart(productIdToSend, variantId, 1);
        if (result?.success) {
            toast.success('Added to cart!');
        } else {
            toast.error(result?.message || 'Failed to add to cart');
        }
    };

    const handleNavigate = () => {
        router.push(`/products/${slug || pid}`);
    };

    return (
        <div className="product-card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            {/* Image Section */}
            <div className="product-image-container">
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        alt={displayTitle} 
                        className="product-image" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}

                {/* Best Seller Tag */}
                {isBestSeller && (
                    <div className="best-seller-tag">
                        <span className="best-seller-text">Best Seller</span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button 
                    className={`wishlist-btn ${isLiked ? 'liked' : ''}`} 
                    aria-label="Add to wishlist"
                    onClick={handleWishlistToggle}
                >
                    <i className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'} wishlist-icon`}></i>
                </button>

                {/* Cart Button */}
                <button 
                    className="cart-btn" 
                    aria-label="Add to cart"
                    onClick={handleAddToCart}
                >
                    <Image src={CartIcon} alt="Add to cart" className="cart-icon" width={18} height={18} />
                </button>
            </div>

            {/* Content Section */}
            <div className="product-info">
                <h3 className="product-name">{displayTitle}</h3>

                <div className="price-row">
                    <span className="current-price">₹{displayPrice?.toLocaleString('en-IN')}</span>
                    {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                        <span className="original-price">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                    )}
                    {discount && (
                        <span className="discount-tag">{discount}% off</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

