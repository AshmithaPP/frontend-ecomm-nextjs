"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './navbar.css';
import Logo from 'assets/images/logo/Logo-SareeEcom.png';
import SearchIcon from 'assets/icons/ui/search-line.png';
import UserIcon from 'assets/icons/ui/contact.png';
import CartIcon from 'assets/icons/ui/shopping-cart.png';
import Image from 'next/image';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { LogOut, ChevronDown } from 'lucide-react';
import { IMAGE_BASE, API_BASE, resolveMediaUrl } from '@/config/api';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [navItems, setNavItems] = useState<any[]>([]);
    
    const { items: wishlistItems, fetchWishlist } = useWishlistStore();
    const { cart, fetchCart, setDrawerOpen } = useCartStore();
    const cartItems = cart.items || [];
    
    const { fetchSettings, getSiteInfo } = useSettingsStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const siteInfo = getSiteInfo();

    useEffect(() => {
        fetchSettings();
        fetchCart();
        fetchWishlist();
    }, [fetchSettings, fetchCart, fetchWishlist]);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const response = await fetch(`${API_BASE}/navigation`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setNavItems(result.data);
                }
            } catch (error) {
                console.error('Error fetching dynamic navigation:', error);
            }
        };
        fetchNav();
    }, []);

    const logoSrc = siteInfo.site_logo
        ? resolveMediaUrl(siteInfo.site_logo)
        : Logo;

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const toggleUserMenu = () => setUserMenuOpen(prev => !prev);

    // Body scroll lock for premium UX
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [menuOpen]);

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    // Close profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuOpen && !(event.target as Element).closest('.user-profile-container')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="navbar-wrapper">
            <div 
                className={`menu-backdrop${menuOpen ? ' show' : ''}`} 
                onClick={() => setMenuOpen(false)}
            ></div>
            <div className="navbar-inner">
                {/* Logo — clicking always returns to home */}
                <Link href="/" aria-label="Go to home page" className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={typeof logoSrc === 'string' ? logoSrc : (logoSrc as any).src}
                        alt={siteInfo.site_title || "Kanchipuram Silk Logo"}
                        className="logo-img"
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = typeof Logo === 'string' ? Logo : (Logo as any).src;
                        }}
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="nav-inner-content">
                    <div className={`nav-links${menuOpen ? ' show' : ''}`}>
                        {navItems.length > 0 ? (
                            navItems.map((item) => (
                                <Link 
                                    key={item.menu_id}
                                    href={item.route_path} 
                                    target={item.open_in_new_tab ? '_blank' : undefined}
                                    className={`nav-link${isActive(item.route_path) ? ' active' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))
                        ) : (
                            <>
                                <Link href="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>Home</Link>
                                <Link href="/products" className={`nav-link${isActive('/products') ? ' active' : ''}`}>Shop Sarees</Link>
                                <Link href="/occasions" className={`nav-link${isActive('/occasions') ? ' active' : ''}`}>Occasions</Link>
                                <Link href="/heritage" className={`nav-link${isActive('/heritage') ? ' active' : ''}`}>Heritage</Link>
                                <Link href="/contact" className={`nav-link${isActive('/contact') ? ' active' : ''}`}>Contact Us</Link>
                                <Link href="/about" className={`nav-link${isActive('/about') ? ' active' : ''}`}>About Us</Link>
                                <Link href="/blog" className={`nav-link${isActive('/blog') ? ' active' : ''}`}>Blog</Link>
                            </>
                        )}

                        <div className="nav-icons mobile-only-icons">
                            {isAuthenticated ? (
                                <Link href="/account" className="nav-icon" onClick={() => setMenuOpen(false)}>
                                    <Image src={UserIcon} alt="Profile" width={24} height={24} />
                                </Link>
                            ) : (
                                <Link href="/login" className="nav-icon" onClick={() => setMenuOpen(false)}>
                                    <Image src={UserIcon} alt="User" width={24} height={24} />
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link href="/wishlist" className="nav-icon wishlist-nav-icon">
                                    <i className="bi bi-heart thick-heart"></i>
                                    {wishlistItems.length > 0 && (
                                        <span className="wishlist-badge">{wishlistItems.length}</span>
                                    )}
                                </Link>
                            )}
                            <div 
                                className="nav-icon cart-nav-icon" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => { setMenuOpen(false); setDrawerOpen(true); }}
                            >
                                <Image src={CartIcon} alt="Cart" width={24} height={24} />
                                {cartItems.length > 0 && (
                                    <span className="cart-badge">{cartItems.length}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="nav-icons desktop-only-icons">
                        
                        <div className="user-profile-container">
                            {isAuthenticated ? (
                                <>
                                    <button className="nav-icon user-profile-btn" onClick={toggleUserMenu} aria-label="User menu">
                                        <span className="user-name-abbr">{user?.name?.charAt(0) || 'U'}</span>
                                    </button>
                                    {userMenuOpen && (
                                        <div className="user-dropdown">
                                            <div className="dropdown-header">
                                                <p className="user-name">{user?.name}</p>
                                                <p className="user-email">{user?.email}</p>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <Link href="/account" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                                            <Link href="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/login" className="nav-icon sign-in-btn" aria-label="Sign in">
                                    <Image src={UserIcon} alt="User" width={24} height={24} />
                                </Link>
                            )}
                        </div>

                        {isAuthenticated && (
                            <Link href="/wishlist" className="nav-icon wishlist-nav-icon">
                                <i className="bi bi-heart thick-heart"></i>
                                {wishlistItems.length > 0 && (
                                    <span className="wishlist-badge">{wishlistItems.length}</span>
                                )}
                            </Link>
                        )}
                        <div 
                            className="nav-icon cart-nav-icon" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <Image src={CartIcon} alt="Cart" width={24} height={24} />
                            {cartItems.length > 0 && (
                                <span className="cart-badge">{cartItems.length}</span>
                            )}
                        </div>
                    </div>

                    {/* Hamburger Button — visible only on mobile */}
                    <button
                        className="hamburger"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        <span className={`hamburger-line${menuOpen ? ' open' : ''}`}></span>
                        <span className={`hamburger-line${menuOpen ? ' open' : ''}`}></span>
                        <span className={`hamburger-line${menuOpen ? ' open' : ''}`}></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

