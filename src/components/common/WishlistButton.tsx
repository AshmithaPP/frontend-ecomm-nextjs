"use client";

import React from 'react';
import styles from './WishlistButton.module.css';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

const WishlistButton = ({ product }: { product: any }) => {
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const pid = product?.product_id || product?.id;
    const isLiked = isInWishlist(pid);

    const toggleLike = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
            return;
        }

        if (product) {
            toggleWishlist(product);
        }
    };

    return (
        <button
            className={`${styles.wishlistBtn} ${isLiked ? styles.liked : ''}`}
            onClick={toggleLike}
            aria-label="Add to wishlist"
        >
            <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
    );
};

export default WishlistButton;

