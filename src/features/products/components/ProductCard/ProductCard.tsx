"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './productCard.css';
import CartIcon from 'assets/icons/ui/shopping-cart.png';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { IMAGE_BASE, resolveMediaUrl } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import RatingStars from '@/components/ui/RatingStars/RatingStars';

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
    const { cart, addToCart, updateQuantity, removeFromCart, setDrawerOpen } = useCartStore();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const [isAdding, setIsAdding] = React.useState(false);
    const [qtyToSelect, setQtyToSelect] = React.useState(1);

    const rawId = product.product_id || product.id || (product.product && (product.product.product_id || product.product.id));
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const isLiked = isInWishlist(pid);
    const displayTitle = name || title;
    
    const displayPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    const displayOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.]/g, '')) : originalPrice;
    const imageUrl = resolveMediaUrl(image_url || image);

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

        const variantId = product.variant_id || product.default_variant_id || (product.variants && product.variants[0]?.variant_id) || null;
        const productIdToSend = (typeof pid === 'string' && !isNaN(pid as any)) ? Number(pid) : pid;

        console.log("ProductCard: Adding to cart", {
            pid,
            productIdToSend,
            variantId,
            product
        });

        setIsAdding(true);
        try {
            const result = await addToCart(productIdToSend, variantId, 1);
            if (result?.success) {
                toast.success('Added to cart!');
                setDrawerOpen(true);
            } else {
                toast.error(result?.message || 'Failed to add to cart');
            }
        } finally {
            setIsAdding(false);
        }
    };
    const cartItems = cart?.items || [];
    const existingCartItem = cartItems.find((item: any) => item.product_id === pid || item.product_id === Number(pid));

    const handleDecreaseQty = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!existingCartItem || isAdding) return;

        setIsAdding(true);
        try {
            if (existingCartItem.quantity > 1) {
                await updateQuantity(existingCartItem.cart_item_id, existingCartItem.quantity - 1);
            } else {
                await removeFromCart(existingCartItem.cart_item_id);
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleIncreaseQty = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!existingCartItem || isAdding) return;

        setIsAdding(true);
        try {
            if (existingCartItem.quantity < 10) {
                await updateQuantity(existingCartItem.cart_item_id, existingCartItem.quantity + 1);
            } else {
                toast.warning("Maximum limit of 10 reached", { position: "top-right" });
            }
        } finally {
            setIsAdding(false);
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
            </div>

            {/* Content Section */}
            <div className="product-info">
                <div className="product-text-top">
                    <h3 className="product-name">{displayTitle}</h3>
                    {(product.brand || product.category?.name) && (
                        <p className="product-category-label">{product.brand || product.category?.name}</p>
                    )}
                </div>

                <div className="product-rating-row mb-2">
                    <RatingStars rating={product.rating?.average || 4} size="small" />
                    {product.rating?.count > 0 && (
                        <span className="rating-count-label text-muted ms-1">({product.rating.count})</span>
                    )}
                </div>

                <div className="product-price-container-new mb-3">
                    <div className="product-price-row-new">
                        <span className="price-label-mrp">MRP</span>
                        {displayOriginalPrice && displayOriginalPrice > displayPrice ? (
                            <span className="price-original-strike">₹{Math.round(displayOriginalPrice).toLocaleString('en-IN')}</span>
                        ) : null}
                        <span className="price-current-bold">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>
                        <span className="price-info-icon-new" title="Inclusive of all taxes">ⓘ</span>
                    </div>
                    <div className="price-taxes-label-new">
                        (incl. of all taxes)
                    </div>
                </div>

                {isOutOfStock ? (
                    <button className="btn-add-to-cart-v2 disabled" disabled style={{ pointerEvents: 'none' }}>
                        OUT OF STOCK
                    </button>
                ) : (
                    <div className="d-flex align-items-center gap-2 w-100" onClick={(e) => e.stopPropagation()}>
                        <div className="product-card-qty-selector-new">
                            <button 
                                type="button"
                                className="product-card-qty-btn-new" 
                                onClick={existingCartItem ? handleDecreaseQty : () => setQtyToSelect(prev => Math.max(1, prev - 1))}
                                disabled={isAdding || (existingCartItem ? false : qtyToSelect <= 1)}
                            >
                                −
                            </button>
                            <span className="product-card-qty-val-new">
                                {isAdding ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px', color: '#1D3328' }}></span>
                                ) : (
                                    existingCartItem ? existingCartItem.quantity : qtyToSelect
                                )}
                            </span>
                            <button 
                                type="button"
                                className="product-card-qty-btn-new" 
                                onClick={existingCartItem ? handleIncreaseQty : () => setQtyToSelect(prev => Math.min(10, prev + 1))}
                                disabled={isAdding || (existingCartItem ? existingCartItem.quantity >= 10 : qtyToSelect >= 10)}
                            >
                                +
                            </button>
                        </div>
                        <button 
                            className="btn-add-to-cart-new flex-grow-1"
                            onClick={async (e) => {
                                e.stopPropagation();
                                const variantId = product.variant_id || product.default_variant_id || (product.variants && product.variants[0]?.variant_id) || null;
                                const productIdToSend = (typeof pid === 'string' && !isNaN(pid as any)) ? Number(pid) : pid;
                                
                                setIsAdding(true);
                                try {
                                    const result = await addToCart(productIdToSend, variantId, existingCartItem ? 1 : qtyToSelect);
                                    if (result?.success) {
                                        toast.success('Added to cart!');
                                        setDrawerOpen(true);
                                    } else {
                                        toast.error(result?.message || 'Failed to add to cart');
                                    }
                                } finally {
                                    setIsAdding(false);
                                }
                            }}
                            disabled={isAdding}
                        >
                            {isAdding ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                'ADD TO CART'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;

