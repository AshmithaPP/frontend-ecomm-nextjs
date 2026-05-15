"use client";

import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import WishlistButton from 'components/common/WishlistButton';
import styles from './ProductCard.module.css';
import cartIcon from 'assets/icons/ui/cartIcon.png';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { IMAGE_BASE } from '@/config/api';

const ProductCard = ({ product }: { product: any }) => {
    const { title, name, image, image_url, discount, discountedPrice, price, originalPrice, original_price, discountBg, id, product_id, slug, stockStatus, stock_status } = product;
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const rawId = product_id || id;
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const displayTitle = name || title;
    const displayPrice = discountedPrice || (price ? `₹${price}` : '');
    const displayOriginalPrice = originalPrice || (original_price ? `₹${original_price}` : '');
    const imageUrl = image_url ? (image_url.startsWith('http') ? image_url : `${IMAGE_BASE}${image_url}`) : image;

    const isOutOfStock = stock_status === 'out_of_stock' || stock_status === 'sold_out';

    const handleCardClick = () => {
        router.push(`/products/${slug || pid}`);
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

        const result = await addToCart(productIdToSend, variantId, 1);
        if (result?.success) {
            toast.success('Added to cart!');
        } else {
            toast.error(result?.message || 'Failed to add to cart');
        }
    };

    return (
        <div className={styles.cardItem} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {/* ── CARD (image + overlays only) ── */}
            <div className={styles.productCard}>
                <div className={styles.imageWrapper}>
                    {imageUrl && (
                        typeof imageUrl === 'string' ? (
                            <img src={imageUrl} alt={displayTitle} className={styles.productImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Image src={imageUrl} alt={displayTitle} className={styles.productImage} width={287} height={369} />
                        )
                    )}

                    {discount && (
                        <div
                            className={styles.discountBadge}
                            style={{ backgroundColor: discountBg || '#10B981' }}
                        >
                            {discount}
                        </div>
                    )}

                    <div className={styles.wishlistContainer}>
                        <WishlistButton product={product} />
                    </div>

                    <div className={styles.addToCartOverlay} onClick={handleAddToCart}>
                        <Image src={cartIcon} alt="Cart" className={styles.cartIconImage} width={27} height={27} />
                        <span className={styles.addToCartText}>Add to Cart</span>
                    </div>
                </div>
            </div>

            {/* ── TEXT & PRICE — separately below the card ── */}
            <div className={styles.productInfo}>
                <h4 className={styles.productTitle}>{displayTitle}</h4>
                <div className={styles.priceContainer}>
                    <span className={styles.discountedPrice}>{displayPrice}</span>
                    {displayOriginalPrice && (
                        <span className={styles.originalPrice}>{displayOriginalPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

