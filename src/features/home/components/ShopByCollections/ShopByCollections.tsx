"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './ShopByCollections.module.css';
import ProductCard from 'components/ui/ProductCard';
import ArrowButton from 'components/common/ArrowButton';
import { useProductStore } from '@/store/productStore';

// Import images as fallbacks
import collection1 from 'assets/images/silk/collection1.png';
import collection2 from 'assets/images/silk/collection2.png';
import collection3 from 'assets/images/silk/collection3.png';
import collection4 from 'assets/images/silk/collection4.png';

interface ShopByCollectionsProps {
    title?: string;
    subtitle?: string;
    products?: any[];
}

const ShopByCollections = ({ 
    title = "Shop by Collections", 
    subtitle = "Curated selections for every occasion",
    products: initialProducts = [] 
}: ShopByCollectionsProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Zustand store
    const { products: storeProducts, loading, fetchProducts } = useProductStore();

    useEffect(() => {
        // Only fetch if no products were passed as props
        if (initialProducts.length === 0 && storeProducts.length === 0) {
            fetchProducts({ page: 1, limit: 12 });
        }
    }, [initialProducts.length, storeProducts.length, fetchProducts]);

    // Fallback products if both API and Props are empty
    const defaultProducts = [
        {
            id: 1,
            discount: "20% OFF",
            discountBg: "#10B981",
            title: "Bridal Kanchipuram Silk Saree",
            discountedPrice: "₹24,999",
            originalPrice: "₹29,999",
            image: collection1
        },
        {
            id: 2,
            discount: "30% OFF",
            discountBg: "#E11D48",
            title: "Traditional Kanchipuram Silk Saree",
            discountedPrice: "₹24,999",
            originalPrice: "₹29,999",
            image: collection2
        },
        {
            id: 3,
            discount: "30% OFF",
            discountBg: "#E11D48",
            title: "Light Weight Silk Saree",
            discountedPrice: "₹24,999",
            originalPrice: "₹29,999",
            image: collection3
        },
        {
            id: 4,
            discount: "50% OFF",
            discountBg: "#F59E0B",
            title: "Traditional Kanchipuram Silk Saree",
            discountedPrice: "₹24,999",
            originalPrice: "₹29,999",
            image: collection4
        }
    ];

    // Priority: Props > API Store > Loading State > Default Fallbacks
    const displayProducts = initialProducts.length > 0
        ? initialProducts
        : (storeProducts.length > 0 ? storeProducts : (loading ? [] : defaultProducts));

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320; 
        const offset = direction === 'left' ? -scrollAmount : scrollAmount;

        scrollRef.current.scrollBy({
            left: offset,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScroll);
            setTimeout(checkScroll, 100);
        }
        return () => {
            if (currentRef) currentRef.removeEventListener('scroll', checkScroll);
        };
    }, [displayProducts]);

    return (
        <section className={styles.collectionsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>

            <div className={styles.carouselWrapper}>
                <div className={styles.arrowLeft}>
                    <ArrowButton
                        direction="left"
                        onClick={() => handleScroll('left')}
                        disabled={!canScrollLeft}
                    />
                </div>

                <div className={styles.carouselContainer} ref={scrollRef}>
                    <div className={styles.productsTrack}>
                        {loading && initialProducts.length === 0 ? (
                            [...Array(4)].map((_, index) => (
                                <div key={`skeleton-${index}`} className={styles.cardItem}>
                                    <div className={styles.skeletonCard} style={{ 
                                        height: '400px', 
                                        backgroundColor: '#f0f0f0', 
                                        borderRadius: '8px',
                                        width: '280px'
                                    }}></div>
                                </div>
                            ))
                        ) : (
                            displayProducts.map((product) => (
                                <div key={product.id || product.product_id} className={styles.cardItem}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.arrowRight}>
                    <ArrowButton
                        direction="right"
                        onClick={() => handleScroll('right')}
                        disabled={!canScrollRight}
                    />
                </div>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.exploreMoreBtn}>
                    <span>Explore More</span>
                </button>
            </div>
        </section>
    );
};

export default ShopByCollections;

