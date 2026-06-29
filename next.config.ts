import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/cart',
        destination: '/collections/products',
        permanent: true,
      },
      {
        source: '/shop-sarees',
        destination: '/collections/products',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/collections/products',
        permanent: true,
      },
      {
        source: '/products/:id',
        destination: '/collections/products/:id',
        permanent: true,
      },
      {
        source: '/shop-product',
        destination: '/collections/products',
        permanent: true,
      },
      {
        source: '/shop-products',
        destination: '/collections/products',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
