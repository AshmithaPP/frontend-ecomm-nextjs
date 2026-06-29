"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WishlistButton from 'components/common/WishlistButton';
import AddToCartButton from 'components/common/AddToCartButton';
import styles from './ProductCard.module.css';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { resolveMediaUrl } from '@/config/api';

const splitName = (fullName: string) => {
    if (!fullName) return { brand: 'Silk Curator', name: 'Saree' };
    const words = fullName.trim().split(/\s+/);
    if (words.length <= 2) {
        return { brand: words[0] || 'Silk Curator', name: words.slice(1).join(' ') || 'Saree' };
    }
    return { brand: words.slice(0, 2).join(' '), name: words.slice(2).join(' ') };
};

const ProductCard = ({ product, className, cardClassName, imageClassName, variant = 'default' }: { product: any; className?: string; cardClassName?: string; imageClassName?: string; variant?: 'catalog' | 'default' }) => {
    const isCatalog = variant === 'catalog';
    const { title, name, image, image_url, discount, discountedPrice, price, originalPrice, original_price, discountBg, id, product_id, slug, stock_status } = product;
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const rawId = product_id || id;
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const displayTitle = name || title;
    const imageUrl = resolveMediaUrl(image_url || image);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImageLoaded(true);
        }
    }, [imageUrl]);
    
    // Resolve secondary image if available
    const gallery = product.media?.gallery_images || product.media?.gallery || product.gallery_images || product.gallery || [];
    const secondaryUrl = Array.isArray(gallery)
        ? gallery.find((url: string) => url && resolveMediaUrl(url) !== imageUrl)
        : null;
    const secondaryImageUrl = secondaryUrl ? resolveMediaUrl(secondaryUrl) : null;
    
    const cleanPriceStr = (discountedPrice !== undefined && discountedPrice !== null && discountedPrice !== '') 
        ? discountedPrice 
        : (price !== undefined && price !== null && price !== '' ? price : '');
    const cleanOriginalPriceStr = (originalPrice !== undefined && originalPrice !== null && originalPrice !== '') 
        ? originalPrice 
        : (original_price !== undefined && original_price !== null && original_price !== '' ? original_price : '');
    
    const priceNum = typeof cleanPriceStr === 'number' ? cleanPriceStr : parseFloat(String(cleanPriceStr).replace(/[^0-9.]/g, ''));
    const originalPriceNum = typeof cleanOriginalPriceStr === 'number' ? cleanOriginalPriceStr : parseFloat(String(cleanOriginalPriceStr).replace(/[^0-9.]/g, ''));

    const averageRating = product.rating?.average || product.rating || 0;
    const reviewsCount = product.rating?.count || product.reviews_count || 0;

    // Only use API's explicit discount_percentage — do NOT back-calculate from price diff
    // because the API may intentionally send discount_percentage: 0 even when prices differ
    const apiDiscountPercentage = product.discount_percentage ?? (product.product?.discount_percentage ?? 0);
    const hasRealDiscount = Number(apiDiscountPercentage) > 0;
    const calculatedDiscount = hasRealDiscount ? `${apiDiscountPercentage}% OFF` : "";

    const renderStars = (ratingVal: number) => {
        const stars = [];
        const roundedRating = Math.round(ratingVal);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i 
                    key={i} 
                    className={`bi ${i <= roundedRating ? 'bi-star-fill' : 'bi-star'}`} 
                    style={{ color: i <= roundedRating ? '#DE3E6B' : '#E0E0E0', marginRight: '2px', fontSize: '13px' }}
                />
            );
        }
        return stars;
    };

    const handleCardClick = () => {
        const resolvedSlug = slug || (displayTitle
            ? displayTitle
                .toLowerCase()
                .trim()
                .replace(/['']/g, '')          // remove apostrophes
                .replace(/[^a-z0-9\s-]/g, '')  // strip remaining special chars
                .replace(/\s+/g, '-')           // spaces → hyphens
                .replace(/-+/g, '-')            // collapse double hyphens
                .replace(/^-|-$/g, '')          // trim edge hyphens
            : pid);
        router.push(`/collections/products/${resolvedSlug}`);
    };

    return (
        <div className={`${styles.cardItem} ${className || ''}`} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className={`${styles.productCard} ${secondaryImageUrl ? styles.hasSecondary : ''} ${cardClassName || ''} ${isCatalog ? styles.catalogCard : ''}`}>
                {/* Image Section */}
                <div className={`${styles.imageWrapper} ${imageClassName || ''}`}>
                    {imageUrl && (
                        typeof imageUrl === 'string' ? (
                            <img 
                                ref={imgRef}
                                src={imageUrl} 
                                alt={displayTitle} 
                                className={`${styles.productImage} ${styles.primaryImage} ${imageLoaded ? styles.imageLoaded : ''}`} 
                                onLoad={() => setImageLoaded(true)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <Image 
                                src={imageUrl} 
                                alt={displayTitle} 
                                className={`${styles.productImage} ${styles.primaryImage} ${imageLoaded ? styles.imageLoaded : ''}`} 
                                onLoad={() => setImageLoaded(true)}
                                width={287} 
                                height={300} 
                            />
                        )
                    )}

                    {secondaryImageUrl && (
                        <img 
                            src={secondaryImageUrl} 
                            alt={`${displayTitle} - Alternate View`} 
                            className={`${styles.productImage} ${styles.secondaryImage}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}

                    <div className={styles.wishlistContainer}>
                        <WishlistButton product={product} />
                    </div>
                </div>

                {/* Details Section inside the same card */}
                <div className={styles.productInfo}>
                    <div className={styles.productDetailsGroup}>
                        {/* 1. Rating stars / badge */}
                        <div className={styles.ratingRow}>
                            {isCatalog ? (
                                <>
                                    <div className={styles.desktopStars}>
                                        {renderStars(parseFloat(String(averageRating || 0)))}
                                        <span className={styles.reviewsCount}>
                                            {reviewsCount > 0 ? `${reviewsCount} reviews` : '0 reviews'}
                                        </span>
                                    </div>
                                    <div className={styles.mobileRatingRow}>
                                        <div className={styles.mobileRatingLeft}>
                                            <span className={styles.ratingBadgePill}>
                                                {averageRating > 0 ? parseFloat(String(averageRating)).toFixed(1) : '4.2'} ★
                                            </span>
                                            <span className={styles.mobileReviewsText}>
                                                ({reviewsCount > 0 ? reviewsCount.toLocaleString('en-IN') : '8,471'})
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {renderStars(parseFloat(String(averageRating || 0)))}
                                    <span className={styles.reviewsCount}>
                                        {reviewsCount > 0 ? `${reviewsCount} reviews` : '0 reviews'}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* 2. Product title */}
                        {isCatalog ? (
                            (() => {
                                const { brand, name: namePart } = splitName(displayTitle);
                                return (
                                    <h4 className={styles.productTitle}>
                                        <span className={styles.productTitleBrand}>{brand}</span>{' '}
                                        <span className={styles.productTitleName}>{namePart}</span>
                                    </h4>
                                );
                            })()
                        ) : (
                            <h4 className={styles.productTitle}>{displayTitle}</h4>
                        )}

                        {/* 2b. Product tagline (Catalog Mobile only) */}
                        {isCatalog && product.tagline && (
                            <p className={styles.productTagline}>{product.tagline}</p>
                        )}

                        {/* 3. Product description */}
                        <p className={isCatalog ? `${styles.productDescription} ${styles.desktopOnly}` : styles.productDescription}>
                            {product.description || 'Premium handcrafted quality Saree'}
                        </p>

                        {/* 4. Discount tag */}
                        <div className={isCatalog ? styles.badgeWrapper : ''}>
                            {hasRealDiscount ? (
                                <div className={styles.discountTagPill}>
                                    Upto {calculatedDiscount}
                                </div>
                            ) : (
                                <div className={styles.newArrivalPill}>
                                    New Arrival
                                </div>
                            )}
                        </div>

                        {/* 5. Price & MRP Strikeout */}
                        <div className={styles.priceRow}>
                            <span className={styles.currentPrice}>₹{Math.round(priceNum).toLocaleString('en-IN')}</span>
                            {isCatalog ? (
                                !isNaN(originalPriceNum) && originalPriceNum > priceNum && (
                                    <div className={`${styles.pricePill} ${hasRealDiscount ? styles.hasDiscountPill : ''}`}>
                                        <span className={styles.originalPriceStrike}>
                                            ₹{Math.round(originalPriceNum).toLocaleString('en-IN')}
                                        </span>
                                        {hasRealDiscount && (
                                            <span className={styles.discountPercentBadge}>
                                                {apiDiscountPercentage}% off
                                            </span>
                                        )}
                                    </div>
                                )
                            ) : (
                                !isNaN(originalPriceNum) && originalPriceNum > priceNum && (
                                    <span className={styles.originalPriceContainer}>
                                        <span className={styles.mrpLabel}>MRP</span>
                                        <span className={styles.originalPriceStrike}>₹{Math.round(originalPriceNum).toLocaleString('en-IN')}</span>
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* 6. ADD TO CART Button */}
                    <div className={styles.cardBtnContainer} onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                            product={product}
                            classes={{
                                container: "d-flex align-items-center gap-2 w-100",
                                qtySelector: styles.qtySelectorColNew,
                                qtyBtn: styles.qtyOverlayBtnNew,
                                qtyVal: styles.qtyOverlayValNew,
                                addBtn: styles.btnOverlayAddToCartNew
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
