/* Path: src/app/achievement/page.js */
/* Perbaikan Definitif: 
  - Menghapus 'fetch' ke API sendiri.
  - Mengimpor dbConnect dan Model Mongoose secara langsung.
  - Ditambahkan: AOS Animation untuk Timeline
*/

import Image from 'next/image';
import { AlertTriangle, Trophy } from 'lucide-react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import AosInitializer from '@/components/AosInitializer'; // Import AOS Initializer
import dbConnect from '@/lib/dbConnect';
import AchievementItem from '@/models/AchievementItem';

// Fungsi getAchievements sekarang memanggil DB langsung
async function getAchievements() {
  try {
    await dbConnect();
    const items = await AchievementItem.find({}).sort({ year: -1, createdAt: -1 });
    const plainItems = JSON.parse(JSON.stringify(items)); 
    
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
    return { groupedAchievements: {}, error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Halaman (Server Component)
export default async function AchievementPage() {
  const { groupedAchievements, error } = await getAchievements();
  const years = Object.keys(groupedAchievements).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-white">
      {/* Inisialisasi AOS */}
      <AosInitializer />
      
      {/* 1. HERO SECTION dengan animasi */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/achievement-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 
            className="text-5xl md:text-6xl font-extrabold mb-4"
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            OUR ACHIEVEMENTS
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Perjalanan dan pencapaian kami dari tahun ke tahun.
          </p>
        </div>
      </section>

      {/* 2. KONTEN TIMELINE dengan animasi */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">

          {/* Tampilkan pesan jika error */}
          {error && (
            <div 
              className="flex items-center justify-center bg-red-100 text-red-700 p-6 rounded-lg mb-12 max-w-lg mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <AlertTriangle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Gagal Memuat Data</h3>
                <p className="text-sm font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* Tampilkan pesan jika tidak ada data */}
          {!error && years.length === 0 && (
            <p 
              className="text-center text-gray-500 text-xl"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              Belum ada data pencapaian untuk ditampilkan.
            </p>
          )}

          {/* TIMELINE dengan animasi */}
          <div className="relative">
            {/* Garis Vertikal */}
            <div 
              className="hidden md:block absolute left-9 top-0 bottom-0 w-1 bg-blue-100 rounded-full" 
              style={{ transform: 'translateX(-50%)' }}
            ></div>

            {years.map((year, yearIndex) => (
              <div key={year} className="mb-16">
                {/* Judul Tahun dengan animasi fade-right */}
                <div 
                  className="flex items-center mb-8"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  data-aos-delay={yearIndex * 100}
                >
                  <span 
                    className="z-10 flex-shrink-0 w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    style={{ backgroundColor: '#000D81' }}
                  >
                    {year}
                  </span>
                  <div 
                    className="hidden md:block w-full h-0.5 ml-4"
                    style={{ backgroundColor: '#000D81' }}
                  ></div>
                </div>
                
                {/* Kartu Achievement dengan animasi fade-left bertahap */}
                <div className="space-y-12 pl-0 md:pl-24">
                  {groupedAchievements[year].map((item, itemIndex) => (
                    <div 
                      key={item._id} 
                      className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100"
                      data-aos="fade-left"
                      data-aos-duration="800"
                      data-aos-delay={(yearIndex * 100) + (itemIndex * 150)}
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

        </div>
      </section>
    </div>
  );
}