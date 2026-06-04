"use client";

import React, { useEffect } from 'react';
import HeroSection from 'features/home/components/HeroSection/HeroSection';
import CategoriesSection from 'features/home/components/CategoriesSection/CategoriesSection';
import ShopByCollections from 'features/home/components/ShopByCollections/ShopByCollections';
import ShopByOccasion from 'features/home/components/ShopByOccasion/ShopByOccasion';
import TrendingPicks from 'features/home/components/TrendingPicks/TrendingPicks';
import ShopByPrice from 'features/home/components/ShopByPrice/ShopByPrice';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import CustomerFavorites from 'features/home/components/CustomerFavorites/CustomerFavorites';
import BlogSection from 'features/home/components/BlogSection/BlogSection';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import { useHomeStore } from '@/store/homeStore';
import { resolveMediaUrl } from '@/config/api';

const mapHomeProduct = (p: any) => {
  const pid = p.product_id || p.id || (p.product && (p.product.product_id || p.product.id));
  return {
    ...p,
    id: pid,
    product_id: pid,
    title: p.product_name || p.name || p.title || (p.product && (p.product.product_name || p.product.name)),
    discountedPrice: p.price ? (String(p.price).startsWith('₹') ? p.price : `₹${p.price}`) : p.discountedPrice,
    originalPrice: p.original_price ? (String(p.original_price).startsWith('₹') ? p.original_price : `₹${p.original_price}`) : p.originalPrice,
    image: p.image_url ? resolveMediaUrl(p.image_url) : (p.image || (p.product && p.product.image_url ? resolveMediaUrl(p.product.image_url) : '')),
    discount: p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : (p.discount || null),
    rating: p.rating ? (typeof p.rating === 'object' ? p.rating : { average: p.rating, count: p.reviews_count || 0 }) : null,
    stockStatus: p.stock_status || p.stockStatus || 'in_stock',
    slug: p.slug || (p.product && p.product.slug) || pid
  };
};

export default function Home() {
  const { homeData, fetchHomeData, loading, error } = useHomeStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  if (loading && !homeData) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary mt-3" onClick={() => fetchHomeData()}>Retry</button>
      </div>
    );
  }

  if (!homeData) return null;

  return (
    <main className="homepage-content">
      {/* 🚀 HERO SECTION */}
      {homeData.hero_section && <HeroSection dynamicData={homeData.hero_section} />}

      {/* 📂 COLLECTIONS GRID */}
      {homeData.collections?.length > 0 && (
        <CategoriesSection dynamicCategories={homeData.collections} />
      )}

      {/* ⭐ FEATURED PRODUCTS */}
      {homeData.featured_products?.length > 0 && (
        <ShopByCollections 
          title="Featured Collection" 
          isFeatured={true}
          sectionTitle="Featured Collection"
          products={homeData.featured_products.map(mapHomeProduct)} 
        />
      )}

      {/* 🏷️ DYNAMIC PRODUCT SECTIONS */}
      {homeData.product_sections?.map((section: any) => (
        <ShopByCollections 
          key={section.section_id} 
          title={section.title} 
          sectionId={section.section_id}
          sectionTitle={section.title}
          products={section.products.map(mapHomeProduct)} 
        />
      ))}

      {/* 🎯 SHOP BY OCCASION */}
      {homeData.shop_by_occasion?.length > 0 && (
        <ShopByOccasion dynamicData={homeData.shop_by_occasion} />
      )}

      {/* 🔥 TRENDING CATEGORIES */}
      {homeData.trending_categories?.length > 0 && (
        <TrendingPicks data={homeData.trending_categories} />
      )}

      {/* 💰 SHOP BY PRICE */}
      {homeData.price_filters?.length > 0 && (
        <ShopByPrice data={homeData.price_filters} />
      )}

      {/* 📹 CUSTOMER FAVORITES (VIDEO REELS) */}
      <CustomerFavorites />

      {/* 💬 TESTIMONIALS */}
      {homeData.testimonials?.length > 0 && (
        <Testimonials dynamicTestimonials={homeData.testimonials} />
      )}

      {/* 📝 BLOGS */}
      {homeData.blogs?.length > 0 && (
        <BlogSection dynamicBlogs={homeData.blogs} />
      )}

      {/* 📧 NEWSLETTER */}
      {homeData.newsletter && (
        <NewsletterSection dynamicData={homeData.newsletter} />
      )}
    </main>
  );
}

