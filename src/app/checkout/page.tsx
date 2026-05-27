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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './checkoutPage.css';

// Asset Imports
import leafIcon from 'assets/icons/ui/leaficon.png';
import orderIcon1 from 'assets/icons/ui/orderIcon1.png';
import orderIcon2 from 'assets/icons/ui/orderIcon2.png';
import orderIcon3 from 'assets/icons/ui/orderIcon3.png';
import vaikundhasilk from 'assets/images/silk/vaikundhasilk.jpg';
import { resolveMediaUrl } from '@/config/api';

const checkoutSchema = z.object({
    hasSavedAddress: z.boolean(),
    fullName: z.string().optional(),
    mobileNumber: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    addressType: z.string().default('home'),
    saveAddress: z.boolean().default(false),
    paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'COD']),
    upiId: z.string().optional(),
    upiSelection: z.string().default('stored'),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    cardholderName: z.string().optional(),
    orderNotes: z.string().max(500, "Order notes must be under 500 characters").optional()
}).superRefine((data, ctx) => {
    if (!data.hasSavedAddress) {
        if (!data.fullName || data.fullName.trim().length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Name must be at least 2 characters",
                path: ["fullName"]
            });
        } else if (data.fullName.trim().length > 80) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Name too long",
                path: ["fullName"]
            });
        } else if (!/^[A-Za-z\s.'-]+$/.test(data.fullName)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Only letters and valid name characters allowed",
                path: ["fullName"]
            });
        }

        if (!data.mobileNumber || !/^[6-9]\d{9}$/.test(data.mobileNumber.replace(/\s+/g, ''))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid 10-digit Indian mobile number",
                path: ["mobileNumber"]
            });
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid email address",
                path: ["email"]
            });
        }

        if (!data.address || data.address.trim().length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Address must be at least 5 characters",
                path: ["address"]
            });
        }

        if (data.address2 && data.address2.length > 150) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Area/Street must be under 150 characters",
                path: ["address2"]
            });
        }

        if (!data.city || !/^[a-zA-Z\s]+$/.test(data.city)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "City is required and can only contain alphabets",
                path: ["city"]
            });
        }

        if (!data.state) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please select a state",
                path: ["state"]
            });
        }

        if (!data.pincode || !/^[1-9]\d{5}$/.test(data.pincode.replace(/\s+/g, ''))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid 6-digit Indian pincode",
                path: ["pincode"]
            });
        }
    }

    if (data.paymentMethod === 'UPI' && data.upiSelection === 'new') {
        if (!data.upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiId)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid UPI ID (e.g. name@okhdfcbank)",
                path: ["upiId"]
            });
        }
    }

    if (data.paymentMethod === 'CARD') {
        if (!data.cardholderName || data.cardholderName.trim().length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cardholder Name must be at least 2 characters",
                path: ["cardholderName"]
            });
        } else if (data.cardholderName.trim().length > 80) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Name too long",
                path: ["cardholderName"]
            });
        } else if (!/^[A-Za-z\s.'-]+$/.test(data.cardholderName)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Only letters and valid name characters allowed",
                path: ["cardholderName"]
            });
        }

        const cleanCardNumber = data.cardNumber ? data.cardNumber.replace(/\s+/g, '') : '';
        if (!cleanCardNumber || !/^\d{16}$/.test(cleanCardNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Card number must be exactly 16 digits",
                path: ["cardNumber"]
            });
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!data.cardExpiry || !expiryRegex.test(data.cardExpiry)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Expiry must be in MM/YY format",
                path: ["cardExpiry"]
            });
        } else {
            const matches = data.cardExpiry.match(expiryRegex);
            if (matches) {
                const month = parseInt(matches[1], 10);
                const year = parseInt("20" + matches[2], 10);
                const expiryDate = new Date(year, month - 1, 1);
                const currentDate = new Date();
                currentDate.setDate(1);
                currentDate.setHours(0,0,0,0);
                if (expiryDate < currentDate) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Card has expired",
                        path: ["cardExpiry"]
                    });
                }
            }
        }

        if (!data.cardCvv || !/^\d{3,4}$/.test(data.cardCvv)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CVV must be 3 or 4 digits",
                path: ["cardCvv"]
            });
        }
    }
});

const CheckoutPage = () => {
    const router = useRouter();
    const { addresses, fetchAddresses, addAddress, loading: addressLoading } = useAddressStore();
    const { cart, fetchCart, applyCoupon: applyCouponAPI, fetchActiveCoupons, mergeCart } = useCartStore();
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
    const [checkoutMode, setCheckoutMode] = useState('guest');

    // React Hook Form Integration
    const { register, handleSubmit, getValues, setValue, watch, formState } = useForm({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange',
        defaultValues: {
            hasSavedAddress: false,
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
            addressType: 'home',
            paymentMethod: 'UPI' as const,
            upiSelection: 'stored',
            upiId: '',
            cardNumber: '',
            cardExpiry: '',
            cardCvv: '',
            cardholderName: ''
        }
    });

    const { errors, isValid } = formState;
    const paymentMethod = watch('paymentMethod');
    const stateValue = watch('state');
    const upiSelection = watch('upiSelection');

    // Sync saved address state
    useEffect(() => {
        setValue('hasSavedAddress', !!selectedAddress);
    }, [selectedAddress, setValue]);

    useEffect(() => {
        const initCart = async () => {
            if (isAuthenticated) {
                fetchAddresses();
                // Ensure guest cart is merged into user cart
                await mergeCart();
            }
            fetchCart(selectedAddress?.state || stateValue);
        };
        initCart();
    }, [isAuthenticated]);

    // Automatically select default address if available
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find((addr: any) => addr.is_default) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, selectedAddress]);

    useEffect(() => {
        fetchActiveCoupons().then(setAvailableCoupons);
    }, [fetchActiveCoupons]);

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
        const state = selectedAddress ? selectedAddress.state : stateValue;
        if (state) {
            fetchCart(state);
        }
    }, [stateValue, selectedAddress, fetchCart]);

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
        const values = getValues();
        return {
            full_name: values.fullName,
            phone: values.mobileNumber,
            address_line1: values.address,
            address_line2: values.address2,
            city: values.city,
            state: values.state,
            postal_code: values.pincode
        };
    };

    const onSubmit = async (data: any) => {
        // Sanitize string inputs to prevent XSS / Script Injection
        const sanitizeInput = (val: string) => {
            if (!val) return '';
            return val
                .trim()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };

        const isRazorpay = ['UPI', 'CARD', 'NETBANKING'].includes(data.paymentMethod);
        const payload: any = {
            payment_method: isRazorpay ? 'razorpay' : 'cod',
            coupon_code: isCouponApplied ? couponCode : null,
            order_notes: data.orderNotes ? sanitizeInput(data.orderNotes) : ""
        };

        if (selectedAddress && !showAddressList) {
            payload.address_id = selectedAddress.address_id;
        } else {
            payload.address = {
                full_name: sanitizeInput(data.fullName || ""),
                phone: sanitizeInput(data.mobileNumber || ""),
                email: sanitizeInput(data.email || ""),
                address_line1: sanitizeInput(data.address || ""),
                address_line2: data.address2 ? sanitizeInput(data.address2) : "",
                city: sanitizeInput(data.city || ""),
                state: sanitizeInput(data.state || ""),
                postal_code: sanitizeInput(data.pincode || ""),
                country: 'India'
            };

            // Option to save address for authenticated users
            if (data.saveAddress && isAuthenticated) {
                const result = await addAddress({ ...payload.address, address_type: data.addressType });
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

    const handlePayNow = (e: React.MouseEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
    };

    // Helper to conditionally render responsive checkmarks next to labels or in input boxes
    const showSuccessTick = (fieldName: keyof typeof errors) => {
        const val = watch(fieldName as any);
        return val && val.toString().trim().length > 0 && !errors[fieldName];
    };

    const handleSelectSavedAddress = (addr: any) => {
        setSelectedAddress(addr);
        setShowAddressList(false);
    };

    if (cartItems.length === 0 && !orderLoading) {
        return (
            <div className="container text-center py-5">
                <h2 className="mb-4">Your cart is empty</h2>
                <button className="btn btn-dark px-4 py-2" onClick={() => router.push('/collections/products')}>Start Shopping</button>
            </div>
        );
    }

    return (
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

                            {!isAuthenticated && (
                                <div className="checkout-mode-selector mb-4 p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                    <h5 className="fw-bold mb-3" style={{ fontSize: '0.95rem', color: '#333' }}>Checkout Options</h5>
                                    <div className="d-flex flex-wrap gap-4">
                                        <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                                            <input 
                                                type="radio" 
                                                name="checkoutMode" 
                                                value="guest" 
                                                checked={checkoutMode === 'guest'} 
                                                onChange={() => setCheckoutMode('guest')}
                                                style={{ accentColor: '#A42829' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', fontWeight: checkoutMode === 'guest' ? '600' : '400' }}>Continue as Guest</span>
                                        </label>
                                        <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => router.push(`/login?redirect=/checkout`)}>
                                            <input 
                                                type="radio" 
                                                name="checkoutMode" 
                                                value="login" 
                                                checked={checkoutMode === 'login'} 
                                                readOnly
                                                style={{ accentColor: '#A42829' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>Login to Account</span>
                                        </label>
                                        <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => router.push(`/register?redirect=/checkout`)}>
                                            <input 
                                                type="radio" 
                                                name="checkoutMode" 
                                                value="register" 
                                                checked={checkoutMode === 'register'} 
                                                readOnly
                                                style={{ accentColor: '#A42829' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>Create new Account</span>
                                        </label>
                                    </div>
                                </div>
                            )}

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
                                <form className="address-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className={`custom-input ${errors.fullName ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.fullName ? "true" : "false"}
                                                    {...register('fullName')}
                                                />
                                                {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
                                                {showSuccessTick('fullName') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Mobile Number"
                                                    className={`custom-input ${errors.mobileNumber ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.mobileNumber ? "true" : "false"}
                                                    onInput={(e) => {
                                                        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').substring(0, 10);
                                                    }}
                                                    {...register('mobileNumber')}
                                                />
                                                {errors.mobileNumber && <span className="error-message">{errors.mobileNumber.message}</span>}
                                                {showSuccessTick('mobileNumber') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="email"
                                                    placeholder="Email Address (For tracking updates)"
                                                    className={`custom-input full-width ${errors.email ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.email ? "true" : "false"}
                                                    {...register('email')}
                                                />
                                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                                                {showSuccessTick('email') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Flat, House no., Building, Apartment"
                                                    className={`custom-input full-width ${errors.address ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.address ? "true" : "false"}
                                                    {...register('address')}
                                                />
                                                {errors.address && <span className="error-message">{errors.address.message}</span>}
                                                {showSuccessTick('address') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Area, Street, Sector, Village (Optional)"
                                                    className={`custom-input full-width ${errors.address2 ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.address2 ? "true" : "false"}
                                                    {...register('address2')}
                                                />
                                                {errors.address2 && <span className="error-message">{errors.address2.message}</span>}
                                                {showSuccessTick('address2') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className={`custom-input ${errors.city ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.city ? "true" : "false"}
                                                    {...register('city')}
                                                />
                                                {errors.city && <span className="error-message">{errors.city.message}</span>}
                                                {showSuccessTick('city') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <div className="form-input-group select-wrapper">
                                                <select
                                                    className={`custom-input select-input ${errors.state ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.state ? "true" : "false"}
                                                    {...register('state')}
                                                >
                                                    <option value="">State</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                </select>
                                                {errors.state && <span className="error-message">{errors.state.message}</span>}
                                                {showSuccessTick('state') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Pincode"
                                                    className={`custom-input ${errors.pincode ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.pincode ? "true" : "false"}
                                                    onInput={(e) => {
                                                        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').substring(0, 6);
                                                    }}
                                                    {...register('pincode')}
                                                />
                                                {errors.pincode && <span className="error-message">{errors.pincode.message}</span>}
                                                {showSuccessTick('pincode') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-input-group select-wrapper">
                                                <select
                                                    className="custom-input select-input"
                                                    {...register('addressType')}
                                                >
                                                    <option value="home">Home (7 AM - 9 PM delivery)</option>
                                                    <option value="office">Office (10 AM - 6 PM delivery)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {isAuthenticated && (
                                        <div className="d-flex align-items-center mt-3">
                                            <input
                                                type="checkbox"
                                                id="saveAddress"
                                                className="custom-checkbox"
                                                {...register('saveAddress')}
                                            />
                                            <label htmlFor="saveAddress" className="checkbox-label ms-2">
                                                Save this address for faster checkouts
                                            </label>
                                        </div>
                                    )}
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
                                    onClick={() => setValue('paymentMethod', 'UPI', { shouldValidate: true })}
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
                                        <div className="payment-details ms-5 mt-2" onClick={(e) => e.stopPropagation()}>
                                            <p className="payment-desc mb-3">Pay directly from your bank account using UPI apps.</p>
                                            <div className="d-flex gap-3 mb-3">
                                                <button
                                                    type="button"
                                                    className={`btn-payment-action ${upiSelection === 'stored' ? 'active' : ''}`}
                                                    onClick={() => setValue('upiSelection', 'stored', { shouldValidate: true })}
                                                >
                                                    USE STORED ID
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn-payment-action secondary ${upiSelection === 'new' ? 'active' : ''}`}
                                                    onClick={() => setValue('upiSelection', 'new', { shouldValidate: true })}
                                                >
                                                    NEW UPI ID
                                                </button>
                                            </div>
                                            {upiSelection === 'new' && (
                                                <div className="form-input-group mb-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter UPI ID (e.g. username@bank)"
                                                        className={`custom-input full-width ${errors.upiId ? 'is-invalid' : ''}`}
                                                        aria-invalid={errors.upiId ? "true" : "false"}
                                                        {...register('upiId')}
                                                    />
                                                    {errors.upiId && <span className="error-message">{errors.upiId.message}</span>}
                                                    {showSuccessTick('upiId') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Card Option */}
                                <div
                                    className={`payment-item card-item ${paymentMethod === 'CARD' ? 'active-payment' : ''} mb-3`}
                                    onClick={() => setValue('paymentMethod', 'CARD', { shouldValidate: true })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className={`custom-radio-outer ${paymentMethod !== 'CARD' ? 'unselected' : ''} me-3`}>
                                            {paymentMethod === 'CARD' && <div className="custom-radio-inner"></div>}
                                        </div>
                                        <span className={`payment-name ${paymentMethod !== 'CARD' ? 'inactive' : ''}`}>Credit / Debit Card</span>
                                    </div>
                                    {paymentMethod === 'CARD' && (
                                        <div className="card-form ms-5 mt-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="form-input-group mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Cardholder Name"
                                                    className={`custom-input full-width ${errors.cardholderName ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.cardholderName ? "true" : "false"}
                                                    {...register('cardholderName')}
                                                />
                                                {errors.cardholderName && <span className="error-message">{errors.cardholderName.message}</span>}
                                                {showSuccessTick('cardholderName') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                            <div className="form-input-group mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Card Number"
                                                    className={`custom-input full-width ${errors.cardNumber ? 'is-invalid' : ''}`}
                                                    aria-invalid={errors.cardNumber ? "true" : "false"}
                                                    onInput={(e) => {
                                                        let v = e.currentTarget.value.replace(/\D/g, '').substring(0, 16);
                                                        const matches = v.match(/\d{1,4}/g);
                                                        e.currentTarget.value = matches ? matches.join(' ') : '';
                                                    }}
                                                    {...register('cardNumber')}
                                                />
                                                {errors.cardNumber && <span className="error-message">{errors.cardNumber.message}</span>}
                                                {showSuccessTick('cardNumber') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3 mb-md-0">
                                                    <div className="form-input-group">
                                                        <input
                                                            type="text"
                                                            placeholder="Expiry (MM/YY)"
                                                            className={`custom-input full-width ${errors.cardExpiry ? 'is-invalid' : ''}`}
                                                            aria-invalid={errors.cardExpiry ? "true" : "false"}
                                                            onInput={(e) => {
                                                                let v = e.currentTarget.value.replace(/\D/g, '');
                                                                if (v.length > 4) v = v.substring(0, 4);
                                                                if (v.length > 2) {
                                                                    e.currentTarget.value = v.substring(0, 2) + '/' + v.substring(2);
                                                                } else {
                                                                    e.currentTarget.value = v;
                                                                }
                                                            }}
                                                            {...register('cardExpiry')}
                                                        />
                                                        {errors.cardExpiry && <span className="error-message">{errors.cardExpiry.message}</span>}
                                                        {showSuccessTick('cardExpiry') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-input-group">
                                                        <input
                                                            type="text"
                                                            placeholder="CVV"
                                                            className={`custom-input full-width ${errors.cardCvv ? 'is-invalid' : ''}`}
                                                            aria-invalid={errors.cardCvv ? "true" : "false"}
                                                            onInput={(e) => {
                                                                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').substring(0, 4);
                                                            }}
                                                            {...register('cardCvv')}
                                                        />
                                                        {errors.cardCvv && <span className="error-message">{errors.cardCvv.message}</span>}
                                                        {showSuccessTick('cardCvv') && <i className="bi bi-check-circle-fill input-success-tick"></i>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Net Banking & COD Row */}
                                <div className="payment-row mb-4">
                                    <div
                                        className={`payment-item half-width ${paymentMethod === 'NETBANKING' ? 'active-payment' : ''}`}
                                        onClick={() => setValue('paymentMethod', 'NETBANKING', { shouldValidate: true })}
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
                                        onClick={() => setValue('paymentMethod', 'COD', { shouldValidate: true })}
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
                            disabled={orderLoading || cartItems.length === 0 || !isValid}
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
                                                src={resolveMediaUrl(item.image_url || item.image || vaikundhasilk.src)} 
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
                                {(stateValue || selectedAddress?.state) && (
                                    <div className="delivery-info-mini mt-3 p-2 rounded bg-light border">
                                        <p className="mb-0 small text-muted">
                                            <i className="bi bi-truck me-2"></i>
                                            Delivery to <strong>{selectedAddress ? selectedAddress.state : stateValue}</strong>
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
                                disabled={orderLoading || cartItems.length === 0 || !isValid}
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
    );
};

export default CheckoutPage;
