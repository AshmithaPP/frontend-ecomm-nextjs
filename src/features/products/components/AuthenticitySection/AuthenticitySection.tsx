import React from 'react';
import './authenticitySection.css';

interface StatItem {
    value: string | number;
    label: string;
}

interface AuthenticitySectionProps {
    heading: string;
    description: string;
    stats: StatItem[];
    badgeImage?: string;
}

const AuthenticitySection = ({ heading, description, stats, badgeImage }: AuthenticitySectionProps) => {
    return (
        <div className="authenticity-section-wrapper d-flex align-items-center justify-content-center">
            <div className="authenticity-inner row m-0 w-100 align-items-center">
                
                {/* Left side content */}
                <div className="col-lg-9 col-12 left-content px-0 pe-lg-4">
                    <h3 className="authenticity-heading">{heading}</h3>
                    <p className="authenticity-desc mt-3">{description}</p>
                    
                    <div className="stats-row d-flex mt-4 gap-5 flex-wrap">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item d-flex flex-column align-items-start">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side badge */}
                <div className="col-lg-3 col-12 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0 px-0 badge-container">
                    <div className="silk-mark-wrapper d-flex align-items-center justify-content-center">
                        {badgeImage ? (
                            <img src={badgeImage} alt="Silk Mark Certification" className="silk-mark-image" />
                        ) : (
                            <span className="placeholder-text">SILK MARK</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthenticitySection;
