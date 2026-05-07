/** @type {import('next').NextConfig} */
const nextConfig = {
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
