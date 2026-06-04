"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import TrendingCard from './TrendingCard';
import './trendingPicks.css';
import { resolveMediaUrl } from '@/config/api';

// Import images from assets
import occasion1 from 'assets/images/bridal/occasion1.png';
import occasion2 from 'assets/images/bridal/occasion2.png';
import occasion3 from 'assets/images/bridal/occasion3.png';
import occasion4 from 'assets/images/bridal/occasion4.png';
import occasion5 from 'assets/images/cotton/occasion5.png';
import collection1 from 'assets/images/silk/collection1.png';
import collection2 from 'assets/images/silk/collection2.png';
import collection3 from 'assets/images/silk/collection3.png';

interface TrendingCardData {
    id: number | string;
    title: string;
    size?: 'large' | 'small' | 'equal';
    image: any;
    slug?: string;
}

const trendingCardsData: TrendingCardData[] = [
    { id: 1, title: 'Pure Kanchipuram Silks', size: 'large', image: occasion1 },
    { id: 2, title: 'Temple Border Kanchipuram', size: 'small', image: occasion2 },
    { id: 3, title: 'Zari Rich Kanchipuram', size: 'small', image: occasion3 },
    { id: 4, title: 'Traditional Kanchipuram Bridal', size: 'small', image: occasion4 },
    { id: 5, title: 'Contrast Border Kanchipuram', size: 'small', image: occasion5 },
    { id: 6, title: 'Handwoven Kanchipuram Classics', size: 'equal', image: collection1 },
    { id: 7, title: 'Muted Gold Kanchipuram', size: 'equal', image: collection2 },
    { id: 8, title: 'Contemporary Kanchipuram Silks', size: 'equal', image: collection3 }
];

interface TrendingPicksProps {
    data?: any[];
}

const TrendingPicks = ({ data }: TrendingPicksProps) => {
    // Refs for layout measurement and observing
    const sectionRef = useRef<HTMLElement>(null);
    const featuredRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const mobileTrackRef = useRef<HTMLDivElement>(null);
    const mobileFirstCardRef = useRef<HTMLDivElement>(null);
    const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

    // Animation & Carousel state
    const [stage, setStage] = useState<'idle' | 'measuring' | 'animating' | 'completed'>('idle');
    const [offsets, setOffsets] = useState<Array<{ dx: number; dy: number }>>([]);
    const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

    const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoplayResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // If data is provided from backend, map it, otherwise use static data
    const displayData: TrendingCardData[] = data && data.length > 0
        ? data.map((item, index) => ({
            id: item.id || index,
            title: item.name || item.title,
            size: (index === 0 ? 'large' : 'small') as 'large' | 'small', // Simple layout logic
            image: item.image_url ? resolveMediaUrl(item.image_url) : item.image,
            slug: item.slug
        }))
        : trendingCardsData;

    // Start/Stop Autoplay for Mobile Carousel
    const startAutoplay = useCallback(() => {
        stopAutoplay();
        autoplayTimerRef.current = setInterval(() => {
            if (stage !== 'completed') return;
            setCurrentMobileSlide((prev) => {
                const next = (prev + 1) % displayData.length;
                scrollToSlide(next);
                return next;
            });
        }, 3500); // Auto-play every 3.5 seconds
    }, [stage, displayData.length]);

    const stopAutoplay = useCallback(() => {
        if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
        }
    }, []);

    // Pause autoplay on user touch/drag
    const handleInteractionStart = () => {
        stopAutoplay();
        if (autoplayResumeTimeoutRef.current) {
            clearTimeout(autoplayResumeTimeoutRef.current);
            autoplayResumeTimeoutRef.current = null;
        }
    };

    const handleInteractionEnd = () => {
        if (autoplayResumeTimeoutRef.current) {
            clearTimeout(autoplayResumeTimeoutRef.current);
        }
        autoplayResumeTimeoutRef.current = setTimeout(() => {
            startAutoplay();
        }, 3000); // Resume autoplay after 3 seconds of inactivity
    };

    // Scroll to a specific slide programmatically
    const scrollToSlide = (index: number) => {
        const track = mobileTrackRef.current;
        if (!track) return;

        const slides = [mobileFirstCardRef.current, ...mobileCardRefs.current];
        const targetSlide = slides[index];

        if (targetSlide) {
            const slideLeft = targetSlide.offsetLeft;
            const slideWidth = targetSlide.clientWidth;
            const trackWidth = track.clientWidth;
            const targetScrollLeft = slideLeft - (trackWidth - slideWidth) / 2;

            track.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth',
            });
            setCurrentMobileSlide(index);
        }
    };

    // Track active slide on scroll
    const handleMobileScroll = () => {
        const track = mobileTrackRef.current;
        if (!track) return;

        const scrollLeft = track.scrollLeft;
        const totalSlides = displayData.length;
        if (totalSlides <= 1) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;

        const index = Math.round((scrollLeft / maxScroll) * (totalSlides - 1));
        if (index >= 0 && index < totalSlides) {
            setCurrentMobileSlide(index);
        }
    };

    // Intersection Observer to trigger animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    observer.disconnect();

                    // Check prefers-reduced-motion
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) {
                        setStage('completed');
                        return;
                    }

                    const width = window.innerWidth;
                    const isMobileViewport = width < 768;

                    if (isMobileViewport) {
                        // Mobile Animation Trigger
                        setStage('animating');
                        setTimeout(() => {
                            setStage('completed');
                        }, 1300);
                    } else {
                        // Desktop Animation Trigger & Measurement
                        const featuredEl = featuredRef.current;
                        if (!featuredEl) {
                            setStage('animating');
                            return;
                        }

                        // Calculate featured card center
                        const featuredRect = featuredEl.getBoundingClientRect();
                        const featuredCenter = {
                            x: featuredRect.left + featuredRect.width / 2,
                            y: featuredRect.top + featuredRect.height / 2
                        };

                        // Calculate each remaining card's offset relative to featured center
                        const computedOffsets = cardRefs.current.map((el) => {
                            if (!el) return { dx: 0, dy: 0 };
                            const rect = el.getBoundingClientRect();
                            const cardCenter = {
                                x: rect.left + rect.width / 2,
                                y: rect.top + rect.height / 2
                            };
                            return {
                                dx: featuredCenter.x - cardCenter.x,
                                dy: featuredCenter.y - cardCenter.y
                            };
                        });

                        setOffsets(computedOffsets);
                        setStage('measuring');
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [displayData.length]);

    // Handle measuring -> animating transition
    useEffect(() => {
        if (stage === 'measuring') {
            let rAFId1: number;
            let rAFId2: number;

            // Wait for offsets to propagate, then animate in the next frame
            rAFId1 = requestAnimationFrame(() => {
                rAFId2 = requestAnimationFrame(() => {
                    setStage('animating');
                });
            });

            // Snappy follow-up timing: remaining cards start at 450ms, staggered by 50ms
            const totalDuration = 450 + (displayData.length - 1) * 50 + 600;
            const timeoutId = setTimeout(() => {
                setStage('completed');
            }, totalDuration);

            return () => {
                cancelAnimationFrame(rAFId1);
                cancelAnimationFrame(rAFId2);
                clearTimeout(timeoutId);
            };
        }
    }, [stage, displayData.length]);

    // Mobile autoplay effect
    useEffect(() => {
        if (stage === 'completed') {
            startAutoplay();
        }
        return () => {
            stopAutoplay();
            if (autoplayResumeTimeoutRef.current) {
                clearTimeout(autoplayResumeTimeoutRef.current);
            }
        };
    }, [stage, startAutoplay, stopAutoplay]);

    // Dynamic styles for Desktop
    const getFeaturedStyle = (): React.CSSProperties => {
        if (stage === 'idle') {
            return { opacity: 0, transform: 'scale(1.2)' };
        }
        if (stage === 'animating' || stage === 'measuring') {
            return {
                opacity: 1,
                transform: 'scale(1)',
                transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease-out'
            };
        }
        return {}; // completed stage: remove styles
    };

    const getCardStyle = (index: number): React.CSSProperties => {
        if (stage === 'idle') {
            return { opacity: 0 };
        }
        if (stage === 'measuring') {
            const offset = offsets[index - 1] || { dx: 0, dy: 0 };
            return {
                opacity: 0,
                transform: `translate(${offset.dx}px, ${offset.dy}px) scale(0.8)`,
                transition: 'none'
            };
        }
        if (stage === 'animating') {
            const offset = offsets[index - 1] || { dx: 0, dy: 0 };
            const delay = 450 + (index - 1) * 50; // Quicker follow-up (450ms) and tighter stagger (50ms)
            return {
                opacity: 1,
                transform: 'translate(0px, 0px) scale(1)',
                transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 600ms ease-out',
                transitionDelay: `${delay}ms`
            };
        }
        return {}; // completed stage: remove styles
    };

    // Dynamic styles for Mobile
    const getMobileSlideStyle = (index: number): React.CSSProperties => {
        if (stage === 'idle') {
            return index === 0
                ? { opacity: 0, transform: 'scale(1.2)' }
                : { opacity: 0, transform: 'translateX(50px)' };
        }
        if (stage === 'animating') {
            if (index === 0) {
                return {
                    opacity: 1,
                    transform: 'scale(1)',
                    transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease-out'
                };
            } else {
                const delay = 450 + (index - 1) * 60; // Snappier mobile follow-up and stagger
                return {
                    opacity: 1,
                    transform: 'translateX(0px)',
                    transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out',
                    transitionDelay: `${delay}ms`
                };
            }
        }
        return {}; // completed stage: remove styles
    };

    return (
        <section ref={sectionRef} className="trending-picks-section">
            <div className="container">
                <h2 className="trending-title">Trending Picks</h2>
            </div>

            {/* Desktop Layout */}
            <div className="trending-grid desktop-only">
                <div className="top-section">
                    <div className="left-column">
                        {displayData[0] && (
                            <TrendingCard
                                ref={featuredRef}
                                style={getFeaturedStyle()}
                                {...displayData[0]}
                            />
                        )}
                    </div>
                    <div className="right-column">
                        {displayData.slice(1, 5).map((card, idx) => (
                            <TrendingCard
                                key={card.id}
                                ref={(el) => { cardRefs.current[idx] = el; }}
                                style={getCardStyle(idx + 1)}
                                {...card}
                            />
                        ))}
                    </div>
                </div>

                <div className="bottom-section">
                    {displayData.slice(5).map((card, idx) => (
                        <TrendingCard
                            key={card.id}
                            ref={(el) => { cardRefs.current[idx + 4] = el; }}
                            style={getCardStyle(idx + 5)}
                            {...card}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Layout */}
            <div
                className="trending-mobile-carousel mobile-only"
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
                onTouchCancel={handleInteractionEnd}
                onMouseDown={handleInteractionStart}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
            >
                <div
                    className="mobile-carousel-track"
                    ref={mobileTrackRef}
                    onScroll={handleMobileScroll}
                >
                    {displayData.map((card, idx) => (
                        <div
                            key={card.id}
                            ref={idx === 0 ? mobileFirstCardRef : (el) => { mobileCardRefs.current[idx - 1] = el; }}
                            className="mobile-carousel-slide"
                            style={getMobileSlideStyle(idx)}
                        >
                            <TrendingCard {...card} />
                        </div>
                    ))}
                </div>
                <div className="mobile-carousel-dots">
                    {displayData.map((_, idx) => (
                        <button
                            key={idx}
                            className={`carousel-dot ${currentMobileSlide === idx ? 'active' : ''}`}
                            onClick={() => {
                                handleInteractionStart();
                                scrollToSlide(idx);
                                handleInteractionEnd();
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingPicks;
