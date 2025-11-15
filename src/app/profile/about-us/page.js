/* Path: src/app/profile/about-us/page.js */
/* PERBAIKAN FINAL: Menghapus typo '</D>' dan '</d'iv>' */

import { Target } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman (Tetap Sama) */}
      <section 
        className="py-32 px-8 text-center text-white bg-cover bg-center" 
        style={{ backgroundImage: "url('/about-hero.png')" }} 
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Jentayu</h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          Mengenal lebih dekat tim riset UAV kebanggaan Universitas Diponegoro.
        </p>
      </section>

      {/* Konten Utama */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* [REVISI] Lebar section Sejarah disamakan */}
          <div className="mb-20"> 
          {/* 'max-w-4xl mx-auto' dihapus dari div ini */}

            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Sejarah Kami</h2>
            {/* [REVISI] Konten paragraf diperpanjang */}
            <div className="text-lg text-gray-700 leading-relaxed text-justify space-y-6">
              <p>
                Jentayu Team was founded in 2017 by students of Diponegoro University. Initially, this team started as an Aeromodelling Club at Department of Mechanical Engineering but has since evolved into the university's leading autonomous Unmanned Aerial Vehicle (UAV) team. The Jentayu Team is located at Diponegoro University, Semarang, Central Java, Indonesia. This team was formed with a focus on innovation and breakthroughs in aeromodelling things by developing efficiently designed UAV. Operating in the appropiate rules of competition is the community’s goal.
              </p>
            </div>
          </div>

          {/* --- Visi & Misi Sesuai UI Baru --- */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Visi dan Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              
              {/* Kolom Kiri: Logo */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative w-64 h-64">
                  <Image 
                    src="/jentayu-logo.png" 
                    alt="Logo Emblem Jentayu"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mt-4">Jentayu UNDIP</h3>
              </div>

              {/* Kolom Kanan: Visi & Misi */}
              <div className="md:col-span-2 flex flex-col gap-8">
                {/* Kartu Visi */}
                <div 
                  className="p-8 rounded-lg shadow-lg"
                  style={{ backgroundColor: '#000D81', color: 'white' }}
                >
                  <h3 className="text-3xl font-bold mb-4">Visi</h3>
                  <p className="text-lg text-gray-200 text-justify">
                    Jentayu UNDIP 2025 as a close, collaborative, and outstanding organization that serves as a platform for research and innovation development in the field of UAVs
                  </p>
                </div>
                {/* Kartu Misi */}
                <div 
                  className="p-8 rounded-lg shadow-lg"
                  style={{ backgroundColor: '#000D81', color: 'white' }}
                >
                  <h3 className="text-3xl font-bold mb-4">Misi</h3>
                  <ul className="list-decimal list-outside text-gray-200 ml-4 space-y-3 text-lg text-justify">
                    <li>To foster an internal spirit of pride, professionalism, and solidarity among all members of Jentayu UNDIP.</li>
                    <li>To enhance the capacity and competence of members through training, mentoring, and research activities that are adaptive to UAV technological advancements.</li>
                    <li>To establish collaborative networks with internal and external partners to strengthen the UAV research ecosystem within Jentayu UNDIP.</li>
                    <li>To implement a structured and sustainable research system aimed at producing scientific works, innovations, and UAV products that are applicable and competitive.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* --- AKHIR Visi & Misi --- */}

          {/* --- [SECTION BARU] Filosofi Logo --- */}
          <section className="pt-20 border-t">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Filosofi Logo</h2>
            
            {/* Logo Tengah */}
            <div className="flex justify-center mb-12">
              <div className="relative w-52 h-52 p-4 border-4 border-[#000D81] rounded-full">
                <Image
                  src="/jentayu-logo.png" 
                  alt="Logo Emblem Jentayu"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Grid 3 Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Card Filosofi 1 */}
              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#000D81', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-3 text-center">Siluet Gambar Pesawat</h3>
                <p className="text-gray-200 text-justify">
                  Menggambarkan fokus kita terhadap pengembangan teknologi berbasis kedirgantaraan.
                </p>
              </div>
              {/* Card Filosofi 2 */}
              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#000D81', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-3 text-center">Sayap Pesawat</h3>
                <p className="text-gray-200 text-justify">
                  Sayap pesawat yang terlihat seperti kerangka yang saling menyatu, dan ada tulisan "Jentayu". Menggambarkan keberhasilan dicapai dengan semangat kesatuan antar tim Jentayu.
                </p>
              </div>
              {/* Card Filosofi 3 */}
              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#000D81', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-3 text-center">Arah Terbang Pesawat</h3>
                {/* [PERBAIKAN] Typo '</D>' dihapus */}
                <p className="text-gray-200 text-justify">
                  Arah terbang pesawat yang selalu ke atas yang menggambarkan cita-cita dan fokus tim untuk selalu mengarah ke yang lebih baik dengan prestasi yang tinggi.
                </p>
              </div>
            </div>

            {/* Grid 2 Kolom (Centered) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 mx-auto">
              {/* Card Filosofi 4 */}
              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#000D81', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-3 text-center">Warna Biru</h3>
                {/* [PERBAIKAN] Typo '</d'iv>' dihapus */}
                <p className="text-gray-200 text-justify">
                  Warna biru menggambarkan kegagahan dan kemegahan Jentayu saat berada di langit.
                </p>
              </div>
              {/* Card Filosofi 5 */}
              <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#000D81', color: 'white' }}>
                <h3 className="text-2xl font-bold mb-3 text-center">Lingkaran</h3>
                <p className="text-gray-200 text-justify">
                  Lingkaran menggambarkan kebulatan tekad dan kesatuan hati tim Jentayu untuk mencapai cita-cita.
                </p>
              </div>
            </div>
          </section>
          {/* --- AKHIR SECTION Filosofi Logo --- */}

        </div>
      </section>
    </div>
  );
}