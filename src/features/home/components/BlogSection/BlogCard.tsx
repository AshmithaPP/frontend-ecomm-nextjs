import React from 'react';
import Link from 'next/link';
import './blogSection.css';
import Image from 'next/image';

interface BlogCardProps {
    id: string | number;
    image: any;
    category?: string;
    date?: string;
    title: string;
    description: string;
}

const BlogCard = ({ id, image, category = "Travel", date = "13 March 2023", title, description }: BlogCardProps) => {
  const blogLink = `/blog/${id}`;
  
  return (
    <div className="blog-card">
      <div className="blog-image-wrapper">
        <Link href={blogLink}>
            {typeof image === 'string' ? (
                <img src={image} alt={title} className="blog-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <Image src={image} alt={title} className="blog-image" width={400} height={250} />
            )}
        </Link>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-category">{category}</span>
          <span className="blog-date">{date}</span>
        </div>
        <h3 className="blog-title">
          <Link href={blogLink} style={{ textDecoration: 'none', color: 'inherit' }}>
            {title}
          </Link>
        </h3>
        <p className="blog-description">{description}</p>
        <Link href={blogLink} className="blog-readmore">Read More...</Link>
      </div>
    </div>
  );
};

export default BlogCard;

