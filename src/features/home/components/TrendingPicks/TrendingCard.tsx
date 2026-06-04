import React, { forwardRef } from 'react';
import './trendingPicks.css';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingCardProps {
  image: any;
  title: string;
  size?: string;
  url?: string;
  className?: string;
  style?: React.CSSProperties;
}

const TrendingCard = forwardRef<HTMLDivElement, TrendingCardProps>(
  ({ image, title, size, url, className = '', style }, ref) => {
    const content = (
      <div ref={ref} className={`trending-card ${size || ''} ${className}`} style={style}>
        <div className="image-wrapper">
          {typeof image === 'string' ? (
            <img src={image} alt={title} className="card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Image src={image} alt={title} className="card-image" width={size === 'large' ? 600 : 300} height={size === 'large' ? 800 : 400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div className="card-overlay">
          <h3 className="card-title">{title}</h3>
        </div>
      </div>
    );

    if (url) {
      return (
        <Link href={url} className="trending-card-link" style={style}>
          {content}
        </Link>
      );
    }

    return content;
  }
);

TrendingCard.displayName = 'TrendingCard';

export default TrendingCard;

