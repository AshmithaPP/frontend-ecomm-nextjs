"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAddressStore } from '@/store/addressStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-toastify';
import './checkoutPage.css';

// Asset Imports
import leafIcon from 'assets/icons/ui/leaficon.png';
import orderIcon1 from 'assets/icons/ui/orderIcon1.png';
import orderIcon2 from 'assets/icons/ui/orderIcon2.png';
import orderIcon3 from 'assets/icons/ui/orderIcon3.png';
import vaikundhasilk from 'assets/images/silk/vaikundhasilk.jpg';
import { IMAGE_BASE } from '@/config/api';

const CheckoutPage = () => {
    const router = useRouter();
    const { addresses, fetchAddresses, addAddress, loading: addressLoading } = useAddressStore();
    const { cart, fetchCart, applyCoupon: applyCouponAPI, fetchActiveCoupons } = useCartStore();
    const { placeOrder, loading: orderLoading } = useOrderStore();
    const { isAuthenticated, user, token } = useAuthStore();

    const cartItems = cart?.items || [];
    const cartSummary = cart?.summary || {};

    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [showCouponList, setShowCouponList] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        saveAddress: false,
        orderNotes: '',
        addressType: 'home'
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
            fetchCart(selectedAddress?.state || formData.state);
        }
    }, [isAuthenticated, fetchAddresses, fetchCart]);

    // Automatically select default address if available
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find((addr: any) => addr.is_default) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, selectedAddress]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchActiveCoupons().then(setAvailableCoupons);
        }
    }, [isAuthenticated, fetchActiveCoupons]);

    // Summary calculations
    const subtotal = parseFloat(String(cartSummary.subtotal)) || 0;
    const discountAmount = parseFloat(String(cartSummary.discount)) || 0;
    const shipping = parseFloat(String(cartSummary.shipping_charge || cartSummary.delivery)) || 0;
    const shippingZone = cartSummary.shipping_zone || '';

    const taxableAmount = parseFloat(String(cartSummary.taxable_amount)) || 0;
    const gstTotal = parseFloat(String(cartSummary.gst_amount)) || 0;
    const cgst = parseFloat(String(cartSummary.cgst_amount)) || 0;
    const sgst = parseFloat(String(cartSummary.sgst_amount)) || 0;
    const igst = parseFloat(String(cartSummary.igst_amount)) || 0;
    const gstRate = parseFloat(String(cartSummary.gst_rate || 12));

    const totalAmount = parseFloat(String(cartSummary.total)) || 0;

    // Fetch Cart with State when state changes
    useEffect(() => {
        const state = selectedAddress ? selectedAddress.state : formData.state;
        if (state) {
            fetchCart(state);
        }
    }, [formData.state, selectedAddress, fetchCart]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const applyCoupon = async () => {
        if (!couponCode) return;
        if (subtotal <= 0) {
            toast.warning('Please add items to your cart before applying a coupon.');
            return;
        }
        const result = await applyCouponAPI(couponCode, subtotal);
        if (result.success) {
            setIsCouponApplied(true);
            toast.success(`Coupon Applied! You saved ₹${result.data.discount_amount}`);
        } else {
            toast.error(result.message || 'Invalid Coupon');
        }
    };

    const getDeliveryAddress = () => {
        if (selectedAddress && !showAddressList) {
            return selectedAddress;
        }
        return {
            full_name: formData.fullName,
            phone: formData.mobileNumber,
            address_line1: formData.address,
            address_line2: formData.address2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.pincode
        };
    };

    const handlePayNow = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        const deliveryAddress = getDeliveryAddress();

        // Prepare Payload
        const isRazorpay = ['UPI', 'CARD', 'NETBANKING'].includes(paymentMethod);
        const payload: any = {
            payment_method: isRazorpay ? 'razorpay' : 'cod',
            coupon_code: isCouponApplied ? couponCode : null,
            order_notes: formData.orderNotes
        };

        if (selectedAddress && !showAddressList) {
            payload.address_id = selectedAddress.address_id;
        } else {
            // Validate form data for new address
            const requiredFields = ['fullName', 'mobileNumber', 'email', 'address', 'city', 'state', 'pincode'];
            const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

            if (missingFields.length > 0) {
                toast.error('Please fill in all required delivery address fields.');
                return;
            }

            payload.address = {
                full_name: formData.fullName,
                phone: formData.mobileNumber,
                email: formData.email,
                address_line1: formData.address,
                address_line2: formData.address2 || "",
                city: formData.city,
                state: formData.state,
                postal_code: formData.pincode,
                country: 'India'
            };

            // Option to save address for authenticated users
            if (formData.saveAddress && isAuthenticated) {
                const result = await addAddress({ ...payload.address, address_type: formData.addressType });
                if (result.success) {
                    payload.address_id = result.data.address_id;
                    delete payload.address;
                }
            }
        }

        const result = await placeOrder(payload);

        if (result.success) {
            toast.success('Order placed successfully!');
            router.push(`/order-confirmation/${result.data.order_id}`);
        } else {
            if (result.message !== 'Payment cancelled') {
                toast.error('Failed to place order: ' + result.message);
            }
        }
    };

    const handleSelectSavedAddress = (addr: any) => {
        setSelectedAddress(addr);
        setShowAddressList(false);
    };

    if (cartItems.length === 0 && !orderLoading) {
        return (
            <div className="container text-center py-5">
                <h2 className="mb-4">Your cart is empty</h2>
                <button className="btn btn-dark px-4 py-2" onClick={() => router.push('/products')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="checkout-container py-5">
                <div className="checkout-grid">
                    {/* Left Column */}
                    <div className="left-side-form">
                        <section className="delivery-address-section mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="checkout-section-title">Delivery Address</h2>
                                {isAuthenticated && addresses.length > 0 && !showAddressList && (
                                    <button className="btn-select-address" onClick={() => setShowAddressList(true)}>
                                        SELECT SAVED ADDRESS
                                    </button>
                                )}
                            </div>

                            {showAddressList ? (
                                <div className="saved-addresses-list">
                                    {addresses.map((addr: any) => (
                                        <div
                                            key={addr.address_id}
                                            className={`address-card ${selectedAddress?.address_id === addr.address_id ? 'selected' : ''}`}
                                            onClick={() => handleSelectSavedAddress(addr)}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <h6>{addr.full_name} {addr.is_default ? '(Default)' : ''}</h6>
                                                {selectedAddress?.address_id === addr.address_id && (
                                                    <span className="badge bg-success" style={{ fontSize: '10px' }}>SELECTED</span>
                                                )}
                                            </div>
                                            <p>{addr.address_line1}, {addr.city}, {addr.state} - {addr.postal_code}</p>
                                            <p>Phone: {addr.phone}</p>
                                        </div>
                                    ))}
                                    <button className="btn-add-new mt-3 w-100" onClick={() => {
                                        setShowAddressList(false);
                                        setSelectedAddress(null);
                                    }}>
                                        + ADD NEW ADDRESS
                                    </button>
                                </div>
                            ) : selectedAddress ? (
                                <div className="selected-address-box mb-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="fw-bold mb-2">{selectedAddress.full_name}</h6>
                                            <p className="mb-1">{selectedAddress.address_line1}</p>
                                            {selectedAddress.address_line2 && <p className="mb-1">{selectedAddress.address_line2}</p>}
                                            <p className="mb-1">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}</p>
                                            <p className="mb-0">Phone: {selectedAddress.phone}</p>
                                        </div>
                                        <button className="btn-change-address" onClick={() => setShowAddressList(true)}>
                                            CHANGE
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form className="address-form">
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Full Name"
                                                    className="custom-input"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="mobileNumber"
                                                    placeholder="Mobile Number"
                                                    className="custom-input"
                                                    value={formData.mobileNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email Address (For tracking updates)"
                                                    className="custom-input full-width"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Flat, House no., Building, Apartment"
                                                    className="custom-input full-width"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="address2"
                                                    placeholder="Area, Street, Sector, Village (Optional)"
                                                    className="custom-input full-width"
                                                    value={formData.address2}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="City"
                                                    className="custom-input"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <div className="form-input-group select-wrapper">
                                                <select
                                                    name="state"
                                                    className="custom-input select-input"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">State</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    placeholder="Pincode"
                                                    className="custom-input"
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-input-group select-wrapper">
                                                <select
                                                    name="addressType"
                                                    className="custom-input select-input"
                                                    onChange={handleInputChange}
                                                    value={formData.addressType}
                                                >
                                                    <option value="home">Home (7 AM - 9 PM delivery)</option>
                                                    <option value="office">Office (10 AM - 6 PM delivery)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mt-3">
                                        <input
                                            type="checkbox"
                                            id="saveAddress"
                                            name="saveAddress"
                                            className="custom-checkbox"
                                            checked={formData.saveAddress}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="saveAddress" className="checkbox-label ms-2">
                                            Save this address for faster checkouts
                                        </label>
                                    </div>
                                </form>
                            )}
                        </section>

                        <div className="eco-shipping-box mb-4">
                            <Image src={leafIcon} alt="Leaf" width={16} height={16} className="leaf-icon-img" />
                            <div>
                                <h6 className="eco-title">ECO-ARTISAN SHIPPING</h6>
                                <p className="eco-text">
                                    Estimated arrival: 3-5 business days. Your weave is packed safely in acid-free paper for maximum silk protection.
                                </p>
                            </div>
                        </div>

                        <section className="payment-method-section mb-4">
                            <h2 className="checkout-section-title mb-4">Payment Method</h2>

                            <div className="payment-options">
                                {/* UPI Option */}
                                <div
                                    className={`payment-item upi-item ${paymentMethod === 'UPI' ? 'active-payment' : ''} mb-3`}
                                    onClick={() => setPaymentMethod('UPI')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className={`custom-radio-outer ${paymentMethod !== 'UPI' ? 'unselected' : ''} me-3`}>
                                                {paymentMethod === 'UPI' && <div className="custom-radio-inner"></div>}
                                            </div>
                                            <span className={`payment-name ${paymentMethod !== 'UPI' ? 'inactive' : ''}`}>UPI (Google Pay / PhonePe / Paytm)</span>
                                        </div>
                                        <div className="payment-icon-right">
                                            <i className="bi bi-wallet2"></i>
                                        </div>
                                    </div>
                                    {paymentMethod === 'UPI' && (
                                        <div className="payment-details ms-5 mt-2">
                                            <p className="payment-desc mb-3">Pay directly from your bank account using UPI apps.</p>
                                            <div className="d-flex gap-3">
                                                <button className="btn-payment-action">USE STORED ID</button>
                                                <button className="btn-payment-action secondary">NEW UPI ID</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Option */}
                                <div
                                    className={`payment-item card-item ${paymentMethod === 'CARD' ? 'active-payment' : ''} mb-3`}
                                    onClick={() => setPaymentMethod('CARD')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className={`custom-radio-outer ${paymentMethod !== 'CARD' ? 'unselected' : ''} me-3`}>
                                            {paymentMethod === 'CARD' && <div className="custom-radio-inner"></div>}
                                        </div>
                                        <span className={`payment-name ${paymentMethod !== 'CARD' ? 'inactive' : ''}`}>Credit / Debit Card</span>
                                    </div>
                                    {paymentMethod === 'CARD' && (
                                        <div className="card-form ms-5 mt-3">
                                            <div className="form-input-group mb-3">
                                                <input type="text" placeholder="Card Number" className="custom-input full-width" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3 mb-md-0">
                                                    <input type="text" placeholder="Expiry (MM/YY)" className="custom-input full-width" />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" placeholder="CVV" className="custom-input full-width" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Net Banking & COD Row */}
                                <div className="payment-row mb-4">
                                    <div
                                        className={`payment-item half-width ${paymentMethod === 'NETBANKING' ? 'active-payment' : ''}`}
                                        onClick={() => setPaymentMethod('NETBANKING')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className={`custom-radio-outer ${paymentMethod !== 'NETBANKING' ? 'unselected' : ''} me-3`}>
                                                {paymentMethod === 'NETBANKING' && <div className="custom-radio-inner"></div>}
                                            </div>
                                            <span className="payment-name font-small">Net Banking</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`payment-item half-width ${paymentMethod === 'COD' ? 'active-payment' : ''}`}
                                        onClick={() => setPaymentMethod('COD')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className={`custom-radio-outer ${paymentMethod !== 'COD' ? 'unselected' : ''} me-3`}>
                                                {paymentMethod === 'COD' && <div className="custom-radio-inner"></div>}
                                            </div>
                                            <span className="payment-name font-small">Cash on Delivery</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button
                            className="btn-pay-now w-100 mb-5"
                            onClick={handlePayNow}
                            disabled={orderLoading || cartItems.length === 0}
                        >
                            {orderLoading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                        </button>

                        <div className="row mt-5">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <h3 className="sub-section-title">Apply Coupon</h3>
                                <div className="coupon-container d-flex mt-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Code"
                                        className="coupon-input border"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button className="btn-apply" onClick={applyCoupon}>APPLY</button>
                                </div>
                                <div className="mt-2">
                                    <button
                                        className="btn-view-offers"
                                        onClick={() => setShowCouponList(!showCouponList)}
                                        style={{ background: 'none', border: 'none', color: '#A42829', fontSize: '0.85rem', fontWeight: '600', padding: 0 }}
                                    >
                                        {showCouponList ? 'HIDE OFFERS' : 'VIEW AVAILABLE OFFERS'}
                                    </button>

                                    {showCouponList && (
                                        <div className="available-coupons-list mt-2 p-3 border rounded bg-light">
                                            {availableCoupons.length > 0 ? (
                                                availableCoupons.map((coupon: any) => (
                                                    <div key={coupon.coupon_id} className="coupon-item-mini mb-2 pb-2 border-bottom d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong className="d-block" style={{ color: '#A42829' }}>{coupon.code}</strong>
                                                            <small className="text-muted">
                                                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                                                {coupon.min_order_value > 0 && ` on orders above ₹${coupon.min_order_value}`}
                                                            </small>
                                                        </div>
                                                        <button
                                                            className="btn btn-sm btn-outline-dark"
                                                            onClick={() => {
                                                                setCouponCode(coupon.code);
                                                                setShowCouponList(false);
                                                            }}
                                                        >
                                                            USE
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <small className="text-muted">No active coupons available right now.</small>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="coupon-hint mt-2">Apply "HERITAGE10" for 10% off on your first silk weave.</p>
                            </div>
                            <div className="col-md-6">
                                <h3 className="sub-section-title">Order Notes</h3>
                                <textarea
                                    name="orderNotes"
                                    className="order-notes-textarea mt-2 p-2"
                                    placeholder="Delivery instructions (optional)..."
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Summary) */}
                    <div className="right-side-summary">
                        <section className="order-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="product-summary-list">
                                {cartItems.map((item: any, idx: number) => (
                                    <div className="product-summary-row" key={item.cart_item_id || idx}>
                                        <div className="product-img-box">
                                            <img 
                                                src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE}${item.image_url}`) : (item.image || vaikundhasilk.src)} 
                                                alt={item.name} 
                                            />
                                        </div>
                                        <div className="product-info-box flex-grow-1">
                                            <h4 className="prod-name">{item.name || item.product_name}</h4>
                                            <p className="prod-desc">Variant: {item.attributes ? Object.entries(item.attributes).map(([k, v]: any) => `${v}`).join(', ') : 'Standard'}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-1">
                                                <span className="prod-qty">Qty: {item.quantity}</span>
                                                <span className="prod-price">₹{parseFloat(String(item.unit_price || item.price)).toLocaleString('en-IN')}</span>
                                            </div>
                                            {item.stock_quantity <= 5 && (
                                                <p className="stock-warning mt-1">Only {item.stock_quantity} piece{item.stock_quantity > 1 ? 's' : ''} left in stock</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stock Alert Badge */}
                            {cartItems.some((item: any) => item.stock_quantity <= 3) && (
                                <div className="stock-alert-badge">
                                    <span className="dot"></span>
                                    <span className="stock-alert-text">LIMITED STOCK AVAILABLE</span>
                                </div>
                            )}

                            <div className="price-details-box price-details">
                                <div className="price-row">
                                    <span className="label">Subtotal</span>
                                    <span className="value">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="price-row">
                                        <span className="discount-label">Discount</span>
                                        <span className="discount-value">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="price-row">
                                    <span className="shipping-label d-flex align-items-center">
                                        Shipping {shippingZone ? `(${shippingZone})` : ''} 
                                    </span>
                                    <span className={shipping === 0 ? "free-badge" : "value"}>
                                        {shipping === 0 ? `FREE` : `₹${shipping.toLocaleString('en-IN')}`}
                                    </span>
                                </div>

                                {/* Professional GST Breakdown */}
                                <div className="price-breakdown-divider mt-2 pt-2 border-top">
                                    <div className="price-row small-row">
                                        <span className="label-sm">Taxable Amount</span>
                                        <span className="value-sm">₹{taxableAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="price-row small-row">
                                        <span className="label-sm">Includes GST ({gstRate}%)</span>
                                        <span className="value-sm">₹{gstTotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    {igst > 0 && (
                                        <div className="price-row extra-small-row">
                                            <span className="label-xs">IGST ({gstRate}%)</span>
                                            <span className="value-xs">₹{igst.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}

                                    {cgst > 0 && (
                                        <div className="price-row extra-small-row">
                                            <span className="label-xs">CGST ({(gstRate / 2).toFixed(1)}%) + SGST ({(gstRate / 2).toFixed(1)}%)</span>
                                            <span className="value-xs">₹{cgst.toLocaleString('en-IN')} + ₹{sgst.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="price-row total-row-highlight pt-3">
                                    <span className="total-label">TOTAL AMOUNT</span>
                                    <span className="total-value">₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>

                                {/* Additional UX */}
                                {(formData.state || selectedAddress?.state) && (
                                    <div className="delivery-info-mini mt-3 p-2 rounded bg-light border">
                                        <p className="mb-0 small text-muted">
                                            <i className="bi bi-truck me-2"></i>
                                            Delivery to <strong>{selectedAddress ? selectedAddress.state : formData.state}</strong>
                                        </p>
                                        <p className="mb-0 small text-muted">
                                            Estimated Delivery: <strong>{cartSummary.estimated_days || '3–5 Days'}</strong>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn-pay-now w-100 mt-4"
                                onClick={handlePayNow}
                                disabled={orderLoading || cartItems.length === 0}
                            >
                                {orderLoading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                            </button>
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
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default CheckoutPage;
