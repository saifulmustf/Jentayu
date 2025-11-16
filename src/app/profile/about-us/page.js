/* Path: src/app/profile/about-us/page.js */
/* PERBAIKAN FINAL: Menghapus typo '</D>' dan '</d'iv>' */
/* Ditambahkan: AOS Animation + Centered text pada kotak Visi & Misi */

import { Target } from 'lucide-react';
import Image from 'next/image';
import AosInitializer from '@/components/AosInitializer';

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Inisialisasi AOS */}
      <AosInitializer />

      {/* Header Halaman dengan animasi */}
      <section 
        className="py-48 px-8 text-center text-white bg-cover bg-center" 
        style={{ backgroundImage: "url('/about-hero.png')" }} 
      >
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
          ABOUT JENTAYU
        </h1>
        <p 
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          A closer look at the pride of Diponegoro University's UAV research team
        </p>
      </section>

      {/* Konten Utama */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* Sejarah Kami dengan animasi */}
          <div className="mb-20">
            <h2 
              className="text-6xl font-extrabold text-gray-800 mb-6 text-center"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              Our History
            </h2>
            <div 
              className="text-lg text-gray-700 leading-relaxed text-justify space-y-6"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <p>
                Jentayu Team was founded in 2017 by students of Diponegoro University. Initially, this team started as an Aeromodelling Club at Department of Mechanical Engineering but has since evolved into the university's leading autonomous Unmanned Aerial Vehicle (UAV) team. The Jentayu Team is located at Diponegoro University, Semarang, Central Java, Indonesia. This team was formed with a focus on innovation and breakthroughs in aeromodelling things by developing efficiently designed UAV. Operating in the appropiate rules of competition is the community's goal.
              </p>
            </div>
          </div>

          {/* Visi & Misi dengan animasi */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              
              {/* Kolom Kiri: Logo dengan animasi */}
              <div 
                className="md:col-span-1 flex flex-col items-center"
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay="200"
              >
                <div className="relative w-64 h-64">
                  <Image 
                    src="/jentayu-logo.png" 
                    alt="Logo Emblem Jentayu"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 
                  className="text-3xl font-extrabold text-gray-800 mt-4">Jentayu UNDIP
                </h3>
              </div>

              {/* Kolom Kanan: Visi & Misi */}
              <div className="md:col-span-2 flex flex-col gap-8">
                {/* Kartu Visi - TEXT CENTERED */}
                <div 
                  className="p-8 rounded-lg shadow-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: '#000D81', color: 'white' }}
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="300"
                >
                  <h3 className="text-3xl font-extrabold mb-4 text-center">Visi</h3>
                  <p className="text-lg text-gray-200 text-justify text-center">
                    Jentayu UNDIP 2025 as a close, collaborative, and outstanding organization that serves as a platform for research and innovation development in the field of UAVs
                  </p>
                </div>
                
                {/* Kartu Misi - TEXT CENTERED */}
                <div 
                  className="p-8 rounded-lg shadow-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: '#000D81', color: 'white' }}
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="450"
                >
                  <h3 className="text-3xl font-extrabold mb-4 text-center">Misi</h3>
                  <ul className="list-decimal list-outside text-justify text-gray-200 ml-6 space-y-3 text-lg  max-w-2xl">
                    <li>To foster an internal spirit of pride, professionalism, and solidarity among all members of Jentayu UNDIP.</li>
                    <li>To enhance the capacity and competence of members through training, mentoring, and research activities that are adaptive to UAV technological advancements.</li>
                    <li>To establish collaborative networks with internal and external partners to strengthen the UAV research ecosystem within Jentayu UNDIP.</li>
                    <li>To implement a structured and sustainable research system aimed at producing scientific works, innovations, and UAV products that are applicable and competitive.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Filosofi Logo dengan animasi */}
          <section className="pt-20 border-t">
            <h2 
              className="text-6xl font-extrabold text-gray-800 mb-12 text-center"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              Logo Philosophy
            </h2>
            
            {/* Logo Tengah dengan animasi */}
            <div 
              className="flex justify-center mb-12"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <div className="relative w-52 h-52 p-4 border-4 border-[#000D81] rounded-full">
                <Image
                  src="/jentayu-logo.png" 
                  alt="Logo Emblem Jentayu"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Grid 3 Kolom dengan animasi bertahap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Card Filosofi 1 */}
              <div 
                className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center" 
                style={{ backgroundColor: '#000D81', color: 'white' }}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <h3 className="text-2xl font-bold mb-3 text-center">Airplane Silhouette</h3>
                <p className="text-gray-200 text-justify text-center">
                  Represents our focus on the development of aerospace-based technology.
                </p>
              </div>
              
              {/* Card Filosofi 2 */}
              <div 
                className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center" 
                style={{ backgroundColor: '#000D81', color: 'white' }}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="250"
              >
                <h3 className="text-2xl font-bold mb-3 text-center">Airplane Wings</h3>
                <p className="text-gray-200 text-justify text-center">
                  The airplane wings, which look like an interconnected framework and feature the word "Jentayu," represent success achieved through the spirit of unity among the Jentayu team.
                </p>
              </div>
              
              {/* Card Filosofi 3 */}
              <div 
                className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center" 
                style={{ backgroundColor: '#000D81', color: 'white' }}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="400"
              >
                <h3 className="text-2xl font-bold mb-3 text-center">Airplane's Flight Direction</h3>
                <p className="text-gray-200 text-justify text-center">
                  The airplane's upward flight direction represents the team's aspirations and focus to always aim for the better with high achievements.
                </p>
              </div>
            </div>

            {/* Grid 2 Kolom (Centered) dengan animasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 mx-auto">
              {/* Card Filosofi 4 */}
              <div 
                className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center" 
                style={{ backgroundColor: '#000D81', color: 'white' }}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <h3 className="text-2xl font-bold mb-3 text-center">The Color Blue</h3>
                <p className="text-gray-200 text-justify text-center">
                  The color blue represents the valor and splendor of Jentayu while in the sky.
                </p>
              </div>
              
              {/* Card Filosofi 5 */}
              <div 
                className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center" 
                style={{ backgroundColor: '#000D81', color: 'white' }}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="250"
              >
                <h3 className="text-2xl font-bold mb-3 text-center">The Circle</h3>
                <p className="text-gray-200 text-justify text-center">
                 The circle represents the singular resolve and unity of heart of the Jentayu team to achieve its aspirations.
                </p>
              </div>
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}