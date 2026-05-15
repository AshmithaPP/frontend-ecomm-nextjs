export interface Product {
    id: number | string;
    name: string;
    price: number;
    originalPrice?: number | null;
    discount?: number | string | null;
    image: any;
    isBestSeller?: boolean;
    discountBg?: string; // For home page variants if needed
    title?: string; // Compatibility with home page data structure
    discountedPrice?: string | number; // Compatibility with home page data structure
}

export interface BreadcrumbItem {
    label: string;
    path: string;
}
