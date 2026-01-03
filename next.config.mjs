/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 768, 1024],
    imageSizes: [32, 48, 64, 96, 128, 160],
  },
};

export default nextConfig;
