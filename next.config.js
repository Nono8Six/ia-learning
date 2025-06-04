/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // Disable webpack persistent caching to fix the errors
  webpack: (config, { dev, isServer }) => {
    // Completely disable cache in development mode to prevent ENOENT errors
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;