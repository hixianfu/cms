import type { NextConfig } from "next";

const mediaHost = process.env.STRAPI_MEDIA_HOST ?? "172.16.4.53";
const allowedDevOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: mediaHost,
        port: process.env.STRAPI_MEDIA_PORT ?? "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: mediaHost,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
