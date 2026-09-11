import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.STRAPI_MEDIA_HOST ?? "localhost",
        port: process.env.STRAPI_MEDIA_PORT ?? "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.STRAPI_MEDIA_HOST ?? "localhost",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
