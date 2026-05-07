/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'https://portal.tvarah.com/api/v1/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://portal.tvarah.com/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
