/* Path: src/app/page.js */
/* Halaman ini MENGGABUNGKAN semua komponen UI Anda */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import komponen-komponen statis
import AboutSection from '@/components/home/AboutSection';
import SubTeamSection from '@/components/home/SubTeamSection';
import SponsorSection from '@/components/home/SponsorSection';

// Import komponen-komponen DINAMIS
import LatestNewsSection from '@/components/home/LatestNewsSection';
import GalleryPreviewSection from '@/components/home/GalleryPreviewSection';

export default async function Home() {
  return (
    // Kita gunakan <main> sebagai pembungkus utama
    <main className="bg-white">
      {/* ===== 1. HERO SECTION (Kode UI Anda) ===== */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Home.png')" }} 
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div
          style={{
            backgroundImage: 'url("/")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "80px", // Hati-hati di mobile
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "900",
              fontStyle: "italic",
              marginBottom: "0.2rem",
              color: "#FFFFFF",
            }}
          >
            JENTAYU TEAM
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              fontStyle: "italic",
              color: "#FFFFFF",
            }}
          >
            UAV RESEARCH TEAM DIPONEGORO UNIVERSITY
          </p>
        </div>
      </section>

      {/* ===== 2. ABOUT US ===== */}
      <AboutSection />

      {/* ===== 3. OUR ROBOT (SUB TEAM) ===== */}
      <SubTeamSection />

      {/* ===== 4. BERITA TERBARU (DINAMIS) ===== */}
      <LatestNewsSection />
      
      {/* ===== 5. GALERI PREVIEW (DINAMIS) ===== */}
      <GalleryPreviewSection />

      {/* ===== 6. OUR SPONSORED (STATIS) ===== */}
      <SponsorSection />

      {/* =============================================
        FOOTER YANG SEBELUMNYA ADA DI SINI, SEKARANG 
        SUDAH DIHAPUS DAN DIPINDAH KE layout.js
        =============================================
      */}
    </main>
  );
}