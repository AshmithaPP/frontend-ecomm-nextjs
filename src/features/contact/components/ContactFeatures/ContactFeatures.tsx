"use client";

import React from 'react';
import './ContactFeatures.css';

const ContactFeatures = () => {
    const featureHighlights = [
        { icon: 'patch-check', text: 'Pure Silk Assurance' },
        { icon: 'shield-lock', text: 'Secure Payment' },
        { icon: 'people-fill', text: 'Trusted by Customers' },
        { icon: 'magic', text: 'Authentic Weaving' }
    ];

    const contactOptions = [
        {
            icon: 'telephone-fill',
            title: 'Call Us',
            description: 'Dedicated concierge line.',
            actionText: '+91 98765 43210',
            actionUrl: 'tel:+919876543210'
        },
        {
            icon: 'whatsapp',
            title: 'WhatsApp',
            description: 'Instant support from experts.',
            actionText: 'Chat With Us Now',
            actionUrl: 'https://wa.me/919876543210'
        },
        {
            icon: 'envelope-fill',
            title: 'Email',
            description: 'For wholesale & inquiries.',
            actionText: 'curator@heritageweaves.com',
            actionUrl: 'mailto:curator@heritageweaves.com'
        },
        {
            icon: 'shop-window',
            title: 'Visit Store',
            description: 'Experience the silk in person.',
            actionText: 'Find Directions',
            actionUrl: 'https://maps.google.com'
        }
    ];

    return (
        <section className="contact-features-section">
            {/* Top Feature Bar */}
            <div className="feature-bar-wrapper">
                <div className="feature-bar-container">
                    {featureHighlights.map((feature, index) => (
                        <div key={index} className="feature-bar-item">
                            <i className={`bi bi-${feature.icon}`}></i>
                            <span>{feature.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Info Cards Section */}
            <div className="info-cards-section">
                <div className="info-cards-container">
                    <div className="info-cards-row">
                        {contactOptions.map((option, index) => (
                            <div key={index} className="info-card">
                                <div className="info-card__icon-box">
                                    <i className={`bi bi-${option.icon}`}></i>
                                </div>
                                <h3 className="info-card__title">{option.title}</h3>
                                <p className="info-card__description">{option.description}</p>
                                <a 
                                    href={option.actionUrl} 
                                    className="info-card__action"
                                    target={option.actionUrl.startsWith('http') ? "_blank" : undefined}
                                    rel={option.actionUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    {option.actionText}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFeatures;
