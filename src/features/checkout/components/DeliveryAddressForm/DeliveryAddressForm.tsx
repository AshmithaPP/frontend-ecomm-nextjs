"use client";

import React from 'react';

interface DeliveryAddressFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DeliveryAddressForm = ({ formData, handleInputChange }: DeliveryAddressFormProps) => {
    return (
        <section className="delivery-address-section mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="checkout-section-title">Delivery Address</h2>
                <button className="btn-select-address">SELECT SAVED ADDRESS</button>
            </div>

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
        </section>
    );
};

export default DeliveryAddressForm;
