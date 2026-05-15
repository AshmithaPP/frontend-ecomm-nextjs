import React from 'react';
import './GiftSection.css';

const GiftSection = () => {
    const features = [
        {
            id: 1,
            title: "Pure Silk Guarantee",
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.85 4.1L16.55 3.65L17.45 6.25L20 7.6L18.75 10.1L20 12.6L17.45 13.95L16.55 16.55L13.85 16.1L12 18.2L10.15 16.1L7.45 16.55L6.55 13.95L4 12.6L5.25 10.1L4 7.6L6.55 6.25L7.45 3.65L10.15 4.1L12 2Z" fill="#D4AF37" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Handloom Certified",
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C12 21 4 16.5 4 11.5C4 9 6 7 8.5 7C10 7 11.3 7.7 12 9C12.7 7.7 14 7 15.5 7C18 7 20 9 20 11.5C20 16.5 12 21 12 21Z" fill="#D4AF37" />
                    <path d="M16 19C15.5 19.5 15 20 15 20L11 22L7 20C7 20 6 18.5 6 17.5C6 16.5 7 16 8 16C9 16 10 17 10 17L12 18L14 17C14 17 15 16 16 16C17 16 18 16.5 18 17.5C18 18.5 17 20 16 19Z" fill="#D4AF37" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Secure Payments",
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11C4 16.2 7.4 21.1 12 22.5C16.6 21.1 20 16.2 20 11V5L12 2Z" fill="#D4AF37" />
                    <path d="M12 4.1V20.3C14.7 19.1 17.1 15.8 17.8 11.4H12V4.1Z" fill="#E5E7EB" opacity="0.2" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Authentic Kanchipuram",
            icon: (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8.5H22L16.5 12.5L18.5 19.5L12 15.5L5.5 19.5L7.5 12.5L2 8.5H9L12 2Z" fill="#D4AF37" />
                </svg>
            )
        }
    ];

    return (
        <div className="gift-section-container">
            {/* Top Guarantees Banner */}
            <div className="gift-section-card mb-5">
                <div className="row g-0 justify-content-center align-items-center h-100 mt-3">
                    {features.map((feature) => (
                        <div key={feature.id} className="col-12 col-sm-6 col-md-3 h-100 mb-4 mb-md-0">
                            <div className="gift-feature-item">
                                <div className="gift-feature-icon-wrapper">
                                    <span className="gift-feature-icon">
                                        {feature.icon}
                                    </span>
                                </div>
                                <span className="gift-feature-title">{feature.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Red Gift Cards Banner */}
            <div className="gift-voucher-banner">
                <div className="text-center mb-5">
                    <h2 className="voucher-title">Gift the Elegance of Kanchipuram Silk</h2>
                    <p className="voucher-subtitle">The perfect gift for weddings, festivals, and special occasions.</p>
                </div>

                <div className="row g-4 justify-content-center mb-5">
                    {[3000, 5000, 7000].map((amount, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="voucher-card text-center">
                                <h3 className="voucher-amount">₹{amount.toLocaleString()}</h3>
                                <p className="voucher-label">Gift Voucher</p>
                                <button className="voucher-btn">Kanchipuram Heritage</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="shop-gift-cards-btn">Shop Gift Cards</button>
                </div>
            </div>
        </div>
    );
};

export default GiftSection;
