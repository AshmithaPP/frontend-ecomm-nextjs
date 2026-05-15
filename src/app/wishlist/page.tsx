"use client";

import React, { useEffect } from 'react';
import Breadcrumbs from 'components/ui/Breadcrumbs/Breadcrumbs';
import Sidebar from 'features/wishlist/components/Sidebar/Sidebar';
import WishlistCard from 'features/wishlist/components/WishlistCard/WishlistCard';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import './wishlistPage.css';
import Link from 'next/link';

const WishlistPage = () => {
    const { items: wishlistItems, fetchWishlist } = useWishlistStore();
    const { addToCart } = useCartStore();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleAddAllToCart = () => {
        wishlistItems.forEach(item => {
            addToCart(item.product_id || item.id, item.variant_id || null);
        });
    };

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Wishlist', path: '/wishlist' }
    ];

    return (
        <div className="wishlist-page-container container-fluid px-md-5 py-4">
            {/* Breadcrumbs */}
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-start">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>

            {/* Layout Box container for exact replica background */}
            <div className="wishlist-layout-wrapper">
                <div className="row g-4">
                    {/* Left Sidebar */}
                    <div className="col-lg-3 col-md-4">
                        <Sidebar />
                    </div>

                    {/* Right Content */}
                    <div className="col-lg-9 col-md-8">
                        <div className="wishlist-content-area">
                            {wishlistItems.length > 0 ? (
                                <>
                                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                                        {wishlistItems.map((item) => (
                                            <div className="col" key={`${item.product_id || item.id}-${item.variant_id || 'default'}`}>
                                                <WishlistCard product={item} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add All to Cart Button */}
                                    <div className="row mt-5">
                                        <div className="col-12 d-flex justify-content-center">
                                            <button 
                                                className="btn fetch-all-cart-btn" 
                                                onClick={handleAddAllToCart}
                                            >
                                                <i className="bi bi-cart3 me-2"></i> Add all Products to Cart
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="empty-wishlist-message text-center py-5">
                                    <i className="bi bi-heart pulse-heart" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                    <h4 className="mt-3">Your wishlist is empty</h4>
                                    <p className="text-muted">Browse our collection and add your favorite sarees to the wishlist!</p>
                                    <Link href="/products" className="btn btn-dark mt-3 px-4 py-2">Continue Shopping</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;

