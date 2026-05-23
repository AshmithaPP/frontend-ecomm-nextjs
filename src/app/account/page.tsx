"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { API_BASE } from '@/config/api';
import './account.css';

interface AccountUser {
    user_id: string;
    name: string;
    email: string;
    phone?: string;
}

export default function AccountPage() {
    const router = useRouter();
    const { isAuthenticated, token, user: storedUser, updateUser } = useAuthStore();

    const [profile, setProfile] = useState<AccountUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login?redirect=/account');
            return;
        }
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/account/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success && data.user) {
                setProfile(data.user);
                updateUser(data.user);
            } else {
                // Fallback to Zustand stored user
                if (storedUser) setProfile(storedUser as AccountUser);
                else setError('Could not load profile.');
            }
        } catch {
            if (storedUser) setProfile(storedUser as AccountUser);
            else setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const initial = (profile?.name || storedUser?.name || 'U').charAt(0).toUpperCase();
    const displayName = profile?.name || storedUser?.name || '—';
    const displayEmail = profile?.email || storedUser?.email || '—';
    const displayPhone = profile?.phone || storedUser?.phone || null;

    return (
        <main className="acct-page">
            <div className="acct-container">

                {/* ── Header card ── */}
                <div className="acct-hero-card">
                    <div className="acct-avatar">{initial}</div>
                    {loading ? (
                        <div className="acct-skeleton-group">
                            <div className="acct-skeleton acct-skeleton-name" />
                            <div className="acct-skeleton acct-skeleton-email" />
                        </div>
                    ) : (
                        <div className="acct-hero-info">
                            <h1 className="acct-hero-name">{displayName}</h1>
                            <p className="acct-hero-email">{displayEmail}</p>
                            {displayPhone && (
                                <p className="acct-hero-phone">
                                    <i className="bi bi-telephone-fill me-1" />
                                    {displayPhone}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="acct-error-banner">
                        <i className="bi bi-exclamation-circle me-2" />{error}
                    </div>
                )}

                {/* ── Body grid: 2 columns on desktop ── */}
                <div className="acct-body-grid">

                    {/* Profile details card */}
                    {!loading && profile && (
                        <div className="acct-details-card">
                            <h2 className="acct-section-title">Profile Details</h2>
                            <div className="acct-field-grid">
                                <div className="acct-field">
                                    <span className="acct-field-label">Full Name</span>
                                    <span className="acct-field-value">{profile.name}</span>
                                </div>
                                <div className="acct-field">
                                    <span className="acct-field-label">Email Address</span>
                                    <span className="acct-field-value">{profile.email}</span>
                                </div>
                                {profile.phone && (
                                    <div className="acct-field">
                                        <span className="acct-field-label">Phone</span>
                                        <span className="acct-field-value">{profile.phone}</span>
                                    </div>
                                )}
                              
                            </div>
                        </div>
                    )}

                    {/* Quick links */}
                    <div className="acct-quick-links">
                        <h2 className="acct-section-title">Quick Links</h2>
                        <Link href="/orders" className="acct-quick-card">
                            <span className="acct-quick-icon"><i className="bi bi-bag-check" /></span>
                            <div className="acct-quick-text">
                                <span className="acct-quick-label">My Orders</span>
                                <span className="acct-quick-sub">View all your orders</span>
                            </div>
                            <i className="bi bi-chevron-right acct-quick-arrow" />
                        </Link>
                        <Link href="/orders" className="acct-quick-card">
                            <span className="acct-quick-icon"><i className="bi bi-receipt" /></span>
                            <div className="acct-quick-text">
                                <span className="acct-quick-label">Order Details</span>
                                <span className="acct-quick-sub">Check order status &amp; info</span>
                            </div>
                            <i className="bi bi-chevron-right acct-quick-arrow" />
                        </Link>
                        <Link href="/wishlist" className="acct-quick-card">
                            <span className="acct-quick-icon"><i className="bi bi-heart" /></span>
                            <div className="acct-quick-text">
                                <span className="acct-quick-label">Wishlist</span>
                                <span className="acct-quick-sub">Your saved favourites</span>
                            </div>
                            <i className="bi bi-chevron-right acct-quick-arrow" />
                        </Link>
                    </div>

                </div>

            </div>
        </main>
    );
}
