"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE } from '@/config/api';
import './TopBar.css';

interface Announcement {
    text: string;
    background_color: string;
    text_color: string;
    link?: string;
    is_active: boolean;
}

const TopBar = () => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(`${API_BASE}/announcement-bar`);
                const result = await response.json();
                if (result.success && result.data) {
                    setAnnouncement(result.data);
                }
            } catch (error) {
                console.error('Error fetching announcement bar:', error);
            }
        };
        fetchAnnouncement();
    }, []);

    const text = announcement ? announcement.text : "Free Shipping Order Above 5000 Rupees in Tamilnadu";
    const bgColor = announcement?.background_color || '#e8a23a';
    const textColor = announcement?.text_color || '#FFFFFF';

    return (
        <div className="topbar" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className="topbar-text">
                {announcement?.link ? (
                    <a href={announcement.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {text}
                    </a>
                ) : (
                    text
                )}
            </div>
        </div>
    );
};

export default TopBar;
