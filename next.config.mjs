/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Redirect non-www to www (permanent 301 for SEO)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'swinglify.online' }],
        destination: 'https://www.swinglify.online/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
