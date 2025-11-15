/* Path: src/app/admin/page.js */
/* Kode Anda (Selamat Datang) + Tombol Logout */

'use client'; // <-- 1. WAJIB ditambahkan untuk fungsi signOut

import { signOut } from 'next-auth/react'; // <-- 2. Import signOut

export default function AdminDashboardPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg m-8"> {/* Tambah margin 'm-8' */}
      
      {/* 3. Buat wrapper flex untuk judul dan tombol */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang di Admin Panel
        </h1>
        {/* 4. Tombol Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600">
        Silakan gunakan menu di sebelah kiri untuk mengelola konten website Anda.
      </p>

      {/* (Kita bisa tambahkan kartu-kartu link di sini nanti) */}
    </div>
  );
}