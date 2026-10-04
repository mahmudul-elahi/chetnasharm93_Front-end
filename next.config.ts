import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "192.168.7.192",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "model.devlaro.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;