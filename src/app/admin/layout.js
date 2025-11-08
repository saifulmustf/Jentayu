/* Path: src/app/admin/layout.js */
/* Perbaikan: Menambahkan 'pl-64' untuk mendorong konten */

import Sidebar from '@/components/admin/Sidebar';
import { Suspense } from 'react';

export default function AdminLayout({ children }) {
  return (
    // 'bg-gray-50' bisa ditambahkan di sini untuk
    // memberi warna latar default pada semua halaman admin
    <div className="min-h-screen bg-gray-50"> 
      <Sidebar />
      {/* INI PERBAIKANNYA: 
        'pl-64' (padding-left: 16rem) 
        mendorong 'main' ke kanan, 
        sesuai lebar 'Sidebar' (w-64)
      */}
      <main className="pl-64"> 
        <div className="p-8"> {/* Kita beri padding di dalam main */}
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}