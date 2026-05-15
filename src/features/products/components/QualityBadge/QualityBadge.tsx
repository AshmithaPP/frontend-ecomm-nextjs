import React from 'react';
import './qualityBadge.css';

interface BadgeData {
    icon?: string;
    title: string;
    subtitle: string;
}

interface QualityBadgeProps {
    badge: BadgeData;
}

const QualityBadge = ({ badge }: QualityBadgeProps) => {
    return (
        <div className="quality-badge p-2 d-flex flex-column align-items-center justify-content-center text-center">
            {/* Try to use image icon if exists, otherwise fallback inline SVG */}
            {badge.icon && typeof badge.icon === 'string' && badge.icon.endsWith('.svg') ? (
                <img src={badge.icon} alt={badge.title} className="badge-icon mb-1" style={{ width: '20px', height: '20px' }} onError={(e) => {
                    // Fallback SVG if image not found
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    if (target.nextSibling) (target.nextSibling as HTMLElement).style.display = 'block';
                }} />
            ) : null}
            
            {/* Fallback Icon */}
            <svg 
                className="fallback-badge-icon mb-1" 
                style={{ display: (badge.icon && typeof badge.icon === 'string' && badge.icon.endsWith('.svg')) ? 'none' : 'block' }} 
                width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#8B2635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <div className="badge-title" style={{ fontSize: '11px', fontWeight: '600' }}>{badge.title}</div>
            <div className="badge-subtitle" style={{ fontSize: '10px' }}>{badge.subtitle}</div>
        </div>
    );
};

export default QualityBadge;
