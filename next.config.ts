import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // <- Esto permite que el build continúe aunque haya warnings/errors de ESLint
  },
  output: "standalone", // recomendado para Vercel
};

export default nextConfig;
