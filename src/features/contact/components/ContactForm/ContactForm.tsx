"use client";

import React, { useState } from 'react';
import './ContactForm.css';

interface ContactFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    enquiryType: string;
    message: string;
}

const ContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        enquiryType: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Handle form submission logic here
    };

    return (
        <section className="contact-form-section">
            <div className="contact-form-card">
                <div className="contact-form__header">
                    <h2 className="contact-form__title">Send an Enquiry</h2>
                    <p className="contact-form__subtitle">
                        Tell us about your requirements and we will get back to you within 24 hours.
                    </p>
                </div>

                <form className="contact-form__inner" onSubmit={handleSubmit}>
                    <div className="row g-md-5 g-0">
                        <div className="col-md-6">
                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="form-input"
                                    placeholder="Aishwarya Iyer"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="aishwarya@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    className="form-input"
                                    placeholder="+91 00000 00000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="enquiryType">Enquiry Type</label>
                                <select
                                    id="enquiryType"
                                    name="enquiryType"
                                    className="form-select"
                                    value={formData.enquiryType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled aria-hidden="true" hidden>Select your enquiry</option>
                                    <option value="Bridal Collection">Bridal Collection</option>
                                    <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                                    <option value="Custom Orders">Custom Orders</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            className="form-textarea"
                            placeholder="How can our curators assist you today?"
                            rows={1}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="contact-form__submit-container">
                        <button type="submit" className="contact-form__submit-btn">
                            SEND MESSAGE
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
