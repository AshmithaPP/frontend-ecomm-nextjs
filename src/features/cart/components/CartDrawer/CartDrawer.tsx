"use client";

import React, { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import CartItem from '../CartItem/CartItem';
import './cartDrawer.css';
import { useRouter } from 'next/navigation';

const CartDrawer = () => {
    const { cart, isDrawerOpen, setDrawerOpen, fetchCart } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        if (isDrawerOpen) {
            fetchCart();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isDrawerOpen, fetchCart]);

    if (!isDrawerOpen) return null;

    const items = cart.items || [];
    const summary = cart.summary || { total: 0 };
    const totalAmount = parseFloat(String(summary.total || '0'));
    const freeShippingThreshold = parseFloat(String(summary.free_shipping_threshold || '5000'));
    const progress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
    const amountLeft = Math.max(freeShippingThreshold - totalAmount, 0);

    const handleCheckout = () => {
        setDrawerOpen(false);
        router.push('/checkout');
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setDrawerOpen(false);
        }
    };

    return (
        <div className="cart-drawer-backdrop" onClick={handleBackdropClick}>
            <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h5 className="m-0">Your Cart ({items.length})</h5>
                    <button className="close-drawer-btn" onClick={() => setDrawerOpen(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="cart-drawer-content">
                    {/* Free Shipping Progress */}
                    <div className="drawer-shipping-progress p-3">
                        <p className="shipping-info text-center mb-2">
                            {amountLeft > 0 ? (
                                <>Add <strong>₹{amountLeft.toLocaleString('en-IN')}</strong> more for <strong>FREE Shipping</strong></>
                            ) : (
                                <span className="text-success">🎉 FREE Shipping Unlocked!</span>
                            )}
                        </p>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="drawer-items-list px-3">
                        {items.length === 0 ? (
                            <div className="empty-cart-msg text-center py-5">
                                <i className="bi bi-bag-x mb-3 d-block" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                <p>Your cart is empty</p>
                                <button className="btn btn-dark mt-2" onClick={() => { setDrawerOpen(false); router.push('/products'); }}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <CartItem key={item.cart_item_id || index} item={item} />
                            ))
                        )}
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="cart-drawer-footer p-3">
                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <span className="footer-label">Subtotal</span>
                            <span className="footer-total">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <button className="btn-checkout w-100 py-3" onClick={handleCheckout}>
                            CHECKOUT
                        </button>
                        <p className="text-center mt-3 small">
                            <button className="btn btn-link text-dark text-decoration-none" onClick={() => setDrawerOpen(false)}>
                                Continue Shopping
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
