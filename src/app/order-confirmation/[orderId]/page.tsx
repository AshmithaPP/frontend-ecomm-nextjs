"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { resolveMediaUrl } from '@/config/api';
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

  // Calculate dynamic GST breakdown (5% inclusive GST)
  const totalAmount = parseFloat(String(currentOrder.total_amount || '0'));
  const taxableAmount = parseFloat((totalAmount / 1.05).toFixed(2));
  const totalGst = parseFloat((totalAmount - taxableAmount).toFixed(2));
  const cgst = parseFloat((totalGst / 2).toFixed(2));
  const sgst = parseFloat((totalGst - cgst).toFixed(2));

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
                    <div className="order-conf-item-value order-conf-total-value">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                </div>

                {/* GST Details Breakdown */}
                <div className="order-conf-gst-breakdown mt-3 pt-3" style={{ borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#800000', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Tax Invoice / GST Details (5% Inclusive)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                      <span>Taxable Amount (Base Price)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                      <span>Includes GST (5%)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', paddingLeft: '12px', borderLeft: '2px solid #cbd5e1' }}>
                      <span>CGST (2.5%)</span>
                      <span style={{ fontWeight: 500, color: '#1e293b' }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', paddingLeft: '12px', borderLeft: '2px solid #cbd5e1' }}>
                      <span>SGST (2.5%)</span>
                      <span style={{ fontWeight: 500, color: '#1e293b' }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display items */}
              {currentOrder.items?.map((item: any, idx: number) => (
                <div className="order-conf-product-box" key={idx} style={{ marginBottom: '15px' }}>
                  <div className="order-conf-product-image-container">
                    <img 
                      src={item.image_url ? resolveMediaUrl(item.image_url) : sareeImageFallback.src} 
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

                <div className="order-conf-shipping-info mt-3 p-3" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>🚚 SHIPMENT INFORMATION</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Shipment Status</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        textTransform: 'capitalize',
                        backgroundColor: 
                          currentOrder.shipment_status?.toLowerCase() === 'delivered' ? '#dcfce7' :
                          currentOrder.shipment_status?.toLowerCase() === 'shipped' ? '#fef3c7' :
                          currentOrder.shipment_status?.toLowerCase() === 'out for delivery' ? '#e0f2fe' :
                          currentOrder.shipment_status?.toLowerCase() === 'packed' ? '#f3e8ff' : '#f1f5f9',
                        color: 
                          currentOrder.shipment_status?.toLowerCase() === 'delivered' ? '#15803d' :
                          currentOrder.shipment_status?.toLowerCase() === 'shipped' ? '#b45309' :
                          currentOrder.shipment_status?.toLowerCase() === 'out for delivery' ? '#0369a1' :
                          currentOrder.shipment_status?.toLowerCase() === 'packed' ? '#6b21a8' : '#475569',
                      }}>
                        {currentOrder.shipment_status || 'Pending'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Courier Name</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentOrder.courier_name || 'Not assigned yet'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Tracking ID</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentOrder.tracking_id || 'Not available yet'}</span>
                    </div>

                    {currentOrder.shipped_at && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Shipped At</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                          {new Date(currentOrder.shipped_at).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {currentOrder.estimated_delivery_date && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Est. Delivery</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                          {new Date(currentOrder.estimated_delivery_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <button 
                      disabled={!currentOrder.tracking_id}
                      onClick={() => {
                        if (currentOrder.tracking_id) {
                          window.open(currentOrder.tracking_url || 'https://www.stcourier.com/track/shipment', '_blank');
                        }
                      }}
                      style={{
                        marginTop: '6px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: currentOrder.tracking_id ? '#800000' : '#e2e8f0',
                        color: currentOrder.tracking_id ? '#fff' : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: currentOrder.tracking_id ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {currentOrder.tracking_id ? 'Track Order ↗' : 'Track Order (Available once shipped)'}
                    </button>

                  </div>
                </div>

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

                {!currentOrder.user_id && (
                  <div className="mt-4 p-3 rounded" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '8px' }}>📋 GUEST CHECKOUT INFO</div>
                    <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                      Since you completed checkout as a guest, please save these details to track your order:
                    </p>
                    <div className="mt-2" style={{ fontSize: '12.5px', color: '#1e293b' }}>
                      <strong>Order Number:</strong> #{currentOrder.order_number}<br />
                      <strong>Phone Number:</strong> {address?.phone}
                    </div>
                    <button
                      onClick={() => router.push(`/track-order?orderId=${currentOrder.order_number}&phone=${address?.phone}`)}
                      className="btn btn-sm mt-3 w-100 py-2 text-white fw-bold"
                      style={{ background: '#800000', borderRadius: '6px', fontSize: '12px', border: 'none' }}
                    >
                      Go to Live Tracking Page ↗
                    </button>
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
