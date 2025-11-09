/* Path: src/app/achievement/page.js */
/* Perbaikan Definitif: 
  - Menghapus 'fetch' ke API sendiri.
  - Mengimpor dbConnect dan Model Mongoose secara langsung.
*/

import Image from 'next/image';
import { AlertTriangle, Trophy } from 'lucide-react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import dbConnect from '@/lib/dbConnect'; // <-- [PERBAIKAN 1] Impor dbConnect
import AchievementItem from '@/models/AchievementItem'; // <-- [PERBAIKAN 2] Impor Model

// [PERBAIKAN 3]: Fungsi getAchievements sekarang memanggil DB langsung
async function getAchievements() {
  try {
    await dbConnect(); // Langsung konek ke DB

    // Langsung query ke database, sama seperti di API
    const items = await AchievementItem.find({}).sort({ year: -1, createdAt: -1 });

    // Mengubah data Mongoose (yang kompleks) menjadi object JSON sederhana
    const plainItems = JSON.parse(JSON.stringify(items)); 
    
    // Logika pengelompokan tahun (tidak diubah)
    const groupedByYear = plainItems.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {}); 

    return { groupedAchievements: groupedByYear, error: null };
  } catch (error) {
    console.error("FETCH ERROR (Achievement Page):", error.message);
    // Jika ini gagal, kemungkinan besar MONGODB_URI di Vercel salah
    return { groupedAchievements: {}, error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Halaman (Server Component)
export default async function AchievementPage() {
  const { groupedAchievements, error } = await getAchievements();
  const years = Object.keys(groupedAchievements).sort((a, b) => b - a); // Urutkan tahun dari terbaru ke terlama

  return (
    /* =============================================
       STRUKTUR FRONTEND (JSX) ANDA DI BAWAH INI
       TIDAK SAYA UBAH SAMA SEKALI
       =============================================
    */
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION (Banner) */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/achievement-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">OUR ACHIEVEMENTS</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Perjalanan dan pencapaian kami dari tahun ke tahun.
          </p>
        </div>
      </section>

      {/* 2. KONTEN TIMELINE */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">

          {/* Tampilkan pesan jika error */}
          {error && (
            <div className="flex items-center justify-center bg-red-100 text-red-700 p-6 rounded-lg mb-12 max-w-lg mx-auto">
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Gagal Memuat Data</h3>
                {/* Error 'Unauthorized' akan muncul di sini jika MONGODB_URI salah */}
                <p className="text-sm font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada data */}
          {!error && years.length === 0 && (
            <p className="text-center text-gray-500 text-xl">Belum ada data pencapaian untuk ditampilkan.</p>
          )}

          {/* --- [LAYOUT TIMELINE BARU] --- */}
          <div className="relative">
            {/* Garis Vertikal (hanya terlihat di layar md ke atas) */}
            <div 
              className="hidden md:block absolute left-9 top-0 bottom-0 w-1 bg-blue-100 rounded-full" 
              style={{ transform: 'translateX(-50%)' }}
            ></div>

            {years.map((year) => (
              <div key={year} className="mb-16">
                {/* Judul Tahun */}
                <div className="flex items-center mb-8">
                  <span 
                    className="z-10 flex-shrink-0 w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    style={{ backgroundColor: '#000D81' }} // <-- WARNA BARU: Angka Tahun
                  >
                    {year}
                  </span>
                  <div 
                    className="hidden md:block w-full h-0.5 ml-4"
                    style={{ backgroundColor: '#000D81' }} // <-- WARNA BARU: Garis Horizontal
                  ></div>
                </div>
                
                {/* Kartu Achievement untuk tahun ini */}
                <div className="space-y-12 pl-0 md:pl-24">
                  {groupedAchievements[year].map((item) => (
                    <div 
                      key={item._id} 
                      className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100"
                    >
                      {/* Gambar */}
                      <div className="w-full md:w-5/12 flex-shrink-0">
                        <div className="relative aspect-video md:aspect-auto md:h-full w-full bg-gray-200">
                          <ImageWithFallback
                            src={item.imageUrl}
                            fallbackSrc={'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Foto'}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      {/* Info Teks */}
                      <div className="p-6 md:p-8 w-full">
                        <div className="flex items-center mb-2">
                          <Trophy className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
                          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* --- [AKHIR TIMELINE] --- */}

        </div>
      </section>
    </div>
  );
}