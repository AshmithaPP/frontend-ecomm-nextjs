"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Logo from '@/assets/images/logo/Logo-SareeEcom.png';
import '../auth.css';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        const success = await login(data);
        setIsLoading(false);
        if (success) {
            router.push(redirectTo);
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Left Side: Heritage Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay">
                    <div className="auth-image-content">
                        <h2>The Essence of Tradition</h2>
                        <p>Experience the finest handwoven Kanchipuram silk sarees, crafted with heritage and precision for over 25 years.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <div className="auth-brand-logo">
                        <Link href="/">
                            <Image src={Logo} alt="SareeEcom" width={100} height={70} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="auth-header">
                        <h1>Sign In</h1>
                        <p>Access your account to continue your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper has-icon">
                                <Mail className="input-icon" size={18} />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="yourname@example.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="m-0">Password</label>
                                <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: '#A42829', fontWeight: '600' }}>
                                    Forgot?
                                </Link>
                            </div>
                            <div className="input-wrapper has-icon">
                                <Lock className="input-icon" size={18} />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password.message}</span>}
                        </div>

                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <div className="new-user-section">
                            <h3>New to SareeEcom?</h3>
                            <p>Discover exclusive collections and heritage craftsmanship.</p>
                            <Link href="/signup" className="signup-link">Create Account</Link>
                        </div>
                        <p className="already-have-account">
                            Need help? <Link href="/contact">Contact Support</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="auth-page-wrapper d-flex align-items-center justify-content-center">
                <div className="spinner"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
