import React from 'react';
import './shopByOccasion.css';
import Image from 'next/image';
import Link from 'next/link';

interface CircleCardProps {
    image: any;
    title: string;
    url?: string;
}

const CircleCard = ({ image, title, url }: CircleCardProps) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  };

  const content = (
    <div className="circle-card-item">
      <div className="circle-image-wrapper">
        {typeof image === 'string' ? (
            <>
              <img
                src={image}
                alt={title}
                className="circle-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                onError={handleImgError}
              />
              <div
                className="circle-image-fallback"
                style={{
                  display: 'none',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#8B4513',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {title.charAt(0)}
              </div>
            </>
        ) : (
            <Image src={image} alt={title} className="circle-image" width={200} height={200} style={{ objectFit: 'cover', objectPosition: 'center top' }} />
        )}
      </div>
      <h3 className="circle-card-title">{title}</h3>
    </div>
  );

  if (url) {
    return <Link href={url} className="circle-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
  }

  return content;
};

export default CircleCard;

