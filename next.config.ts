import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statically exported site: the entire app is rendered to HTML/CSS/JS at
  // build time and lives under `out/`. This means no Node server, no API
  // routes, no on-demand image optimization, and no async `headers()`
  // (security headers are configured via the host's .htaccess instead).
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
