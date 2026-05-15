"use client";

import React, { useState } from 'react';
import './newsletterSection.css';
import newsletterImg from 'assets/images/silk/NewsSection.png'; 
import Image from 'next/image';
import { IMAGE_BASE } from '@/config/api';

interface NewsletterSectionProps {
    dynamicData?: any;
}

const NewsletterSection = ({ dynamicData }: NewsletterSectionProps) => {
  const [email, setEmail] = useState('');
  const IMAGE_BASE_URL = IMAGE_BASE;

  const displayData = {
    title: dynamicData?.title || "Enter The World Of Timeless Sarees",
    subtitle: dynamicData?.subtitle || "Be The First To Discover Our Latest Kanchipuram Collections, Festive Edits, And Exclusive Store Events.",
    emailPlaceholder: dynamicData?.email_placeholder || "Enter Your Email Address",
    buttonText: dynamicData?.button_text || "Stay Connected",
    image: dynamicData?.image_url 
      ? (dynamicData.image_url.startsWith('http') ? dynamicData.image_url : `${IMAGE_BASE_URL}${dynamicData.image_url}`)
      : newsletterImg
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email Submitted:', email);
  };

  return (
    <section className="newsletter-section">
      <div className="container newsletter-container">
        <div className="newsletter-card">
          <div className="row align-items-center h-100">
            {/* Left Content Column */}
            <div className="col-lg-7 col-md-12 d-flex flex-column justify-content-center newsletter-content">
              <h2 className="newsletter-title">
                {displayData.title}
              </h2>
              <p className="newsletter-subtitle">
                {displayData.subtitle}
              </p>
              
              <form onSubmit={handleSubmit} className="newsletter-form d-flex">
                <input
                  type="email"
                  className="form-control newsletter-input"
                  placeholder={displayData.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button type="submit" className="btn newsletter-btn">
                  {displayData.buttonText}
                </button>
              </form>
            </div>

            {/* Right Image Column */}
            <div className="col-lg-5 col-md-12 newsletter-image-col">
              <div className="newsletter-image-wrapper">
                {typeof displayData.image === 'string' ? (
                    <img 
                        src={displayData.image} 
                        alt={displayData.title} 
                        className="newsletter-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Image 
                        src={displayData.image} 
                        alt={displayData.title} 
                        className="newsletter-image"
                        width={500}
                        height={600}
                        style={{ objectFit: 'cover' }}
                    />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

