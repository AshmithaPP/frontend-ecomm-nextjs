"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useHomeStore } from '@/store/homeStore';
import previewGif from '@/assets/gif/preview.gif';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
    children: React.ReactNode;
}

export default function LoadingScreen({ children }: LoadingScreenProps) {
    const pathname = usePathname();
    const homeData = useHomeStore((state) => state.homeData);
    const homeError = useHomeStore((state) => state.error);
    const homeLoading = useHomeStore((state) => state.loading);

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let shouldHide = false;
        
        if (pathname === '/') {
            // On homepage, wait until data is actually fetched or an error occurs
            if (homeData !== null || homeError !== null) {
                shouldHide = true;
            }
        } else {
            // On other pages, hide immediately upon mounting
            shouldHide = true;
        }

        if (shouldHide) {
            setFadeOut(true);
            const finishTimer = setTimeout(() => {
                setLoading(false);
            }, 500); // 500ms transition time matching CSS

            return () => clearTimeout(finishTimer);
        }
    }, [mounted, pathname, homeData, homeError]);

    // Prevent scrolling of page content behind the loader during loading
    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [loading]);

    if (!loading) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Render the children invisibly in the DOM for SEO indexing */}
            <div className={`${styles.contentWrapper} ${fadeOut ? styles.contentVisible : ''}`}>
                {children}
            </div>

            <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ''}`}>
                <div className={styles.gifWrapper}>
                    <Image 
                        src={previewGif} 
                        alt="Loading..." 
                        className={styles.loaderGif}
                        priority
                        unoptimized // Required to keep GIFs animating correctly in Next.js
                    />
                </div>
            </div>
        </>
    );
}
