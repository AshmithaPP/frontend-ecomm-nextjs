"use client";
import React, { useState } from 'react';
import './productImage.css';

const ProductImage = ({ media, video }: any) => {
    // Get images from media object
    const galleryImages = media?.gallery?.length > 0 ? media.gallery : [media?.primary || ''];

    // Combine images and video into a single items array
    const items = [...galleryImages.map((url: string) => ({ type: 'image', url }))];
    if (video) {
        items.push({ type: 'video', url: video });
    }

    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = items[activeIndex];

    return (
        <div className="product-gallery-layout d-flex gap-3">
            {/* Left: Vertical Thumbnails */}
            <div className="thumbnail-vertical-column d-flex flex-column gap-2">
                {items.map((item: any, index: number) => (
                    <div
                        key={index}
                        className={`thumbnail-item ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {item.type === 'image' ? (
                            <img src={item.url} alt={`Thumb ${index}`} />
                        ) : (
                            <div className="video-thumb-overlay">
                                <i className="bi bi-play-circle-fill"></i>
                                <img src={galleryImages[0]} alt="Video Thumb" className="video-thumb-bg" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Main Image Area */}
            <div className="main-image-display position-relative flex-grow-1">
                {activeItem?.type === 'video' ? (
                    <video
                        src={activeItem.url}
                        className="main-display-media"
                        controls
                        autoPlay
                        muted
                    />
                ) : activeItem?.type === 'image' && activeItem.url ? (
                    <img src={activeItem.url} alt="Product" className="main-display-media" />
                ) : (
                    <div className="main-display-media placeholder">
                        <span>No Media Available</span>
                    </div>
                )}

                {/* Wishlist/Share Icons */}
                <div className="image-action-overlay">
                    <button className="image-action-btn share-btn" aria-label="Share">
                        <i className="bi bi-share"></i>
                    </button>
                    <button className="image-action-btn wishlist-btn" aria-label="Add to Wishlist">
                        <i className="bi bi-heart"></i>
                    </button>
                </div>

                {activeItem?.type === 'image' && (
                    <button className="zoom-indicator-btn">
                        <i className="bi bi-search"></i>
                        <span>Hover to Zoom</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductImage;
