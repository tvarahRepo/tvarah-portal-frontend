/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_URL || 'https://portal.tvarah.com/api/v1'

const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${BACKEND}/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND}/:path*`,
      },
    ]
  },
}

export default nextConfig
