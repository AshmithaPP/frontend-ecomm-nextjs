import React from 'react';
import { IMAGE_BASE } from '@/config/api';
import Link from 'next/link';
import heroRight from 'assets/images/silk/heroRight.png';
import Image from 'next/image';
import './hero_section.css';

interface HeroSectionProps {
    dynamicData?: {
        title: string;
        subtitle: string;
        cta: {
            text: string;
            redirect_url: string;
        };
        image_url: string;
    };
}

const HeroSection = ({ dynamicData }: HeroSectionProps) => {
    const IMAGE_BASE_URL = IMAGE_BASE;
    
    // Fallback data if API fails
    const displayData = dynamicData || {
        title: "Timeless Kanchipuram Silk Sarees",
        subtitle: "Handwoven heritage. Pure mulberry silk.\nAuthentic zari.",
        cta: {
            text: "Explore Collections",
            redirect_url: "/products"
        },
        image_url: heroRight
    };

    const logoSrc = typeof displayData.image_url === 'string' 
        ? (displayData.image_url.startsWith('http') ? displayData.image_url : `${IMAGE_BASE_URL}${displayData.image_url}`)
        : displayData.image_url;

    return (
        <section className="hero-section">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-6 hero-left">
                        <h1 className="hero-title">{displayData.title}</h1>
                        <p className="hero-subtext">
                            {displayData.subtitle.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i !== displayData.subtitle.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </p>
                        <Link href={displayData.cta.redirect_url}>
                            <button className="hero-btn">{displayData.cta.text}</button>
                        </Link>
                    </div>
                    <div className="col-md-6 hero-right d-flex justify-content-end align-items-end d-none d-md-flex">
                        {typeof logoSrc === 'string' ? (
                            <img src={logoSrc} alt="Hero Banner" className="hero-img img-fluid" style={{ maxWidth: '456px', height: 'auto' }} />
                        ) : (
                            <Image src={logoSrc} alt="Saree Model" className="hero-img img-fluid" width={456} height={570} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
