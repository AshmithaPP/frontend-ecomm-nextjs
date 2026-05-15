"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import './myOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!token) {
                    router.push('/login?redirect=/orders');
                    return;
                }
                const response = await fetch(`${API_BASE}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                console.log('📦 My Orders Response:', data);
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) return <div className="orders-loading">Loading your orders...</div>;

    return (
        <div className="my-orders-container">
            <h1 className="orders-title">My Orders</h1>
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button onClick={() => router.push('/products')}>Start Shopping</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.order_id} className="order-card" onClick={() => router.push(`/order-confirmation/${order.order_id}`)}>
                            <div className="order-header">
                                <span className="order-number">Order #{order.order_number}</span>
                                <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>{order.status}</span>
                            </div>
                            <div className="order-summary">
                                <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                                <span>Total: ₹{order.total_amount}</span>
                            </div>
                            <div className="order-actions">
                                <button className="btn-track">Track Order</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
