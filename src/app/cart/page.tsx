"use client";

import React, { useEffect } from 'react';
import Breadcrumbs from 'components/ui/Breadcrumbs/Breadcrumbs';
import CartItem from 'features/cart/components/CartItem/CartItem';
import CartSummary from 'features/cart/components/CartSummary/CartSummary';
import { useCartStore } from '@/store/cartStore';
import './cartPage.css';
import Link from 'next/link';

const CartPage = () => {
    const { cart, fetchCart, loading } = useCartStore();
    const cartItems = cart.items || [];

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/products' },
        { label: 'ShoppingCart', path: '/cart' }
    ];

    if (loading && cartItems.length === 0) {
        return (
            <div className="cart-page-wrapper py-5 text-center">
                <div className="spinner-border text-maroon" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper py-5">
            <div className="cart-page-inner px-3 px-md-5">
                {/* Breadcrumbs Row */}
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-start">
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="cart-page-title text-center mb-5">Your Cart Items</h2>

                {cartItems.length > 0 ? (
                    <div className="row g-3 g-md-4 g-lg-5">
                        {/* Left: Cart Items */}
                        <div className="col-lg-7">
                            <div className="cart-items-list">
                                {cartItems.map((item) => (
                                    <CartItem key={item.product_id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Right: Cart Summary */}
                        <div className="col-lg-5">
                            <CartSummary />
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart-message text-center py-5">
                        <i className="bi bi-cart-x pulse-cart" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                        <h4 className="mt-3">Your cart is empty</h4>
                        <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/products" className="btn btn-dark mt-3 px-4 py-2">Start Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

