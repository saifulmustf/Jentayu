/* Path: src/app/news/[id]/page.js */
/* Ini adalah Halaman Publik untuk menampilkan SATU berita */

import Image from 'next/image';

// Fungsi ini akan mengambil data SATU berita di server
async function getNewsDetail(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    // Panggil API route yang baru kita buat
    const res = await fetch(`${baseUrl}/api/news/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null; // Akan menampilkan "not found"
    }

    const data = await res.json();
    return data.data; // Kembalikan objek 'data'
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Komponen Halaman (Server Component)
// 'params' akan berisi { id: '12345' } dari URL
//
// --- PERBAIKAN DI BAWAH INI ---
// 1. Kita ganti nama 'params' menjadi 'paramsPromise' saat destructuring
export default async function NewsDetailPage({ params: paramsPromise }) {
  
  // 2. Kita 'await' promise tersebut untuk mendapatkan object params yang sesungguhnya
  const params = await paramsPromise;

  // 3. Sekarang kita bisa menggunakan params.id dengan aman
  const item = await getNewsDetail(params.id);
  // --- AKHIR PERBAIKAN ---

  // Jika item tidak ditemukan, tampilkan pesan
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Berita tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Judul Berita */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {item.title}
        </h1>
        
        {/* Tanggal Publish */}
        <p className="text-lg text-gray-500 mb-6">
          Dipublikasikan pada {new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        
        {/* Gambar Utama */}
        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
          <Image
            src={item.imageUrl}
            alt={item.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        
        {/* Konten Berita */}
        {/* 'whitespace-pre-wrap' akan menghargai enter (baris baru) dari textarea */}
        <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap">
          {item.content}
        </div>
        
      </div>
    </div>
  );
}