/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["github.com"],
  },
  output: "export"
};

module.exports = nextConfig;
