import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "static.ghost.org",
      },
    ],
  },
};

export default nextConfig;
