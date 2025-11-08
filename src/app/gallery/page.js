/* Path: src/app/gallery/page.js */
/* Perbaikan: Memisahkan Server Component dan Client Component */

// [MODIFIKASI]: Import komponen baru
import GalleryGrid from '@/components/gallery/GalleryGrid'; 
import { AlertTriangle } from 'lucide-react';

// Fungsi ini akan mengambil data galeri di server
async function getGalleryItems() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/gallery`, {
      cache: 'no-store', 
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data galeri');
    }

    const data = await res.json();
    return { items: data.data || [], error: null };
  } catch (error) {
    console.error("FETCH ERROR (Gallery Page):", error);
    return { items: [], error: error.message };
  }
}

// Komponen Halaman (Server Component)
export default async function GalleryPage() {
  const { items, error } = await getGalleryItems();

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* 1. HERO SECTION (Sesuai GALLERY.jpg) */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        // Pastikan Anda menaruh gambar 'GALLERY.jpg' Anda di 'public/images/gallery-hero.jpg'
        style={{ backgroundImage: "url('/gallery-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay gelap */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">GALLERY</h1>
        </div>
      </section>

      {/* 2. GRID FOTO (Masonry Layout) */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          
          {/* [DIHAPUS]: Blok <style jsx> sudah dipindah ke GalleryGrid.js */}
          
          {/* Tampilkan pesan jika error */}
          {error && (
            <div className="flex items-center justify-center bg-red-100 text-red-700 p-6 rounded-lg mb-12 max-w-lg mx-auto">
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Gagal Memuat Galeri</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada item */}
          {!error && items.length === 0 && (
            <p className="text-center text-gray-500 text-xl">Belum ada foto di galeri.</p>
          )}

          {/* [MODIFIKASI]: Memanggil Client Component <GalleryGrid> */}
          {/* Kita kirim 'items' sebagai prop */}
          {!error && items.length > 0 && (
            <GalleryGrid items={items} />
          )}
          
        </div>
      </section>
    </div>
  );
}