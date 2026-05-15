"use client";

import React from 'react';
import CircleCard from './CircleCard';
import './shopByOccasion.css';
import Image from 'next/image';

// Import local images
import bridalSaree from 'assets/images/bridal/occasion1.png';
import lightweightSilk from 'assets/images/bridal/occasion2.png';
import traditionalSilk from 'assets/images/bridal/occasion3.png';
import collection1 from 'assets/images/bridal/occasion4.png';
import collection2 from 'assets/images/cotton/occasion5.png';

import { IMAGE_BASE } from '@/config/api';

interface OccasionItem {
    occasion_id: number;
    name: string;
    image_url: string;
    redirect_url: string;
}

interface ShopByOccasionProps {
    dynamicData?: OccasionItem[];
}

const ShopByOccasion = ({ dynamicData }: ShopByOccasionProps) => {
  const IMAGE_BASE_URL = IMAGE_BASE;

  const displayData = dynamicData && dynamicData.length > 0 ? dynamicData.map(item => ({
    id: item.occasion_id,
    name: item.name,
    image: item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE_URL}${item.image_url}`,
    url: item.redirect_url
  })) : [
    { id: 1, name: 'Wedding', image: bridalSaree, url: '/occasion/wedding' },
    { id: 2, name: 'Engagement', image: lightweightSilk, url: '/occasion/engagement' },
    { id: 3, name: 'Festival', image: traditionalSilk, url: '/occasion/festival' },
    { id: 4, name: 'Reception', image: collection1, url: '/occasion/reception' },
    { id: 5, name: 'Gift Sarees', image: collection2, url: '/occasion/gift' },
  ];

  return (
    <section className="shop-by-occasion-section py-5">
      <div className="container">
        <h2 className="section-heading mb-5 text-center">Shop By Occasion</h2>
        <div className="row justify-content-center row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
          {displayData.map((item) => (
            <div className="col d-flex justify-content-center" key={item.id}>
              <CircleCard image={item.image} title={item.name} url={item.url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
