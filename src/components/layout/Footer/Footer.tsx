"use client";

import React from 'react';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Footer.css';
import LogoWhite from 'assets/images/logo/Logo-SareeEcom.png';
import footerCards from 'assets/images/footerCards.png';
import fbIcon from 'assets/icons/social/facebookicon.png';
import instaIcon from 'assets/icons/social/instaicon.png';
import linkedinIcon from 'assets/icons/social/linkedinicon.png';
import twitterIcon from 'assets/icons/social/twittericon.png';
import Image from 'next/image';

import { useSettingsStore } from '@/store/settingsStore';
import { IMAGE_BASE } from '@/config/api';

const Footer = () => {
    const { getSiteInfo } = useSettingsStore();
    const siteInfo = getSiteInfo();
    const IMAGE_BASE_URL = IMAGE_BASE;

    const logoSrc = siteInfo.site_logo
        ? (siteInfo.site_logo.startsWith('http') ? siteInfo.site_logo : `${IMAGE_BASE_URL}${siteInfo.site_logo}`)
        : LogoWhite;

    return (
        <footer className="footer-section">
            <div className="container footer-container">
                <div className="row footer-row">

                    {/* Column 1: Logo, Address, Contact, Socials */}
                    <div className="col-lg-3 col-md-6 mb-4 footer-col-info">
                        <div className="footer-logo-container">
                            <img 
                                src={typeof logoSrc === 'string' ? logoSrc : (logoSrc as any).src} 
                                alt={siteInfo.site_title || "Kanchipuram Silks Logo"} 
                                className="footer-logo" 
                                style={{ height: 'auto', maxWidth: '200px' }} 
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = typeof LogoWhite === 'string' ? LogoWhite : (LogoWhite as any).src;
                                }}
                            />
                        </div>
                        <p className="footer-text footer-address">
                            {siteInfo.address || "No: 15, Krishna Kandha Building, SA Garden, Saravanampatti, Coimbatore, Tamil Nadu 641026"}
                        </p>
                        <p className="footer-text footer-contact">
                            {siteInfo.phone || "1-202-555-0106"}<br />
                            {siteInfo.email || "help@shopper.com"}
                        </p>
                        <div className="social-icons">
                            <a href={siteInfo.social_links?.twitter || "#"} className="social-icon-link">
                                <Image src={twitterIcon} alt="Twitter" className="social-icon" width={20} height={20} />
                            </a>
                            <a href={siteInfo.social_links?.facebook || "#"} className="social-icon-link">
                                <Image src={fbIcon} alt="Facebook" className="social-icon" width={20} height={20} />
                            </a>
                            <a href={siteInfo.social_links?.instagram || "#"} className="social-icon-link">
                                <Image src={instaIcon} alt="Instagram" className="social-icon" width={20} height={20} />
                            </a>
                            <a href={siteInfo.social_links?.linkedin || "#"} className="social-icon-link">
                                <Image src={linkedinIcon} alt="LinkedIn" className="social-icon" width={20} height={20} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Supports */}
                    <div className="col-lg-2 col-md-6 mb-4 footer-col-links">
                        <h5 className="footer-heading">SUPPORTS</h5>
                        <ul className="footer-links-list">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="#">Size Guide</Link></li>
                            <li><Link href="#">Shipping & Returns</Link></li>
                            <li><Link href="#">FAQ</Link></li>
                            <li><Link href="#">Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Shop */}
                    <div className="col-lg-2 col-md-6 mb-4 footer-col-links">
                        <h5 className="footer-heading">SHOP</h5>
                        <ul className="footer-links-list">
                            <li><Link href="/products">Saree Shopping</Link></li>
                            <li><Link href="#">Discount</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div className="col-lg-2 col-md-6 mb-4 footer-col-links">
                        <h5 className="footer-heading">COMPANY</h5>
                        <ul className="footer-links-list">
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="#">Affiliate</Link></li>
                            <li><Link href="/login">Login</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Secure Payments */}
                    <div className="col-lg-3 col-md-6 mb-4 footer-col-payments">
                        <h5 className="footer-heading">SECURE PAYMENTS</h5>
                        <div className="payment-icons-container">
                            <Image src={footerCards} alt="Secure Payments Methods" className="payment-cards-img" width={282} height={41} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="footer-divider-container">
                <hr className="footer-divider" />
            </div>

            <div className="container text-center">
                <p className="footer-copyright">
                    © {new Date().getFullYear()} {siteInfo.site_title || "Kanchipuram Silks"}. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
