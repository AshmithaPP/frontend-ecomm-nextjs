"use client";

import React from 'react';
import './cartItem.css';
import { useCartStore, CartItem as ICartItem } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { IMAGE_BASE } from '@/config/api';

interface CartItemProps {
    item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
    const { updateQuantity, removeFromCart } = useCartStore();
    const router = useRouter();

    const handleNavigate = () => {
        router.push(`/products/${item.slug || item.product_id}`);
    };

    const handleIncrement = async () => {
        const currentQty = Number(item.quantity);
        if (currentQty < 10) {
            await updateQuantity(item.cart_item_id, currentQty + 1);
        }
    };

    const handleDecrement = async () => {
        const currentQty = Number(item.quantity);
        if (currentQty > 1) {
            await updateQuantity(item.cart_item_id, currentQty - 1);
        }
    };

    const priceValue = parseFloat(String(item.unit_price || item.price || '0').replace(/[^0-9.]/g, '') || '0');
    
    const rawImage = item.image_url || item.image;
    const imageUrl = rawImage 
        ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE}${rawImage}`) 
        : '';

    const attributeText = item.attributes 
        ? Object.entries(item.attributes).map(([key, val]: [string, any]) => `${key}: ${val}`).join(' | ')
        : (item.variant_name || 'Standard');

    return (
        <div className="cart-item-row d-flex align-items-start mb-4">
            <div className="cart-item-image" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
                <img src={imageUrl} alt={item.product_name || item.name} />
            </div>
            <div className="cart-item-details ms-4">
                <h5 className="cart-item-title mb-1" onClick={handleNavigate} style={{ cursor: 'pointer' }}>{item.product_name || item.name}</h5>
                <p className="cart-item-size text-muted mb-1">{attributeText}</p>
                <p className="cart-item-price mb-2">
                    ₹{priceValue.toLocaleString('en-IN')}
                </p>
                <div className="quantity-selector-v2 d-flex align-items-center mb-2">
                    <button 
                        className="qty-btn minus" 
                        onClick={handleDecrement}
                        disabled={Number(item.quantity) <= 1}
                    >
                        <i className="bi bi-dash"></i>
                    </button>
                    <span className="qty-value mx-3">{item.quantity}</span>
                    <button 
                        className="qty-btn plus" 
                        onClick={handleIncrement}
                        disabled={Number(item.quantity) >= 10}
                    >
                        <i className="bi bi-plus"></i>
                    </button>
                </div>
                <button className="remove-item-btn btn btn-link p-0 text-danger" onClick={() => removeFromCart(item.cart_item_id)}>
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;

