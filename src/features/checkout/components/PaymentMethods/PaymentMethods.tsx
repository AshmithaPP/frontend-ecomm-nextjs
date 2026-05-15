"use client";

import React from 'react';

const PaymentMethods = () => {
    return (
        <section className="payment-method-section mb-4">
            <h2 className="checkout-section-title mb-4">Payment Method</h2>
            
            <div className="payment-options">
                {/* UPI Option (Selected in image) */}
                <div className="payment-item upi-item active-payment mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="custom-radio-outer me-3">
                                <div className="custom-radio-inner"></div>
                            </div>
                            <span className="payment-name">UPI (Google Pay / PhonePe / Paytm)</span>
                        </div>
                        <div className="payment-icon-right">
                            <i className="bi bi-wallet2"></i>
                        </div>
                    </div>
                    <div className="payment-details ms-5 mt-2">
                        <p className="payment-desc mb-3">Pay directly from your bank account using UPI apps.</p>
                        <div className="d-flex gap-3">
                            <button className="btn-payment-action">USE STORED ID</button>
                            <button className="btn-payment-action secondary">NEW UPI ID</button>
                        </div>
                    </div>
                </div>

                {/* Card Option */}
                <div className="payment-item card-item mb-3">
                    <div className="d-flex align-items-center">
                        <div className="custom-radio-outer unselected me-3"></div>
                        <span className="payment-name inactive">Credit / Debit Card</span>
                    </div>
                    <div className="card-form ms-5 mt-3">
                        <div className="form-input-group mb-3">
                            <input type="text" placeholder="Card Number" className="custom-input full-width" disabled />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <input type="text" placeholder="Expiry (MM/YY)" className="custom-input full-width" disabled />
                            </div>
                            <div className="col-md-6">
                                <input type="text" placeholder="CVV" className="custom-input full-width" disabled />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Banking & COD Row */}
                <div className="payment-row mb-4">
                    <div className="payment-item half-width">
                        <div className="d-flex align-items-center">
                            <div className="custom-radio-outer unselected me-3"></div>
                            <span className="payment-name font-small">Net Banking</span>
                        </div>
                    </div>
                    <div className="payment-item half-width">
                        <div className="d-flex align-items-center">
                            <div className="custom-radio-outer unselected me-3"></div>
                            <span className="payment-name font-small">Cash on Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentMethods;
