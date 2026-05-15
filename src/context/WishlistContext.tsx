"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface WishlistContextType {
    wishlistItems: any[];
    addToWishlist: (product: any) => void;
    removeFromWishlist: (productId: string | number) => void;
    toggleWishlist: (product: any) => void;
    isInWishlist: (productId: string | number) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const countRef = useRef(0);
    const toastId = useRef<any>(null);

    // Initialize from localStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isInitialized]);

    const showDynamicToast = (message: string, countValue: number, type: 'success' | 'info' = 'success') => {
        const toastMsg = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>
                    {countValue > 1 ? `(${countValue}) ${message}s` : message}
                </span>
                <a
                    href="/wishlist"
                    style={{
                        fontSize: '12px',
                        color: '#D4AF37',
                        textDecoration: 'none',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        display: 'inline-block'
                    }}
                >
                    View Wishlist →
                </a>
            </div>
        );

        if (toastId.current && toast.isActive(toastId.current)) {
            toast.update(toastId.current, {
                render: toastMsg,
                type: type === 'success' ? 'success' : 'info',
                autoClose: 3000
            });
        } else {
            countRef.current = 1;
            toastId.current = (toast as any)[type](toastMsg, {
                onClose: () => { countRef.current = 0; toastId.current = null; },
                icon: true
            });
        }
    };

    const addToWishlist = (product: any) => {
        if (wishlistItems.find((item) => item.id === product.id)) return;
        setWishlistItems((prev) => [...prev, product]);

        countRef.current += 1;
        showDynamicToast("item added to wishlist", countRef.current, 'success');
    };

    const removeFromWishlist = (productId: string | number) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

        countRef.current += 1;
        showDynamicToast("item removed from wishlist", countRef.current, 'info');
    };

    const toggleWishlist = (product: any) => {
        const isCurrentlyInWishlist = wishlistItems.some((item) => item.id === product.id);
        if (isCurrentlyInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId: string | number) => {
        return wishlistItems.some((item) => item.id === productId);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
