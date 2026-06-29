"use client";

import React, { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import FilterSection from './FilterSection';
import './filters.css';

const FilterSidebar = () => {
    const { 
        availableFilters, 
        activeFilters, 
        absolutePriceRange, 
        updateFilter, 
        setPriceRange, 
        clearAllFilters,
        products,
        pagination 
    } = useProductStore();

    // Mobile specific states
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('filter'); // 'filter' or 'sort'

    // Compute safe price boundaries for the range slider
    const minLimit = absolutePriceRange ? absolutePriceRange.min : (availableFilters.price_range ? Number(availableFilters.price_range.min) : 0);
    const maxLimit = absolutePriceRange ? absolutePriceRange.max : (availableFilters.price_range ? Number(availableFilters.price_range.max) : 50000);
    const safeMin = minLimit === maxLimit ? 0 : minLimit;
    const safeMax = maxLimit === 0 ? 50000 : maxLimit;

    // Body scroll lock when mobile modal is open
    useEffect(() => {
        if (isMobileModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isMobileModalOpen]);

    const apiKeyMap: Record<string, string> = {
        colors: 'color',
        patterns: 'pattern',
        occasions: 'occasion',
        fabrics: 'fabric',
        categories: 'category'
    };

    const filterLabels: Record<string, string> = {
        categories: 'Category',
        fabrics: 'Fabric',
        occasions: 'Occasion',
        patterns: 'Pattern',
        colors: 'Color'
    };

    const handleFilterChange = (key: string, value: string, isChecked: boolean) => {
        updateFilter(apiKeyMap[key] || key, value, isChecked);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const min = name === 'min' 
            ? (value === '' ? undefined : Number(value)) 
            : (activeFilters.min_price !== undefined ? Number(activeFilters.min_price) : safeMin);
        const max = name === 'max' 
            ? (value === '' ? undefined : Number(value)) 
            : (activeFilters.max_price !== undefined ? Number(activeFilters.max_price) : safeMax);
        
        setPriceRange(min ?? safeMin, max ?? safeMax);
    };

    const isFilterActive = (key: string, value: string) => {
        const apiKey = apiKeyMap[key] || key;
        const values = activeFilters[apiKey] ? activeFilters[apiKey].split(',') : [];
        return values.includes(value);
    };

    const handleSortChange = (sortValue: string) => {
        useProductStore.setState((state) => ({
            activeFilters: { ...state.activeFilters, sort: sortValue, page: '1' }
        }));
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (!activeFilters) return 0;
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (['limit', 'page', 'sort', 'min_price', 'max_price'].includes(key)) return;
            if (value && typeof value === 'string') {
                count += value.split(',').filter(Boolean).length;
            }
        });
        return count;
    };

    if (!availableFilters || Object.keys(availableFilters).length === 0) return null;

    const activeFilterCount = getActiveFilterCount();

    const renderPriceRangeSection = () => {
        if (!availableFilters.price_range) return null;
        if (Number(availableFilters.price_range.max) <= 0 && !activeFilters.min_price && !activeFilters.max_price) return null;

        const currentMin = activeFilters.min_price !== undefined ? Number(activeFilters.min_price) : safeMin;
        const currentMax = activeFilters.max_price !== undefined ? Number(activeFilters.max_price) : safeMax;
        const percent = safeMax > safeMin ? ((currentMax - safeMin) / (safeMax - safeMin)) * 100 : 100;

        return (
            <FilterSection title="Price Range">
                <div className="price-range-content">
                    <div className="price-range-values">
                        <span className="price-label">₹{currentMin}</span>
                        <span className="price-label">₹{currentMax}</span>
                    </div>

                    <div className="slider-container">
                        <div className="slider-track"></div>
                        <div 
                            className="slider-filled-track" 
                            style={{ width: `${percent}%` }}
                        ></div>
                        <input
                            type="range"
                            min={safeMin}
                            max={safeMax}
                            value={currentMax}
                            name="max"
                            onChange={handlePriceChange}
                            className="slider-input single-slider"
                        />
                    </div>

                    <div className="price-inputs-row">
                        <input
                            type="number"
                            value={activeFilters.min_price !== undefined ? activeFilters.min_price : ''}
                            name="min"
                            onChange={handlePriceChange}
                            className="price-box"
                            placeholder="Min"
                        />
                        <span className="to-text">to</span>
                        <input
                            type="number"
                            value={activeFilters.max_price !== undefined ? activeFilters.max_price : ''}
                            name="max"
                            onChange={handlePriceChange}
                            className="price-box"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </FilterSection>
        );
    };

    const renderDynamicAttributeSections = () => {
        return Object.entries(availableFilters).map(([key, items]: [string, any]) => {
            if (key === 'price_range') return null;
            if (!items || items.length === 0) return null;

            const apiKey = apiKeyMap[key] || key;

            return (
                <FilterSection key={key} title={filterLabels[key] || key}>
                    <div className="filter-group-content">
                        <ul className="filter-list">
                            <li className="filter-item">
                                <label className="filter-label">
                                    <input 
                                        type="checkbox" 
                                        checked={!activeFilters[apiKey]}
                                        onChange={() => updateFilter(apiKey, '', false)}
                                        className="filter-checkbox"
                                    />
                                    <span className="filter-name">All</span>
                                </label>
                            </li>
                            {items.map((item: any) => (
                                <li key={item.slug} className="filter-item">
                                    <label className="filter-label">
                                        <input 
                                            type="checkbox" 
                                            checked={isFilterActive(key, item.slug)}
                                            onChange={(e) => handleFilterChange(key, item.slug, e.target.checked)}
                                            className="filter-checkbox"
                                        />
                                        <span className="filter-name">{item.name} ({item.count})</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </FilterSection>
            );
        });
    };

    return (
        <>
            <div className="mobile-filter-sticky-bar">
                <button 
                    className="mobile-bar-btn" 
                    onClick={() => { setActiveTab('sort'); setIsMobileModalOpen(true); }}
                >
                    <SlidersHorizontal size={16} /> Sort
                </button>
                <div className="mobile-bar-divider"></div>
                <button 
                    className="mobile-bar-btn" 
                    onClick={() => { setActiveTab('filter'); setIsMobileModalOpen(true); }}
                >
                    <SlidersHorizontal size={16} /> Filter {activeFilterCount > 0 && <span className="active-badge">{activeFilterCount}</span>}
                </button>
            </div>

            {isMobileModalOpen && (
                <div className="mobile-filter-modal">
                    <div className="mobile-filter-modal-header">
                        <div className="mobile-header-left">
                            <button className="mobile-back-btn" onClick={() => setIsMobileModalOpen(false)}>
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="mobile-modal-title">{activeTab === 'sort' ? 'Sort By' : 'Filters'}</h2>
                        </div>
                        {activeTab === 'filter' && (
                            <button className="mobile-clear-all" onClick={clearAllFilters}>Clear All</button>
                        )}
                    </div>

                    <div className="mobile-filter-modal-body-wrapper" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 80px 20px' }}>
                        {activeTab === 'sort' ? (
                            <div className="mobile-sort-options-list">
                                {[
                                    { value: 'newest', label: 'Newest First' },
                                    { value: 'popularity', label: 'Most Popular' },
                                    { value: 'price_low_to_high', label: 'Price: Low to High' },
                                    { value: 'price_high_to_low', label: 'Price: High to Low' }
                                ].map((opt) => {
                                    const currentSort = activeFilters?.sort || 'newest';
                                    return (
                                        <div 
                                            key={opt.value} 
                                            className={`mobile-sort-item${currentSort === opt.value ? ' active' : ''}`}
                                            onClick={() => {
                                                handleSortChange(opt.value);
                                                setIsMobileModalOpen(false);
                                            }}
                                        >
                                            <span>{opt.label}</span>
                                            {currentSort === opt.value && <div className="mobile-sort-check-dot" />}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mobile-filter-checklist-wrapper">
                                {renderPriceRangeSection()}
                                {renderDynamicAttributeSections()}
                            </div>
                        )}
                    </div>

                    <div className="mobile-filter-modal-footer" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
                        <button className="mobile-cta-btn" onClick={() => setIsMobileModalOpen(false)}>
                            See {pagination?.total_products ?? products?.length ?? 0} products
                        </button>
                    </div>
                </div>
            )}

            <aside className="filter-sidebar">
                <div className="filter-header">
                    <span className="filters-title">Filters</span>
                    <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
                </div>
                {renderPriceRangeSection()}
                {renderDynamicAttributeSections()}
            </aside>
        </>
    );
};

export default FilterSidebar;
