import React from 'react';
import './shopByPrice.css';
import Image from 'next/image';
import Link from 'next/link';

interface PriceCardProps {
    image: any;
    title: string;
    type: string;
    url?: string;
}

const PriceCard = ({ image, title, type, url }: PriceCardProps) => {
    const content = (
        <div className={`price-card ${type}`}>
            <div className="price-card-image-wrapper">
                {typeof image === 'string' ? (
                    <img src={image} alt={title} className="price-card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <Image src={image} alt={title} className="price-card-image" width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
            </div>
            <div className="price-card-overlay">
                <div className="price-card-content">
                    {title}
                </div>
            </div>
        </div>
    );

    if (url) {
        return <Link href={url} className="price-card-link" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{content}</Link>;
    }

    return content;
};

export default PriceCard;

