"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import orderIcon1 from 'assets/icons/ui/orderIcon1.png';
import orderIcon2 from 'assets/icons/ui/orderIcon2.png';
import orderIcon3 from 'assets/icons/ui/orderIcon3.png';
import { useCartStore } from '@/store/cartStore';
import { IMAGE_BASE } from '@/config/api';

interface CheckoutSummaryProps {
    handlePayNow: (e: React.MouseEvent) => void;
}

const CheckoutSummary = ({ handlePayNow }: CheckoutSummaryProps) => {
    const { cart } = useCartStore();
    
    if (!cart) return null;

    const cartItems = cart.items || [];
    const cartSummary = cart.summary || {};

    const subtotal = parseFloat(String(cartSummary.subtotal)) || 0;
    const discountAmount = parseFloat(String(cartSummary.discount)) || 0;
    const shipping = parseFloat(String(cartSummary.shipping_charge || cartSummary.delivery)) || 0;
    const totalAmount = parseFloat(String(cartSummary.total)) || 0;
    const gstTotal = parseFloat(String(cartSummary.gst_amount)) || 0;
    const gstRate = parseFloat(String(cartSummary.gst_rate || 12));

    return (
        <>
            <section className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="product-summary-list">
                {cartItems.map((item: any) => (
                    <div className="product-summary-row" key={item.product_id}>
                        <div className="product-img-box">
                            <img 
                                src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE}${item.image_url}`) : item.image} 
                                alt={item.product_name || item.name} 
                                style={{ width: '96px', height: '128px', objectFit: 'cover' }} 
                            />
                        </div>
                        <div className="product-info-box flex-grow-1">
                            <h4 className="prod-name">{item.product_name || item.name}</h4>
                            <p className="prod-desc">{item.variant_name || 'Handloom Silk'}</p>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="prod-qty">Qty: {item.quantity}</span>
                                <span className="prod-price">₹{parseFloat(String(item.price).replace(/[^0-9.]/g, '') || '0').toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cartItems.length > 0 && (
                <div className="stock-alert-badge">
                    <span className="dot"></span> 
                    <span className="stock-alert-text">AUTHENTIC HANDLOOM SILK</span>
                </div>
            )}

            <div className="price-details-box price-details">
                <div className="price-row">
                    <span className="label">Subtotal</span>
                    <span className="value">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="price-row">
                        <span className="discount-label">Discount</span>
                        <span className="discount-value">- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                )}
                <div className="price-row">
                    <span className="shipping-label d-flex align-items-center">
                        Shipping <i className="bi bi-info-circle ms-2" style={{fontSize: '9.5px', opacity: 0.7}}></i>
                    </span>
                    <span className="free-badge">FREE</span>
                </div>
                <div className="price-row">
                    <span className="gst-label">Includes GST ({gstRate}%)</span>
                    <span className="gst-value">₹{gstTotal.toLocaleString()}</span>
                </div>
                
                <div className="price-row total-row-highlight pt-3">
                    <span className="total-label">TOTAL AMOUNT</span>
                    <span className="total-value">₹{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            <button className="btn-pay-now w-100 mt-4" onClick={handlePayNow}>PAY NOW</button>
            <p className="secure-text">3D-SECURE PAYMENT AUTHORIZATION ACTIVE</p>
        </section>

        <div className="quality-badges-row">
            <div className="quality-badge-box">
                <Image src={orderIcon1} alt="Guarantee" className="quality-badge-icon" width={22} height={21} />
                <span className="quality-badge-text">PURE SILK GUARANTEE</span>
            </div>
            <div className="quality-badge-box">
                <Image src={orderIcon2} alt="Certified" className="quality-badge-icon" width={22} height={21} />
                <span className="quality-badge-text">HANDLOOM CERTIFIED</span>
            </div>
            <div className="quality-badge-box">
                <Image src={orderIcon3} alt="Secure" className="quality-badge-icon" width={22} height={21} />
                <span className="quality-badge-text">SECURE PAYMENT</span>
            </div>
        </div>
    </>
);
};

export default CheckoutSummary;

