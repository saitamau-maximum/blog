/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["github.com"],
    unoptimized: true,
  },
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
