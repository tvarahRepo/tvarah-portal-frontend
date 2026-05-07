/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portal.tvarah.com/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
