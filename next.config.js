/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enable gzip compression for better performance
  experimental: {
    optimizePackageImports: ['recharts'], // Optimize chart library imports
  },
}

module.exports = nextConfig
