import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this 'images' configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**', // Allow any path from this host
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tours',
        destination: '/packages',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;