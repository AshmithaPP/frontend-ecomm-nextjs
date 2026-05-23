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
import { IMAGE_BASE, resolveMediaUrl } from '@/config/api';

const ProductCard = ({ product }: { product: any }) => {
    const { title, name, image, image_url, discount, discountedPrice, price, originalPrice, original_price, discountBg, id, product_id, slug, stockStatus, stock_status } = product;
    const { cart, addToCart, updateQuantity, removeFromCart, setDrawerOpen } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdding, setIsAdding] = React.useState(false);
    const [qtyToSelect, setQtyToSelect] = React.useState(1);

    const rawId = product_id || id;
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const displayTitle = name || title;
    const imageUrl = resolveMediaUrl(image_url || image);
    
    const cleanPriceStr = discountedPrice || price || '';
    const cleanOriginalPriceStr = originalPrice || original_price || '';
    
    const priceNum = typeof cleanPriceStr === 'number' ? cleanPriceStr : parseFloat(String(cleanPriceStr).replace(/[^0-9.]/g, ''));
    const originalPriceNum = typeof cleanOriginalPriceStr === 'number' ? cleanOriginalPriceStr : parseFloat(String(cleanOriginalPriceStr).replace(/[^0-9.]/g, ''));

    const isOutOfStock = stock_status === 'out_of_stock' || stock_status === 'sold_out';

    const cartItems = cart?.items || [];
    const existingCartItem = cartItems.find((item: any) => item.product_id === pid || item.product_id === Number(pid));

    const handleCardClick = () => {
        router.push(`/products/${slug || pid}`);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isOutOfStock) return;

        const variantId = product.variant_id || product.default_variant_id || (product.variants && product.variants[0]?.variant_id) || null;
        const productIdToSend = (typeof pid === 'string' && !isNaN(pid as any)) ? Number(pid) : pid;

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

                    <div 
                        className={styles.qtyOverlay} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.qtySelectorCol}>
                            <button 
                                type="button"
                                className={styles.qtyOverlayBtn}
                                onClick={existingCartItem ? handleDecreaseQty : () => setQtyToSelect(prev => Math.max(1, prev - 1))}
                                disabled={isAdding || (existingCartItem ? false : qtyToSelect <= 1)}
                            >
                                −
                            </button>
                            <span className={styles.qtyOverlayVal}>
                                {isAdding ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px', color: '#1D3328' }}></span>
                                ) : (
                                    existingCartItem ? existingCartItem.quantity : qtyToSelect
                                )}
                            </span>
                            <button 
                                type="button"
                                className={styles.qtyOverlayBtn}
                                onClick={existingCartItem ? handleIncreaseQty : () => setQtyToSelect(prev => Math.min(10, prev + 1))}
                                disabled={isAdding || (existingCartItem ? existingCartItem.quantity >= 10 : qtyToSelect >= 10)}
                            >
                                +
                            </button>
                        </div>
                        <button 
                            className={styles.btnOverlayAddToCart}
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (isOutOfStock) return;
                                
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
                </div>
            </div>

            {/* ── TEXT & PRICE — separately below the card ── */}
            <div className={styles.productInfo}>
                <h4 className={styles.productTitle}>{displayTitle}</h4>
                <div className={styles.productPriceContainerNew}>
                    <div className={styles.productPriceRowNew}>
                        <span className={styles.priceLabelMrp}>MRP</span>
                        {!isNaN(originalPriceNum) && originalPriceNum > priceNum ? (
                            <span className={styles.priceOriginalStrike}>₹{Math.round(originalPriceNum).toLocaleString('en-IN')}</span>
                        ) : null}
                        <span className={styles.priceCurrentBold}>₹{Math.round(priceNum).toLocaleString('en-IN')}</span>
                        <span className={styles.priceInfoIconNew} title="Inclusive of all taxes">ⓘ</span>
                    </div>
                    <div className={styles.priceTaxesLabelNew}>
                        (incl. of all taxes)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

