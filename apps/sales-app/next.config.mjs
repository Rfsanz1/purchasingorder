/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@gm/ui', '@gm/utils', '@gm/types'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL ?? 'http://localhost:6000'}/api/:path*`,
      },
    ];
  },
};
export default config;
