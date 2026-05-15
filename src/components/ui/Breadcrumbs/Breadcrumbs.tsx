"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './breadcrumbs.css';
import { BreadcrumbItem } from 'types/product';

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    const pathname = usePathname();
    
    // Default items if none provided
    const defaultItems: BreadcrumbItem[] = [
        { label: 'Home', path: '/' },
        { label: 'Sarees', path: '/products' },
        { label: 'Collection', path: pathname }
    ];

    const breadcrumbItems = items || defaultItems;

    return (
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
            <ol className="breadcrumb list-unstyled">
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    return (
                        <li 
                            key={index} 
                            className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                            aria-current={isLast ? 'page' : undefined}
                        >
                            {isLast ? (
                                <span className="current-item">{item.label}</span>
                            ) : (
                                <Link href={item.path} className="breadcrumb-link">{item.label}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
