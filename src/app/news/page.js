/* Path: src/app/news/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */
/* Ditambahkan: AOS Animation - setiap 2 card muncul bersamaan */

import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import AosInitializer from '@/components/AosInitializer';
import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';

// Fungsi getNews sekarang memanggil DB langsung
async function getNews() {
  try {
    await dbConnect();
    const items = await NewsItem.find({}).sort({ createdAt: -1 });
    const plainItems = JSON.parse(JSON.stringify(items));
    return { items: plainItems, error: null };
  } catch (error) {
    console.error("FETCH ERROR (News Page):", error);
    return { items: [], error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Halaman (Server Component)
export default async function NewsPage() {
  const { items: newsItems, error } = await getNews();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Inisialisasi AOS */}
      <AosInitializer />
      
      {/* 1. HERO SECTION dengan animasi */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/news-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 
            className="text-5xl md:text-6xl font-extrabold mb-4"
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="200"
          style={{
              fontSize: "4rem",
              fontWeight: "900",
              fontStyle: "italic",
              marginBottom: "0.2rem",
              color: "#FFFFFF",
          }}
          >
            NEWS & UPDATES
          </h1>
        </div>
      </section>

      {/* 2. KONTEN BERITA (GRID) */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          
          {/* Tampilkan pesan jika error */}
          {error && (
            <div 
              className="flex items-center justify-center bg-red-100 text-red-700 p-6 rounded-lg mb-12 max-w-lg mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Gagal Memuat Berita</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada berita */}
          {!error && newsItems.length === 0 && (
            <p 
              className="text-center text-gray-500 text-xl"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              Belum ada berita untuk ditampilkan.
            </p>
          )}

          {/* Grid 2 kolom dengan animasi setiap 2 card bersamaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            
            {newsItems.map((item, index) => {
              // Hitung delay: setiap 2 card (index 0-1, 2-3, 4-5, dst) punya delay yang sama
              const pairIndex = Math.floor(index / 2);
              const delay = pairIndex * 150;
              
              return (
                <Link 
                  href={`/news/${item._id}`} 
                  key={item._id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={delay}
                >
                  {/* Gambar (tetap rasio 16:9) */}
                  <div className="relative w-full aspect-video bg-gray-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
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
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}