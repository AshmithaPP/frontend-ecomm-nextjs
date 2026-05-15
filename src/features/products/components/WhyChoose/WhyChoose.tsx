import React from 'react';
import './whyChoose.css';

interface WhyChooseProps {
    features: string[];
}

const WhyChoose = ({ features }: WhyChooseProps) => {
    return (
        <div className="why-choose-card p-2 rounded-3">
            <h3 className="why-choose-heading mb-2" style={{ fontSize: '16px' }}>Why Choose This Product?</h3>
            <ul className="why-choose-list list-unstyled mb-0">
                {features.map((feature: any, index: any) => (
                    <li key={index} className="d-flex align-items-start mb-1">
                        <svg className="me-2 mt-1 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="#2D5F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="feature-text small">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WhyChoose;
