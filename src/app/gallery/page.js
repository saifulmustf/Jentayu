/* Path: src/app/gallery/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */
/* Ditambahkan: AOS Animation */

import GalleryGrid from '@/components/gallery/GalleryGrid'; 
import { AlertTriangle } from 'lucide-react';
import AosInitializer from '@/components/AosInitializer'; // Import AOS
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';

// Fungsi getGalleryItems sekarang memanggil DB langsung
async function getGalleryItems() {
  try {
    await dbConnect();
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    const plainItems = JSON.parse(JSON.stringify(items));
    return { items: plainItems, error: null };
  } catch (error) {
    console.error("FETCH ERROR (Gallery Page):", error);
    return { items: [], error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Halaman (Server Component)
export default async function GalleryPage() {
  const { items, error } = await getGalleryItems();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Inisialisasi AOS */}
      <AosInitializer />
      
      {/* 1. HERO SECTION dengan animasi */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/gallery-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 
            className="text-5xl md:text-6xl font-extrabold mb-4"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            GALLERY
          </h1>
        </div>
      </section>

      {/* 2. GRID FOTO (Masonry Layout) */}
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
                <h3 className="text-xl font-bold">Gagal Memuat Galeri</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada item */}
          {!error && items.length === 0 && (
            <p 
              className="text-center text-gray-500 text-xl"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              Belum ada foto di galeri.
            </p>
          )}

          {/* Memanggil Client Component <GalleryGrid> - animasi ada di dalam komponen */}
          {!error && items.length > 0 && (
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <GalleryGrid items={items} />
            </div>
          )}
          
        </div>
      </section>
    </div>
  );
}