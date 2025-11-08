/* Path: next.config.mjs */
/* Modifikasi: Menambahkan 'placehold.co' ke remotePatterns */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Anda bisa biarkan pathname '/**' agar semua gambar
        // dari cloud Anda bisa di-load.
        pathname: '/**',
      },
      // --- TAMBAHKAN BLOK INI ---
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // --------------------------
    ],
  },
};

export default nextConfig;