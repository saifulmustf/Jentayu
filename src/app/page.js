/* Path: src/app/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */

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

// [PERBAIKAN 1]: Impor Model dan dbConnect
import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';
import GalleryItem from '@/models/GalleryItem';
import SponsorItem from '@/models/SponsorItem';

// [PERBAIKAN 2]: Fungsi getHomepageData sekarang memanggil DB langsung
async function getHomepageData() {
  try {
    await dbConnect(); // Koneksi ke DB

    // 1. Fetch Berita Terbaru (Limit 3)
    const newsItems = await NewsItem.find({}).sort({ createdAt: -1 }).limit(3);
    // 2. Fetch Galeri Terbaru (Limit 6)
    const galleryItems = await GalleryItem.find({}).sort({ createdAt: -1 }).limit(6);
    // 3. Fetch Sponsor
    const sponsorItems = await SponsorItem.find({}).sort({ createdAt: 'asc' });

    // Konversi data Mongoose ke object JSON sederhana
    const latestNews = JSON.parse(JSON.stringify(newsItems));
    const latestGallery = JSON.parse(JSON.stringify(galleryItems));
    const sponsors = JSON.parse(JSON.stringify(sponsorItems));
    
    return { latestNews, latestGallery, sponsors, error: null };
  } catch (e) {
    console.error("Error fetching homepage data:", e);
    // Error ini akan muncul jika MONGODB_URI di Vercel salah
    return { latestNews: [], latestGallery: [], sponsors: [], error: `Gagal terhubung ke Database: ${e.message}` };
  }
}
// -------------------------------------------------------------------


export default async function Home() {
  const { latestNews, latestGallery, sponsors, error } = await getHomepageData();

  return (
    // Kita gunakan <main> sebagai pembungkus utama
    <main className="bg-white">
      {/* =============================================
        STRUKTUR FRONTEND ANDA (JSX) DI BAWAH INI
        TIDAK SAYA UBAH SAMA SEKALI
        =============================================
      */}

      {/* ===== 1. HERO SECTION (Kode UI Anda) ===== */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Home.png')" }} 
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div
          style={{
            backgroundImage: 'url("/")', // <-- Anda punya '/' di sini, mungkin maksudnya '/bg1.png'?
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
      {/* [PERBAIKAN 3]: Kita teruskan data sebagai props
        Ini akan memperbaiki error di LatestNewsSection juga
      */}
      <LatestNewsSection initialNews={latestNews} loadError={error} />
      
      {/* ===== 5. GALERI PREVIEW (DINAMIS) ===== */}
      <GalleryPreviewSection initialGallery={latestGallery} loadError={error} />

      {/* ===== 6. OUR SPONSORED (DINAMIS) ===== */}
      <SponsorSection initialSponsors={sponsors} loadError={error} />

      {/* Menampilkan error jika fetch gagal di Homepage */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 text-center">
          Error saat memuat data dinamis: {error}
        </div>
      )}
    </main>
  );
}