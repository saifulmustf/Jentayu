/* Path: src/app/layout.js */
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';

// --- [TAMBAHAN] Import SessionProvider ---
import { SessionProvider } from 'next-auth/react';

// Import komponen UI utama Anda (Ini kode Anda)
import Header from '@/components/home/Header';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

/* Catatan: 'export const metadata' tidak berfungsi di file 'use client'.
  Anda harus memindahkannya ke 'page.js' individual jika diperlukan.
  Kita hapus komentar metadata di sini agar bersih.
*/

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;

  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* --- [TAMBAHAN] SessionProvider membungkus semuanya --- */}
        <SessionProvider>
          
          {/* Ini kode Anda, tidak saya ubah */}
          {!isAdminPage && <Header />}
          
          <main>
            {children}
          </main>
          
          {/* Ini kode Anda, tidak saya ubah */}
          {!isAdminPage && <Footer />}
        
        {/* --- [TAMBAHAN] Penutup SessionProvider --- */}
        </SessionProvider>
        
      </body>
    </html>
  );
}