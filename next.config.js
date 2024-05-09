/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "vercel.app",
      "vercel-storage.com",
    ],
  },
}

module.exports = nextConfig
