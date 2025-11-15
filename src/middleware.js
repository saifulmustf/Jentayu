/* Path: src/middleware.js */
/* PERBAIKAN FINAL: Memutus rantai impor 'authOptions' */

import { withAuth } from "next-auth/middleware";

// JANGAN import authOptions dari "./lib/auth"
// karena itu akan menarik 'mongoose' ke Edge Runtime dan menyebabkan crash

export default withAuth(
  // Kita konfigurasikan withAuth secara manual di sini
  // agar dia tidak perlu mengimpor authOptions
  {
    // 1. Tentukan halaman mana yang dilindungi
    callbacks: {
      authorized: ({ token }) => {
        // !!token mengubah token (atau null) menjadi boolean
        // Jika ada token, 'authorized' akan true
        return !!token;
      },
    },
    
    // 2. Beri tahu 'Satpam' di mana Pintu Masuknya
    // Ini adalah bagian yang memperbaiki crash 'nextUrl' Anda
    pages: {
      signIn: '/login', // Redirect ke /login jika tidak authorized
    },

    // 3. 'Satpam' tetap butuh kunci rahasia yang sama
    secret: process.env.NEXTAUTH_SECRET,
  }
);

// Config ini memberi tahu file mana yang DILINDUNGI
export const config = {
  matcher: [
    /*
     * Lindungi semua rute yang dimulai dengan /admin:
     */
    "/admin",       // <-- Ini untuk /admin (Dashboard)
    "/admin/:path*"   // <-- Ini untuk /admin/manage-gallery, /admin/edit/..., dll.
  ],
};