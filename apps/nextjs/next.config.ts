// Imports
// ============================================================
import type { NextConfig } from "next";
import "./src/env";

// Config
// ============================================================
const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/db",
    "@repo/auth",
    "@repo/api",
    // Example
    // "@repo/ui",
  ],
};

// Export
// ============================================================
export default nextConfig;
