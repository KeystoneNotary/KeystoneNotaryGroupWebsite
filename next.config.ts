import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["gsap", "lucide-react"],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
