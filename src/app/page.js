/* Path: src/app/page.js */
/* Perbaikan: Memindahkan 'fetch' dari komponen anak, memanggil DB langsung */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import komponen-komponen statis
import AboutSection from '@/components/home/AboutSection';
import SubTeamSection from '@/components/home/SubTeamSection';
// import SponsorSection from '@/components/home/SponsorSection'; // Dihapus dari statis

// Import komponen-komponen DINAMIS
import LatestNewsSection from '@/components/home/LatestNewsSection';
import GalleryPreviewSection from '@/components/home/GalleryPreviewSection';
import SponsorSection from '@/components/home/SponsorSection'; // Diimpor sebagai dinamis

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
    // 2. Fetch Galeri Terbaru (Limit 3, sesuai kode Anda)
    const galleryItems = await GalleryItem.find({}).sort({ createdAt: -1 }).limit(3);
    // 3. Fetch Sponsor (Penyebab error 'localhost:3000' Anda)
    const sponsorItems = await SponsorItem.find({}).sort({ createdAt: 'asc' });

    // Konversi data Mongoose ke object JSON sederhana
    const latestNews = JSON.parse(JSON.stringify(newsItems));
    const latestGallery = JSON.parse(JSON.stringify(galleryItems));
    const sponsors = JSON.parse(JSON.stringify(sponsorItems));
    
    return { latestNews, latestGallery, sponsors, error: null };
  } catch (e) {
    console.error("Error fetching homepage data:", e.message);
    // Error ini akan muncul jika MONGODB_URI di Vercel salah
    return { latestNews: [], latestGallery: [], sponsors: [], error: `Gagal terhubung ke Database: ${e.message}` };
  }
}

export default async function Home() {
  // [PERBAIKAN 3]: Panggil data di level atas
  const { latestNews, latestGallery, sponsors, error } = await getHomepageData();

  return (
    // Kita gunakan <main> sebagai pembungkus utama
    <main className="bg-white">
      {/* =============================================
        JSX ANDA (TIDAK DIUBAH)
        =============================================
      */}
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
            paddingLeft: "80px", 
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

      <AboutSection />
      <SubTeamSection />

      {/* [PERBAIKAN 4]: Teruskan data sebagai props */}
      <LatestNewsSection initialNews={latestNews} loadError={error} />
      <GalleryPreviewSection initialGallery={latestGallery} loadError={error} />
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