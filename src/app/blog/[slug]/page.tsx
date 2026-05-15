"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IMAGE_BASE } from '@/config/api';

import styles from './page.module.css';
import { useBlogStore } from '@/store/blogStore';
import BlogSection from '@/features/home/components/BlogSection/BlogSection';
import BlogDetailMain from 'assets/images/blog/blog_detail_main.png';

const BlogDetails = () => {
    const params = useParams();
    const slug = params.slug as string;
    const { selectedBlog: blog, fetchBlogBySlug, loading } = useBlogStore();

    // Fetch data when slug changes
    useEffect(() => {
        if (slug) {
            fetchBlogBySlug(slug);
        }
    }, [slug, fetchBlogBySlug]);

    // Scroll to top when blog changes
    useEffect(() => {
        if (blog) {
            window.scrollTo(0, 0);
        }
    }, [blog]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!blog) return <div className={styles.error}>Blog post not found.</div>;

    const imageUrl = blog.image_url?.startsWith('/uploads') 
        ? `${IMAGE_BASE}${blog.image_url}` 
        : (blog.image_url || BlogDetailMain.src);

    return (
        <div className={styles.blogDetailsPage}>
            <header className={styles.heroSection}>
                <h1 className={styles.title}>
                    {blog.title}
                </h1>
                <p className={styles.subheading}>
                    {blog.seo_description || blog.excerpt}
                </p>
            </header>

            <main className={styles.mainContent}>
                {/* Main Hero Image */}
                <div className={styles.mainImageWrapper}>
                    <img 
                        src={imageUrl} 
                        alt={blog.title} 
                        className={styles.mainImage} 
                    />
                </div>

                {/* Article Body */}
                <article className={styles.articleBody}>
                    <div 
                        className={styles.dynamicContent} 
                        dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
                    />
                </article>
            </main>
            <BlogSection 
                title="Popular Posts" 
                customTitleClass={styles.popularPostsTitle} 
            />
        </div>
    );
};

export default BlogDetails;
