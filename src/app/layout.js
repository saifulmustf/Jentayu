/* Path: src/app/layout.js */
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';

// Import komponen UI utama
import Header from '@/components/home/Header'; // Asumsi nama file Header Anda
import Footer from '@/components/common/Footer'; // <-- Import Footer BARU

const inter = Inter({ subsets: ['latin'] });

// (Metadata statis bisa ditambahkan lagi jika perlu)
// export const metadata = {
//   title: 'Jentayu Team Undip',
//   description: 'UAV Research Team Diponegoro University',
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;

  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* Header hanya tampil jika BUKAN halaman admin */}
        {!isAdminPage && <Header />}
        
        {/* Ini adalah tempat halaman (page.js) Anda akan dimuat */}
        <main>
          {children}
        </main>
        
        {/* Footer hanya tampil jika BUKAN halaman admin */}
        {!isAdminPage && <Footer />}
        
      </body>
    </html>
  );
}