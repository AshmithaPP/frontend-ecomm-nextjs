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
  const content = (
    <div className="circle-card-item">
      <div className="circle-image-wrapper">
        {typeof image === 'string' ? (
            <img src={image} alt={title} className="circle-image" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
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

