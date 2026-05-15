"use client";

import React from 'react';
import { useProductStore } from '@/store/productStore';
import FilterSection from './FilterSection';
import './filters.css';

const FilterSidebar = () => {
    const { availableFilters, activeFilters, updateFilter, setPriceRange, clearAllFilters } = useProductStore();

    // Mapping UI keys to API keys
    const apiKeyMap: Record<string, string> = {
        colors: 'color',
        patterns: 'pattern',
        occasions: 'occasion',
        fabrics: 'fabric',
        categories: 'category'
    };

    // Mapping API keys to UI Labels
    const filterLabels: Record<string, string> = {
        colors: 'Color',
        patterns: 'Pattern',
        occasions: 'Occasion',
        fabrics: 'Fabric',
        categories: 'Category'
    };

    const handleFilterChange = (key: string, value: string, isChecked: boolean) => {
        updateFilter(apiKeyMap[key] || key, value, isChecked);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const min = name === 'min' ? Number(value) : (activeFilters.min_price || 0);
        const max = name === 'max' ? Number(value) : (activeFilters.max_price || 50000);
        setPriceRange(min, max);
    };

    const isFilterActive = (key: string, value: string) => {
        const apiKey = apiKeyMap[key] || key;
        const values = activeFilters[apiKey] ? activeFilters[apiKey].split(',') : [];
        return values.includes(value);
    };

    if (!availableFilters || Object.keys(availableFilters).length === 0) return null;

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <span className="filters-title">Filters</span>
                <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
            </div>

            {/* Price Range Section */}
            {availableFilters.price_range && (
                <FilterSection title="Price Range">
                    <div className="price-range-content">
                        <div className="price-range-values">
                            <span className="price-label">₹{availableFilters.price_range.min}</span>
                            <span className="price-label">₹{availableFilters.price_range.max}</span>
                        </div>

                        <div className="slider-container">
                            <input
                                type="range"
                                min={availableFilters.price_range.min}
                                max={availableFilters.price_range.max}
                                value={activeFilters.max_price || availableFilters.price_range.max}
                                name="max"
                                onChange={handlePriceChange}
                                className="slider-input single-slider"
                            />
                        </div>

                        <div className="price-inputs-row">
                            <input
                                type="number"
                                value={activeFilters.min_price || ''}
                                name="min"
                                onChange={handlePriceChange}
                                className="price-box"
                                placeholder="Min"
                            />
                            <span className="to-text">to</span>
                            <input
                                type="number"
                                value={activeFilters.max_price || ''}
                                name="max"
                                onChange={handlePriceChange}
                                className="price-box"
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </FilterSection>
            )}

            {/* Dynamic Attribute Sections */}
            {Object.entries(availableFilters).map(([key, items]: [string, any]) => {
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
                                            onChange={() => updateFilter(apiKey, '', false)} // Passing empty clears it
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
            })}
        </aside>
    );
};

export default FilterSidebar;
