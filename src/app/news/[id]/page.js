/* Path: src/app/news/[id]/page.js */
/* Ini adalah Halaman Publik untuk menampilkan SATU berita */
/* Ditambahkan: AOS Animation */

import Image from 'next/image';
import AosInitializer from '@/components/AosInitializer';

// Fungsi ini akan mengambil data SATU berita di server
async function getNewsDetail(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Komponen Halaman (Server Component)
export default async function NewsDetailPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const item = await getNewsDetail(params.id);

  // Jika item tidak ditemukan
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AosInitializer />
        <p 
          className="text-xl text-gray-500"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          Berita tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      {/* Inisialisasi AOS */}
      <AosInitializer />
      
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Judul Berita dengan animasi */}
        <h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          data-aos="fade-down"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          {item.title}
        </h1>
        
        {/* Tanggal Publish dengan animasi */}
        <p 
          className="text-lg text-gray-500 mb-6"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="200"
        >
          Dipublikasikan pada {new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        
        {/* Gambar Utama dengan animasi zoom-in */}
        <div 
          className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        
        {/* Konten Berita dengan animasi */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="400"
        >
          {item.content}
        </div>
        
      </div>
    </div>
  );
}