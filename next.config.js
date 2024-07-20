/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['rehype-mermaid'],
  },
  output: 'export',
  trailingSlash: true,
};

module.exports = nextConfig;
