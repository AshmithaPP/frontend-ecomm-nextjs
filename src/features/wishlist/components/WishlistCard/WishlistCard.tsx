"use client";

import React from 'react';
import './wishlistCard.css';
import { useWishlistStore } from '@/store/wishlistStore';
import { useRouter } from 'next/navigation';
import { resolveMediaUrl } from '@/config/api';

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
        // Use slug directly if already present in the wishlist item
        if (product.slug) {
            router.push(`/products/${product.slug}`);
            return;
        }
        // Derive slug from name using same rules as backend
        // e.g. "Kurthis" → "kurthis", "Women's Floral..." → "womens-floral-..."
        const slugified = name
            ? name
                .toLowerCase()
                .trim()
                .replace(/['']/g, '')          // remove apostrophes
                .replace(/[^a-z0-9\s-]/g, '')  // strip remaining special chars
                .replace(/\s+/g, '-')           // spaces → hyphens
                .replace(/-+/g, '-')            // collapse double hyphens
                .replace(/^-|-$/g, '')          // trim edge hyphens
            : pid;
        router.push(`/products/${slugified}`);
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(pid, product.variant_id || null);
    };

    const displayPrice = product.price ?? product.discountedPrice ?? product.originalPrice;
    const mrp = product.mrp ?? product.original_price ?? null;
    const imageUrl = resolveMediaUrl(product.image_url || product.image || "");

    const rating = product.rating;
    const gstIncluded: boolean | undefined =
        product.gst_included ?? product.gst?.gst_included;

    return (
        <div className="wishlist-item-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {/* ── Image ── */}
            <div className="wishlist-img-wrapper">
                <img
                    src={imageUrl}
                    alt={name}
                    className="wishlist-product-img"
                />
                <button
                    className="wishlist-remove-btn"
                    onClick={handleRemove}
                    aria-label="Remove item"
                >
                    <i className="bi bi-x" />
                </button>
            </div>

            {/* ── Details ── */}
            <div className="wishlist-product-details">
                <h5 className="wishlist-product-title">{name}</h5>

                {/* Pills row — rating + GST */}
                <div className="wl-pills-row">
                    {rating && typeof rating.value === 'number' && (
                        <span className="wl-pill wl-pill-rating">
                            ⭐ {rating.value}/{rating.scale ?? 5}
                            {rating.count > 0 && (
                                <span className="wl-pill-sub"> · {rating.count}</span>
                            )}
                        </span>
                    )}
                    {gstIncluded !== undefined && (
                        <span className={`wl-pill ${gstIncluded ? 'wl-pill-gst-incl' : 'wl-pill-gst-excl'}`}>
                            GST {gstIncluded ? 'Incl.' : 'Excl.'}
                        </span>
                    )}
                </div>

                {/* Price row */}
                <div className="wl-price-row">
                    {mrp && mrp > displayPrice && (
                        <span className="wl-price-mrp">MRP <s>₹{Math.round(mrp).toLocaleString('en-IN')}</s></span>
                    )}
                    <span className="wl-price-current">
                        ₹{parseFloat(String(displayPrice).replace(/[^0-9.]/g, '') || '0').toLocaleString('en-IN')}
                    </span>
                    {mrp && mrp > displayPrice && (
                        <span className="wl-discount-badge">
                            {Math.round(((mrp - displayPrice) / mrp) * 100)}% off
                        </span>
                    )}
                </div>

                <p className="wl-tax-note">Incl. of all taxes</p>
            </div>
        </div>
    );
};

export default WishlistCard;
