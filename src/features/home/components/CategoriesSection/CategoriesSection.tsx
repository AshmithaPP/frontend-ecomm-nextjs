"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from './CategoryCard';
import styles from './CategoriesSection.module.css';

// Import local assets
import bridalSaree from 'assets/images/bridal/bridal_saree.png';
import traditionalSilk from 'assets/images/bridal/traditional_silk.png';
import lightweightSilk from 'assets/images/bridal/lightweight_silk.png';

import { resolveMediaUrl } from '@/config/api';

interface CategoryItem {
    category_id: string;
    slug: string;
    category_name: string;
    product_count: string;
    image_url: string;
    redirect_url: string;
}

interface CategoriesSectionProps {
    dynamicCategories?: CategoryItem[];
    useCarousel?: boolean;
    title?: string;
    subtitle?: string;
}

const slugify = (value: string) => value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeCategoryUrl = (url: string, title: string) => {
    if (!url) return '/collections/products';
    if (url.includes('/collections/products')) return url;
    if (url.startsWith('/products')) return url.replace('/products', '/collections/products');
    if (url.startsWith('/collections/')) {
        const categorySlug = url.split('/').pop() || slugify(title);
        return `/collections/products?category=${encodeURIComponent(categorySlug)}`;
    }
    return `/collections/products?category=${encodeURIComponent(slugify(title))}`;
};

const CategoriesSection = ({
    dynamicCategories,
    useCarousel = true,
    title = "Shop by Category",
    subtitle = "Discover our exquisite collection of Naturals"
}: CategoriesSectionProps) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // ── Mobile carousel detection ────────────────────────────────────────────
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ── Carousel active state & navigation ───────────────────────────────────
    const [activeIndex, setActiveIndex] = useState(0);
    const showAsCarousel = useCarousel;

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const containerCenter = scrollLeft + containerWidth / 2;
        const children = container.children;

        let closestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const childCenter = child.offsetLeft + child.clientWidth / 2;
            const distance = Math.abs(containerCenter - childCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }

        setActiveIndex(prev => {
            if (prev !== closestIndex) {
                return closestIndex;
            }
            return prev;
        });
    };

    const handleDotClick = (index: number) => {
        const container = scrollContainerRef.current;
        if (container) {
            const targetChild = container.children[index] as HTMLElement;
            if (targetChild) {
                const containerWidth = container.clientWidth;
                const childWidth = targetChild.clientWidth;
                const targetScrollLeft = targetChild.offsetLeft - (containerWidth - childWidth) / 2;
                container.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    };

    // ── Category data (declared first so hooks can reference .length) ────────
    const categories = dynamicCategories && dynamicCategories.length > 0
        ? dynamicCategories.map(cat => ({
            id: cat.category_id,
            title: cat.category_name,
            count: cat.product_count,
            imageUrl: resolveMediaUrl(cat.image_url),
            url: cat.redirect_url
        }))
        : [
            { id: 1, title: "Bridal Kanchipuram Sarees", count: "320+", imageUrl: bridalSaree,     url: "/collections/bridal"      },
            { id: 2, title: "Traditional Silk Sarees",   count: "540+", imageUrl: traditionalSilk, url: "/collections/traditional" },
            { id: 3, title: "Lightweight Silk Sarees",   count: "210+", imageUrl: lightweightSilk, url: "/collections/lightweight" },
        ];

    // ── Scroll-reveal state ──────────────────────────────────────────────────
    const [headerVisible, setHeaderVisible] = useState(false);
    const [visibleCards, setVisibleCards]   = useState<boolean[]>(
        new Array(categories.length).fill(false)
    );

    useEffect(() => {
        // Honour prefers-reduced-motion — skip animations entirely
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setHeaderVisible(true);
            setVisibleCards(new Array(categories.length).fill(true));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const el   = entry.target as HTMLElement;
                    const kind = el.dataset.reveal;

                    if (kind === 'header') {
                        setHeaderVisible(true);
                    } else if (kind === 'card') {
                        const idx = parseInt(el.dataset.index ?? '0', 10);
                        setVisibleCards(prev => {
                            const next = [...prev];
                            next[idx]  = true;
                            return next;
                        });
                    }
                    observer.unobserve(el); // fire once per element
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
        );

        const section = sectionRef.current;
        if (!section) return;

        // Observe the header block
        const header = section.querySelector('[data-reveal="header"]');
        if (header) observer.observe(header);

        // Observe every card wrapper
        section.querySelectorAll('[data-reveal="card"]').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories.length]);

    const handleCardClick = (cardTitle: string) => {
        const found = categories.find(c => c.title === cardTitle);
        const targetUrl = found ? normalizeCategoryUrl(found.url, cardTitle) : '/collections/products';
        router.push(targetUrl);
    };

    // ── Carousel layout (> 3 categories) ────────────────────────────────────
    if (showAsCarousel) {
        return (
            <div className={styles.sectionContainer} ref={sectionRef}>
                <div
                    data-reveal="header"
                    className={`${styles.headerWrapper} ${headerVisible ? styles.revealVisible : styles.revealHidden}`}
                >
                    <h2 className={styles.sectionTitle}>{title}</h2>
                    <p className={styles.sectionSubtitle}>{subtitle}</p>
                    <div className={styles.titleAccent}></div>
                </div>

                <div className={styles.carouselWrapper}>
                    <div 
                        className={styles.scrollContainer} 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                    >
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className={`${styles.cardWrapper} ${visibleCards[index] ? styles.revealVisible : styles.revealHidden}`}
                                data-reveal="card"
                                data-index={index}
                                style={{ transitionDelay: `${index * 45}ms` }} // Reduced staggered delay for snappier reveal
                            >
                                <CategoryCard
                                    title={category.title}
                                    count={category.count}
                                    imageUrl={category.imageUrl}
                                    onClick={handleCardClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots indicator */}
                {categories.length > 1 && (
                    <div className={styles.indicatorsWrapper}>
                        {categories.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.indicatorDot} ${activeIndex === index ? styles.indicatorDotActive : ''}`}
                                onClick={() => handleDotClick(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── Grid layout (≤ 3 categories — default) ──────────────────────────────
    return (
        <div className={styles.sectionContainer} ref={sectionRef}>
            <div
                data-reveal="header"
                className={`${styles.headerWrapper} ${headerVisible ? styles.revealVisible : styles.revealHidden}`}
            >
                <h2 className={styles.sectionTitle}>{title}</h2>
                <p className={styles.sectionSubtitle}>{subtitle}</p>
                <div className={styles.titleAccent}></div>
            </div>

            <div className={`row g-4 justify-content-center ${styles.customGutter}`}>
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        className={`col-lg-4 col-md-6 col-12 d-flex justify-content-center ${styles.cardRevealWrap} ${visibleCards[index] ? styles.revealVisible : styles.revealHidden}`}
                        data-reveal="card"
                        data-index={index}
                        style={{ transitionDelay: `${index * 90}ms` }}
                    >
                        <CategoryCard
                            title={category.title}
                            count={category.count}
                            imageUrl={category.imageUrl}
                            onClick={handleCardClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSection;