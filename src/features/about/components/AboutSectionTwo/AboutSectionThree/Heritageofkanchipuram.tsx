"use client";

import React from "react";
import "./Heritageofkanchipuram.css";

const features = [
  {
    title: "Sacred Origin",
    description:
      "Crafted in the holy town of Kanchipuram, our sarees are born from the legendary weaving descendants of Sage Markanda.",
  },
  {
    title: "Mulberry Silk",
    description:
      "We use only high-denier Mulberry silk from South India, known for its exceptional luster and remarkable durability across lifetimes.",
  },
  {
    title: "Zari Craftsmanship",
    description:
      "Our Zari is made of silk thread dipped in liquid silver and finished with pure 24-karat gold plating for that eternal glow.",
  },
];

const images = [
  {
    src: null,
    alt: "Traditional weaving loom",
    placeholderClass: "heritage-img-placeholder-1",
  },
  {
    src: null,
    alt: "Mulberry silk cocoon on loom",
    placeholderClass: "heritage-img-placeholder-2",
  },
  {
    src: null,
    alt: "Rich red Kanchipuram silk with gold motifs",
    placeholderClass: "heritage-img-placeholder-3",
  },
  {
    src: null,
    alt: "Kanchipuram temple stone pillars",
    placeholderClass: "heritage-img-placeholder-4",
  },
];

const Heritageofkanchipuram = () => {
  return (
    <section className="heritage-section">
      <div className="heritage-inner">

        {/* Header: Title + Subtitle */}
        <div className="heritage-header">
          <h2 className="heritage-title">The Heritage of Kanchipuram</h2>
          <p className="heritage-subtitle">
            The city of a thousand temples serves as our eternal muse. Every
            motif—from the temple towers (Gopurams) to the peacock
            (Mayil)—tells a story of divine inspiration.
          </p>
        </div>

        {/* 4-Image Grid */}
        <div className="heritage-images-grid">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`heritage-image-item${!img.src ? ` ${img.placeholderClass}` : ""}`}
            >
              {img.src && <img src={typeof img.src === 'string' ? img.src : (img.src as any).src} alt={img.alt} />}
            </div>
          ))}
        </div>

        {/* 3-Feature Row */}
        <div className="heritage-features-row">
          {features.map((feature, idx) => (
            <div key={idx} className="heritage-feature">
              <h3 className="heritage-feature-title">{feature.title}</h3>
              <p className="heritage-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Heritageofkanchipuram;
