/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 828, 1200],
    imageSizes: [48, 112, 160, 256],
  },
};

export default nextConfig;
