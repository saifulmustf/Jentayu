/* Path: src/app/admin/page.js */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  GalleryVerticalEnd, 
  PlusSquare, 
  Newspaper, 
  Trophy, 
  Handshake, 
  Users,
  Plane,
  Loader2,
  LogOut
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Inisialisasi state dengan nilai 0
  const [stats, setStats] = useState({
    gallery: 0,
    news: 0,
    achievement: 0,
    sponsor: 0,
    subTeam: 0,
    board: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data statistik saat halaman dimuat
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const json = await res.json();
        
        if (json.success) {
          setStats(json.data);
        } else {
          // Jika gagal, biarkan stats default (0) tapi catat error
          console.error("Gagal memuat data statistik:", json.error);
        }
      } catch (error) {
        console.error("Kesalahan koneksi:", error);
        setError("Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Komponen Kartu Statistik
  const StatCard = ({ title, count, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-full ${colorClass} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            count
          )}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header & Logout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Selamat datang di panel kontrol Jentayu.</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Tampilkan Error jika koneksi bermasalah */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            Catatan: {error} (Data mungkin tidak tampil lengkap)
          </div>
        )}

        {/* Bagian 1: Statistik Ringkas */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Statistik Konten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Galeri" 
            count={stats.gallery} 
            icon={GalleryVerticalEnd} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            title="Total Berita" 
            count={stats.news} 
            icon={Newspaper} 
            colorClass="bg-green-500" 
          />
          <StatCard 
            title="Total Achievement" 
            count={stats.achievement} 
            icon={Trophy} 
            colorClass="bg-yellow-500" 
          />
          <StatCard 
            title="Total Sponsor" 
            count={stats.sponsor} 
            icon={Handshake} 
            colorClass="bg-purple-500" 
          />
          <StatCard 
            title="Sub Team" 
            count={stats.subTeam} 
            icon={Plane} 
            colorClass="bg-indigo-500" 
          />
          <StatCard 
            title="Direksi (Board)" 
            count={stats.board} 
            icon={Users} 
            colorClass="bg-pink-500" 
          />
        </div>

        {/* Bagian 2: Menu Navigasi Cepat */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Kelola</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Kartu: Kelola Galeri */}
          <Link 
            href="/admin/manage-gallery" 
            className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GalleryVerticalEnd size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Kelola Galeri</h3>
            </div>
            <p className="text-gray-500 text-sm pl-[3.25rem]">Lihat, edit, atau hapus foto galeri.</p>
          </Link>

          {/* Kartu: Tambah Galeri */}
          <Link 
            href="/admin/add-gallery" 
            className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                <PlusSquare size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Tambah Galeri</h3>
            </div>
            <p className="text-gray-500 text-sm pl-[3.25rem]">Upload foto baru ke website.</p>
          </Link>

          {/* Kartu Placeholder (Bisa diaktifkan jika halaman sudah ada) */}
          <Link 
            href="/admin/manage-news" 
            className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Newspaper size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Kelola Berita</h3>
            </div>
            <p className="text-gray-500 text-sm pl-[3.25rem]">Update berita terbaru tim.</p>
          </Link>

        </div>
      </div>
    </div>
  );
}