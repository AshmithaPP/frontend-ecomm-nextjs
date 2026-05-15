"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IMAGE_BASE } from '@/config/api';
import { useOrderStore } from '@/store/orderStore';
import './orderConfirmation.css';
import Image from 'next/image';

// Import icons/images (using placeholders or mapping from assets)
import transportIcon from 'assets/icons/ui/transporticon.png';
import sareeImageFallback from 'assets/images/silk/collection1.png';

const OrderConfirmationPage = () => {
  const params = useParams();
  const orderId = params?.orderId as string;
  const router = useRouter();
  
  const { currentOrder, loading, error, fetchOrderDetails } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  if (loading) {
    return (
      <div className="order-conf-wrapper">
        <div className="text-center">
          <div className="spinner-border text-maroon" role="status" style={{ color: '#800000' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontFamily: 'Jost', color: '#5A413D' }}>Fetching your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="order-conf-wrapper">
        <div className="text-center p-5 bg-white rounded shadow-sm" style={{ maxWidth: '500px' }}>
          <h2 style={{ fontFamily: 'Jost', color: '#800000' }}>{error ? 'Oops!' : 'Order Not Found'}</h2>
          <p style={{ fontFamily: 'Jost', color: '#5A413D' }}>{error || 'We could not find the details for this order.'}</p>
          <button 
            className="order-conf-btn-track mt-3" 
            onClick={() => router.push('/products')}
            style={{ width: 'auto', padding: '0 32px', margin: '0 auto' }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Parse shipping address if it's a string
  const address = typeof currentOrder.shipping_address === 'string' 
    ? JSON.parse(currentOrder.shipping_address) 
    : currentOrder.shipping_address;

  return (
    <div className="order-conf-wrapper">
      <div className="order-conf-container">
        <div className="order-conf-inner-layout">
          
          {/* Status Header */}
          <header className="order-conf-status-header">
            <div className="order-conf-checkmark-box">
              <div className="order-conf-checkmark-inner">
                <i className="bi bi-check-lg" style={{ fontSize: '24px' }}></i>
              </div>
            </div>
            <h1 className="order-conf-title">Order Confirmed!</h1>
            <p className="order-conf-subtext">
              Thank you for your purchase. Your order #{currentOrder.order_number} has been successfully placed and is being prepared for transit.
            </p>
          </header>

          {/* Content Grid */}
          <main className="order-conf-content-grid">
            
            {/* Left Column: Order Summary & Product */}
            <div className="order-conf-left-column">
              <div className="order-conf-summary-box">
                <h2 className="order-conf-summary-title">Order Summary</h2>
                
                <div className="order-conf-summary-row">
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">ORDER ID</span>
                    <div className="order-conf-item-value">#{currentOrder.order_number}</div>
                  </div>
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">ORDER DATE</span>
                    <div className="order-conf-item-value">{new Date(currentOrder.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="order-conf-summary-row">
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">PAYMENT METHOD</span>
                    <div className="order-conf-item-value" style={{ textTransform: 'uppercase' }}>{currentOrder.payment_method}</div>
                  </div>
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">TOTAL AMOUNT</span>
                    <div className="order-conf-item-value order-conf-total-value">₹{currentOrder.total_amount}</div>
                  </div>
                </div>
              </div>

              {/* Display items */}
              {currentOrder.items?.map((item: any, idx: number) => (
                <div className="order-conf-product-box" key={idx} style={{ marginBottom: '15px' }}>
                  <div className="order-conf-product-image-container">
                    <img 
                      src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE}${item.image_url}`) : sareeImageFallback.src} 
                      alt={item.name} 
                      className="img-fluid" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="order-conf-product-info">
                    <span className="order-conf-product-badge">Silk Saree</span>
                    <h3 className="order-conf-product-name">{item.name}</h3>
                    {item.variant_name && <div className="order-conf-product-qty text-muted">{item.variant_name}</div>}
                    <div className="order-conf-product-qty">Quantity: {item.quantity}</div>
                    <div className="order-conf-product-price">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Delivery Details */}
            <div className="order-conf-right-column">
              <div className="order-conf-delivery-box">
                <div className="order-conf-delivery-header">
                  <h2 className="order-conf-delivery-title">Delivery Details</h2>
                  <Image src={transportIcon} alt="Transport" className="order-conf-transport-icon" width={22} height={15} />
                </div>

                <div className="order-conf-delivery-body">
                  <div className="order-conf-customer-name">{address?.full_name}</div>
                  <div className="order-conf-customer-address">
                    {address?.address_line1}, {address?.address_line2 && `${address.address_line2}, `}
                    {address?.city}, {address?.state} - {address?.postal_code}
                  </div>
                  <div className="order-conf-customer-phone">Ph: {address?.phone}</div>
                </div>

                <div className="order-conf-arrival-section">
                  <span className="order-conf-arrival-label">ORDER STATUS</span>
                  <div className="order-conf-arrival-date" style={{ textTransform: 'capitalize' }}>{currentOrder.status}</div>
                </div>

                {currentOrder.tracking_id && (
                  <div className="order-conf-shipping-info mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '5px' }}>SHIPPING INFO</div>
                    <div style={{ fontSize: '13px' }}><strong>Courier:</strong> {currentOrder.courier_name}</div>
                    <div style={{ fontSize: '13px' }}><strong>Tracking ID:</strong> {currentOrder.tracking_id}</div>
                    {currentOrder.estimated_delivery_date && (
                        <div style={{ fontSize: '13px' }}><strong>Est. Delivery:</strong> {new Date(currentOrder.estimated_delivery_date).toLocaleDateString()}</div>
                    )}
                  </div>
                )}

                {/* Tracking Timeline */}
                {currentOrder.timeline?.length > 0 && (
                  <div className="order-conf-timeline mt-4">
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '15px' }}>TRACKING TIMELINE</div>
                    <div className="tracking-steps" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {currentOrder.timeline.map((step: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ 
                              width: '12px', height: '12px', borderRadius: '50%', 
                              background: idx === currentOrder.timeline.length - 1 ? '#800000' : '#dee2e6',
                              zIndex: 2 
                            }} />
                            {idx !== currentOrder.timeline.length - 1 && (
                              <div style={{ width: '2px', flex: 1, background: '#dee2e6', position: 'absolute', top: '12px' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'capitalize' }}>{step.status}</div>
                            <div style={{ fontSize: '11px', color: '#6c757d' }}>{step.message}</div>
                            <div style={{ fontSize: '10px', color: '#adb5bd' }}>{new Date(step.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="order-conf-note-box mt-4">
                  <i className="bi bi-shield-check order-conf-note-icon"></i>
                  <p className="order-conf-note-text">Your heritage silk is being packed with extra care to preserve its quality during transit.</p>
                </div>
              </div>

              <div className="order-conf-action-buttons">
                <button className="order-conf-btn-track" onClick={() => router.push('/products')}>
                  VIEW MORE PRODUCTS <i className="bi bi-arrow-right ms-2"></i>
                </button>
                <button className="order-conf-btn-continue" onClick={() => router.push('/')}>
                  BACK TO HOME
                </button>
              </div>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
