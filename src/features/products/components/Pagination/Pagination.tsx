"use client";

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import './pagination.css';

const Pagination = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { pagination } = useProductStore();
    const { current_page, total_pages } = pagination;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > total_pages) return;
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set('page', String(page));
        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (total_pages <= 1) return null;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
        let end = Math.min(total_pages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="pagination-wrapper d-flex justify-content-center mt-5">
            <button 
                className="page-btn prev-btn" 
                onClick={() => handlePageChange(current_page - 1)}
                disabled={current_page === 1}
            >
                Previous
            </button>
            
            {getPageNumbers().map(page => (
                <button 
                    key={page}
                    className={`page-btn num-btn ${current_page === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
            
            <button 
                className="page-btn next-btn"
                onClick={() => handlePageChange(current_page + 1)}
                disabled={current_page === total_pages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
