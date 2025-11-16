/* Path: src/app/news/[id]/page.js */
/* KOREKSI FINAL: Mengambil data langsung dari DB, bukan via API fetch */

import Image from 'next/image';
import AosInitializer from '@/components/AosInitializer';
import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';

// Fungsi ini akan mengambil data SATU berita di server, LANGSUNG DARI DB
async function getNewsDetail(id) {
  try {
    await dbConnect();
    const item = await NewsItem.findById(id);

    if (!item) {
      return null;
    }

    // Konversi Mongoose doc ke object JSON sederhana
    // Ini penting agar data aman di-render oleh Server Component
    const plainItem = JSON.parse(JSON.stringify(item));
    return plainItem;

  } catch (error) {
    console.error("DB ERROR (News Detail Page):", error);
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

  // Tampilan halaman detail berita
  return (
    <div className="min-h-screen bg-white py-12">
      <AosInitializer />
      
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Judul Berita */}
        <h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          data-aos="fade-down"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          {item.title}
        </h1>
        
        {/* Tanggal Publikasi */}
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
        
        {/* Gambar Berita */}
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
        
        {/* Konten Berita */}
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