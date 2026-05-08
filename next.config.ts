import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow fetching favicons/logos from Google's CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t3.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },

  // Suppress false-positive hydration warnings from browser extensions
  reactStrictMode: true,

  // Compiler options
  compiler: {
    // Remove console.log in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
