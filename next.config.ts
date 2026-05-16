import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/cart',
        destination: '/products',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
