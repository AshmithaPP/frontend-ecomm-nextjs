"use client";

import React from 'react';
import './sidebar.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import profileImg from 'assets/icons/ui/contact.png';

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'My Orders', icon: 'bi-box-seam', path: '#', active: false },
        { label: 'Wishlist', icon: 'bi-heart', path: '/wishlist', active: pathname === '/wishlist' },
        { label: 'Addresses', icon: 'bi-geo-alt', path: '#', active: false },
        { label: 'Profile Info', icon: 'bi-person', path: '#', active: false },
        { label: 'Logout', icon: 'bi-power', path: '#', active: false },
    ];

    return (
        <div className="wishlist-sidebar">
            <div className="profile-section text-center">
                <div className="profile-img-container mx-auto">
                    <img 
                        src="https://img.freepik.com/free-photo/beautiful-young-woman-with-clean-fresh-skin_186202-6019.jpg" 
                        alt="Adam Vishnoi" 
                        className="profile-img"
                    />
                </div>
                <h4 className="user-name mt-3 mb-1">Adam Vishnoi</h4>
                <p className="user-country text-muted">Australia</p>
            </div>

            <div className="dashboard-nav">
                <div className="nav-header">
                    Dashboard Navigation
                </div>
                <ul className="nav-list list-unstyled mb-0">
                    {navItems.map((item, index) => (
                        <li key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
                            <Link href={item.path} className="nav-link">
                                <i className={`bi ${item.icon} nav-icon`}></i> {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
