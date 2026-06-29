"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import Breadcrumbs from 'components/ui/Breadcrumbs/Breadcrumbs';
import FilterSidebar from 'features/products/components/Filters/FilterSidebar';
import ProductCard from 'components/ui/ProductCard';
import Pagination from 'features/products/components/Pagination/Pagination';
import SearchInput from 'components/ui/SearchInput';

import './productsPage.css';

const ProductsContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [isSortOpen, setIsSortOpen] = useState(false);
    const { products, loading, error, fetchProducts, pagination, activeFilters } = useProductStore();

    const isFirstRender = React.useRef(true);

    // 1. Sync URL -> Zustand on Mount & URL query changes
    useEffect(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        
        // Deep compare to prevent infinite render loops
        const currentActive = useProductStore.getState().activeFilters;
        const keys1 = Object.keys(params);
        const keys2 = Object.keys(currentActive);
        const hasChanged = keys1.length !== keys2.length || keys1.some(k => params[k] !== currentActive[k]);
        
        if (hasChanged) {
            useProductStore.setState({ activeFilters: params });
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    // 2. Sync Zustand -> URL & Fetch on changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchProducts();
            return;
        }

        const latestFilters = useProductStore.getState().activeFilters;
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

        // Update URL to match Zustand state
        Object.entries(latestFilters).forEach(([key, value]) => {
            currentParams.set(key, value as string);
        });

        // Remove keys that are NOT in latestFilters but are in the URL 
        const activeKeys = Object.keys(latestFilters);
        Array.from(searchParams.keys()).forEach(key => {
            if (!activeKeys.includes(key) && key !== 'page' && key !== 'limit' && key !== 'sort') {
                currentParams.delete(key);
            }
        });

        const newUrl = `${pathname}?${currentParams.toString()}`;
        if (`${pathname}?${searchParams.toString()}` !== newUrl) {
            router.replace(newUrl, { scroll: false });
        }

        // Trigger fetch
        fetchProducts();
    }, [activeFilters]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSortChange = (sortValue: string) => {
        useProductStore.setState((state) => ({
            activeFilters: { ...state.activeFilters, sort: sortValue, page: '1' }
        }));
        setIsSortOpen(false);
    };

    // Close sort on outside click
    useEffect(() => {
        const closeSort = (e: any) => {
            if (!e.target.closest('.sort-dropdown')) setIsSortOpen(false);
        };
        document.addEventListener('click', closeSort);
        return () => document.removeEventListener('click', closeSort);
    }, []);

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Collections', path: '/collections/products' }
    ];

    if (error) {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-danger">Error loading products</h3>
                <p>{error}</p>
                <button className="btn btn-primary mt-3" onClick={() => fetchProducts()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="products-page-container container-fluid px-md-5 py-4">
            {/* Breadcrumbs Row */}
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-start">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>

            {/* Main Content Row */}
            <div className="row g-3 g-md-4">
                {/* Left Sidebar Filters */}
                <div className="col-lg-3 col-md-4">
                    <FilterSidebar />
                </div>

                {/* Right Side Content Grid */}
                <div className="col-lg-9 col-md-8">
                    {/* Header Section */}
                    <div className="row mb-4">
                        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h2 className="products-title m-0">
                                {activeFilters.section_title
                                    ? decodeURIComponent(activeFilters.section_title)
                                    : (activeFilters.category
                                        ? activeFilters.category.split(',').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                                        : 'All Collections')}
                            </h2>

                            <div className="products-meta-controls d-flex align-items-center gap-3">
                                <SearchInput
                                    placeholder="Search in this collection..."
                                    value={activeFilters.search || ''}
                                    onSearch={(val) => {
                                        useProductStore.setState((state) => ({
                                            activeFilters: { ...state.activeFilters, search: val, page: '1' }
                                        }));
                                    }}
                                    className="products-search-box"
                                />

                                <div className="sort-dropdown dropdown">
                                    <button
                                        className="sort-btn dropdown-toggle"
                                        type="button"
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                    >
                                        <span className="sort-text">
                                            Sort By: {
                                                activeFilters.sort === 'price_low_to_high' ? 'Price: Low to High' :
                                                    activeFilters.sort === 'price_high_to_low' ? 'Price: High to Low' :
                                                        activeFilters.sort === 'popularity' ? 'Popularity' : 'Newest'
                                            }
                                        </span>
                                    </button>
                                    <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${isSortOpen ? 'show' : ''}`}>
                                        <li><button className="dropdown-item" onClick={() => handleSortChange('newest')}>Newest First</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleSortChange('popularity')}>Most Popular</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleSortChange('price_low_to_high')}>Price: Low to High</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleSortChange('price_high_to_low')}>Price: High to Low</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="row row-cols-2 row-cols-sm-2 row-cols-lg-3 g-2 g-md-4">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div className="col" key={i}>
                                    <div className="product-card-skeleton" style={{ height: '350px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}></div>
                                </div>
                            ))
                        ) : products?.length > 0 ? (
                            products.map((product) => (
                                <div className="col d-flex justify-content-center" key={product.id || product.product_id}>
                                    <ProductCard 
                                        product={product} 
                                        className="catalog-card-wrapper"
                                        cardClassName="catalog-card-body"
                                        imageClassName="catalog-card-image"
                                        variant="catalog"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <p>No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Section */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <Pagination />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
