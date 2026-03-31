import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: process.env.IMAGE_DOMAIN || "",
      },
    ],
  },
};

export default nextConfig;
