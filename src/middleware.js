/* Path: src/middleware.js */
/* PERBAIKAN: Mengganti withAuth() dengan middleware kustom */

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

/**
 * Ini adalah "Satpam" kustom Anda.
 * Next.js HANYA akan menjalankan fungsi ini pada path
 * yang didefinisikan di 'config.matcher' di bawah.
 */
export async function middleware(req) {
  // Ambil token (sesi login) dari request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Ambil URL yang sedang diminta
  const { pathname } = req.nextUrl;

  // 1. Jika pengguna TIDAK punya token (belum login)
  if (!token) {
    // Bangun URL halaman login yang lengkap
    const loginUrl = new URL('/login', req.url);
    
    // (Opsional) Tambahkan parameter 'from' agar setelah login bisa kembali
    loginUrl.searchParams.set('from', pathname); 
    
    // Lempar (redirect) pengguna ke halaman login
    return NextResponse.redirect(loginUrl);
  }
  
  // 2. Jika pengguna PUNYA token (sudah login), izinkan dia masuk
  return NextResponse.next();
}

/**
 * Config ini memberi tahu Next.js
 * halaman mana SAJA yang harus dijaga oleh "Satpam" di atas.
 * * "Satpam" TIDAK AKAN berjalan di /_next/image, /login, /gallery, dll.
 * Dia HANYA akan berjalan di /admin dan /admin/...
 */
export const config = {
  matcher: [
    '/admin',       // <-- Jaga halaman Dashboard
    '/admin/:path*',  // <-- Jaga SEMUA halaman di dalam admin
  ],
};