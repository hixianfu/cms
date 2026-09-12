import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
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
