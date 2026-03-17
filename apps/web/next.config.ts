/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://139.59.78.34:5000/api/:path*",
      },
    ]
  },
}

module.exports = nextConfig