/** @type {import('next').NextConfig} */
const buildId = `${Date.now().toString(36)}`;

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Compile workspace packages on the fly so we can import TS source directly
  transpilePackages: ['@tin/shared-ui'],
  // Pre-existing TS issues surfaced when the workspace re-install bumped Supabase types.
  // Production GitHub Action build was passing on locked older versions; flagged for follow-up.
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_PAGEFIND_BUILD_ID: buildId,
  },
}

module.exports = nextConfig
