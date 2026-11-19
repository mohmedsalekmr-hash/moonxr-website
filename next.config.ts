import type { NextConfig } from "next";

const SUPABASE = "https://jhferwtmaklnnruorkeh.supabase.co";

// Content-Security-Policy: the browser only runs and loads what comes from this site and from our Supabase project.
// 'unsafe-inline' is needed by Next.js for its inline boot scripts; 'wasm-unsafe-eval' by the 3D model decoder.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE}`,
  `media-src 'self' blob: ${SUPABASE}`,
  "font-src 'self' data:",
  `connect-src 'self' blob: data: ${SUPABASE} wss://jhferwtmaklnnruorkeh.supabase.co`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: CSP }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: false }];
  },
  async headers() {
    return [
      {
        // photos, logos and clips rarely change: phones keep them a week, then refresh quietly
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      { source: "/:path*", headers: SECURITY_HEADERS },
    ];
  },
};

export default nextConfig;
