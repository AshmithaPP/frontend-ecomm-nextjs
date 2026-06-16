import React from 'react';
import { resolveMediaUrl } from '@/config/api';
import Link from 'next/link';
import heroRight from 'assets/images/silk/heroRight.png';
import heroBg from 'assets/images/lightgreenbg.jpg';
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
    // Fallback data if API fails
    const displayData = dynamicData || {
        title: "Timeless Kanchipuram Silk Sarees",
        subtitle: "Handwoven heritage. Pure mulberry silk.\nAuthentic zari.",
        cta: {
            text: "Explore Collections",
            redirect_url: "/collections/products"
        },
        image_url: heroRight
    };

    const logoSrc = typeof displayData.image_url === 'string'
        ? resolveMediaUrl(displayData.image_url)
        : displayData.image_url;

    const heroBgUrl = typeof heroBg === 'string' ? heroBg : heroBg.src;

    return (
        <section className="hero-section" style={{ backgroundImage: `url(${heroBgUrl})` }}>
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
                        <div className="hero-image-wrapper">
                            {typeof logoSrc === 'string' ? (
                                <img src={logoSrc} alt="Hero Banner" className="hero-img img-fluid zoom-in-image" style={{ maxWidth: '456px', height: 'auto' }} />
                            ) : (
                                <Image src={logoSrc} alt="Saree Model" className="hero-img img-fluid zoom-in-image" width={456} height={570} priority />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;