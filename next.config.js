/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["github.com"],
  },
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
