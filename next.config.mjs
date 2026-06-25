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
  async rewrites() {
    return [
      {
        source: "/completar-perfil",
        destination: "/complete-profile",
      },
      {
        source: "/profesores",
        destination: "/teachers",
      },
      {
        source: "/profesores/:id",
        destination: "/teachers/:id",
      },
      {
        source: "/reenviar-verificacion",
        destination: "/resend-verification",
      },
      {
        source: "/registro",
        destination: "/register",
      },
      {
        source: "/verificar-email",
        destination: "/verify-email",
      },
    ];
  },
};

export default nextConfig;
