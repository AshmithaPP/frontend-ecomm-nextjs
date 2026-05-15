"use client";

import React from 'react';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import BlogSection from 'features/home/components/BlogSection/BlogSection';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';

const BlogPage = () => {
    return (
        <div className="blog-page">
            <ContactHero />
            <BlogSection showTitle={true} />
            <NewsletterSection />
        </div>
    );
};

export default BlogPage;
