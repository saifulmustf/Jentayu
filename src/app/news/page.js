/* Path: src/app/news/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */

import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import dbConnect from '@/lib/dbConnect'; // <-- [PERBAIKAN 1]
import NewsItem from '@/models/NewsItem'; // <-- [PERBAIKAN 2]

// [PERBAIKAN 3]: Fungsi getNews sekarang memanggil DB langsung
async function getNews() {
  try {
    await dbConnect(); // Koneksi langsung

    const items = await NewsItem.find({}).sort({ createdAt: -1 });
    const plainItems = JSON.parse(JSON.stringify(items));
    
    return { items: plainItems, error: null };
  } catch (error) {
    console.error("FETCH ERROR (News Page):", error);
    // Error ini sekarang akan langsung menunjukkan masalah MONGODB_URI
    return { items: [], error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Halaman (Server Component)
export default async function NewsPage() {
  const { items: newsItems, error } = await getNews();

  return (
    // JSX Anda di bawah ini tidak diubah
    <div className="min-h-screen bg-gray-100">
      
      {/* 1. HERO SECTION (BARU) */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/news-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">NEWS & UPDATES</h1>
        </div>
      </section>

      {/* 2. KONTEN BERITA (GRID) */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          
          {/* Tampilkan pesan jika error */}
          {error && (
            <div className="flex items-center justify-center bg-red-100 text-red-700 p-6 rounded-lg mb-12 max-w-lg mx-auto">
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Gagal Memuat Berita</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada berita */}
          {!error && newsItems.length === 0 && (
            <p className="text-center text-gray-500 text-xl">Belum ada berita untuk ditampilkan.</p>
          )}

          {/* Grid diubah menjadi 2 kolom (md:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            
            {newsItems.map((item) => (
              <Link 
                href={`/news/${item._id}`} 
                key={item._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
              >
                {/* Gambar (tetap rasio 16:9) */}
                <div className="relative w-full aspect-video bg-gray-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                {/* Konten Teks */}
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  "&gt;
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2" title={item.title}>
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content}
                  </p>
                  <span className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Baca Selengkapnya &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}