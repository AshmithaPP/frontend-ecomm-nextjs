"use client";

import React from 'react';
import TrendingCard from './TrendingCard';
import './trendingPicks.css';
import { IMAGE_BASE } from '@/config/api';

// Import images from assets
import occasion1 from 'assets/images/bridal/occasion1.png';
import occasion2 from 'assets/images/bridal/occasion2.png';
import occasion3 from 'assets/images/bridal/occasion3.png';
import occasion4 from 'assets/images/bridal/occasion4.png';
import occasion5 from 'assets/images/cotton/occasion5.png';
import collection1 from 'assets/images/silk/collection1.png';
import collection2 from 'assets/images/silk/collection2.png';
import collection3 from 'assets/images/silk/collection3.png';

interface TrendingCardData {
  id: number | string;
  title: string;
  size?: 'large' | 'small' | 'equal';
  image: any;
  slug?: string;
}

const trendingCardsData: TrendingCardData[] = [
  { id: 1, title: 'Pure Kanchipuram Silks', size: 'large', image: occasion1 },
  { id: 2, title: 'Temple Border Kanchipuram', size: 'small', image: occasion2 },
  { id: 3, title: 'Zari Rich Kanchipuram', size: 'small', image: occasion3 },
  { id: 4, title: 'Traditional Kanchipuram Bridal', size: 'small', image: occasion4 },
  { id: 5, title: 'Contrast Border Kanchipuram', size: 'small', image: occasion5 },
  { id: 6, title: 'Handwoven Kanchipuram Classics', size: 'equal', image: collection1 },
  { id: 7, title: 'Muted Gold Kanchipuram', size: 'equal', image: collection2 },
  { id: 8, title: 'Contemporary Kanchipuram Silks', size: 'equal', image: collection3 }
];

interface TrendingPicksProps {
  data?: any[];
}

const TrendingPicks = ({ data }: TrendingPicksProps) => {
    // If data is provided from backend, map it, otherwise use static data
    const displayData: TrendingCardData[] = data && data.length > 0 
        ? data.map((item, index) => ({
            id: item.id || index,
            title: item.name || item.title,
            size: (index === 0 ? 'large' : 'small') as 'large' | 'small', // Simple layout logic
            image: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE}${item.image_url}`) : item.image,
            slug: item.slug
        }))
        : trendingCardsData;

    return (
        <section className="trending-picks-section">
            <div className="container">
                <h2 className="trending-title">Trending Picks</h2>
                
                <div className="trending-grid">
                    {/* Top Section Layout */}
                    <div className="top-section">
                        <div className="left-column">
                            {displayData[0] && <TrendingCard {...displayData[0]} />}
                        </div>
                        <div className="right-column">
                            {displayData.slice(1, 5).map(card => (
                                <TrendingCard key={card.id} {...card} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section Layout */}
                    <div className="bottom-section">
                        {displayData.slice(5).map(card => (
                            <TrendingCard key={card.id} {...card} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingPicks;
