/** @type {import('next').NextConfig} */
const buildId = `${Date.now().toString(36)}`;

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_PAGEFIND_BUILD_ID: buildId,
  },
}

module.exports = nextConfig
