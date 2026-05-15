"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [isAuthenticated, router, pathname]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
