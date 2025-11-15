/* Path: src/app/layout.js */
'use client';

import { Inter } from 'next/font/google'; // Anda bisa ganti ini kembali ke Montserrat jika mau
import './globals.css';
import { usePathname } from 'next/navigation';

import { SessionProvider } from 'next-auth/react';

import Header from '@/components/home/Header';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // --- [PERBAIKAN DIMULAI DI SINI] ---
  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;
  const isLoginPage = pathname === '/login'; // <-- 1. Tambahkan cek halaman login
  
  // Tampilkan Header/Footer HANYA jika bukan admin DAN bukan login
  const showHeaderFooter = !isAdminPage && !isLoginPage; 
  // --- [PERBAIKAN SELESAI] ---

  return (
    <html lang="en">
      <body className={inter.className}>
        
        <SessionProvider>
          
          {/* Gunakan variabel 'showHeaderFooter' yang baru */}
          {showHeaderFooter && <Header />}
          
          <main>
            {children}
          </main>
          
          {/* Gunakan variabel 'showHeaderFooter' yang baru */}
          {showHeaderFooter && <Footer />}
        
        </SessionProvider>
        
      </body>
    </html>
  );
}