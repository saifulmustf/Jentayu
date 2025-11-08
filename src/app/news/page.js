/* Path: src/app/news/page.js */
/*
  Perbaikan:
  1. Menambahkan Hero Section (Banner) di atas.
  2. Mengubah grid dari 3 kolom menjadi 2 kolom (md:grid-cols-2).
*/

import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react'; // Import ikon untuk error

// Fungsi ini akan mengambil data di server
async function getNews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news`, {
      cache: 'no-store', // Selalu ambil data terbaru
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Gagal mengambil data berita');
    }

    const data = await res.json();
    return { items: data.data || [], error: null }; // Kembalikan object
  } catch (error) {
    console.error("FETCH ERROR (News Page):", error);
    return { items: [], error: error.message }; // Kembalikan object error
  }
}

// Komponen Halaman (Server Component)
export default async function NewsPage() {
  // Panggil fungsi getNews dan tunggu datanya
  const { items: newsItems, error } = await getNews();

  return (
    <div className="min-h-screen bg-gray-100"> {/* Latar belakang abu-abu terang */}
      
      {/* 1. HERO SECTION (BARU) */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        // Ganti gambar ini dengan gambar hero untuk Berita Anda
        style={{ backgroundImage: "url('/news-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay gelap */}
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

          {/* [PERBAIKAN]: Grid diubah menjadi 2 kolom (md:grid-cols-2) */}
          {/* 'max-w-5xl' digunakan agar grid 2 kolom tidak terlalu lebar di layar besar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            
            {newsItems.map((item) => (
              <Link 
                href={`/news/${item._id}`} 
                key={item._id} 
                // Kartu berita dengan 'bg-white'
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
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2" title={item.title}>
                    {item.title}
                  </h2>
                  {/* Kita gunakan 'line-clamp' untuk membatasi deskripsi */}
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