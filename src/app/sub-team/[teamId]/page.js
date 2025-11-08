/* Path: src/app/sub-team/[teamId]/page.js */
/* Perbaikan: Mengubah layout Deskripsi & Anggota Tim (menjadi vertikal) */

import ImageWithFallback from '@/components/common/ImageWithFallback';
import { notFound } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

// Fungsi untuk mengambil data 1 tim (termasuk anggota)
async function getTeamDetail(teamId) {
  if (!teamId) {
    return { team: null, error: "Team ID tidak valid atau 'undefined'." };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Panggil API /api/sub-teams (plural) yang berisi data $lookup
    const res = await fetch(`${baseUrl}/api/sub-teams`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Gagal mengambil data dari server: ${res.statusText}`);
    }
    
    const data = await res.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'API mengembalikan data yang tidak valid');
    }

    // Cari tim yang spesifik dari array hasil
    const team = data.data.find(t => t.teamId === teamId);
    
    if (!team) {
      return { team: null, error: `Tim dengan ID '${teamId}' tidak ditemukan di database.` };
    }
    
    // 'team' dari sini sekarang akan berisi array 'members'
    return { team: team, error: null }; 
    
  } catch (error) {
    console.error("Error di getTeamDetail:", error.message);
    return { team: null, error: error.message }; 
  }
}

// Komponen Halaman (Server Component)
export default async function SubTeamDetailPage({ params: paramsPromise }) { 
  const { teamId } = await paramsPromise; 
  const { team, error } = await getTeamDetail(teamId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <div className="flex items-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-lg text-left">
          <AlertTriangle className="w-10 h-10 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Terjadi Kesalahan Saat Memuat Tim</h3>
            <p className="text-sm">Pesan error: <span className="font-mono bg-red-200 px-1 rounded">{error}</span></p>
            <p className="mt-4 text-sm text-red-600">
              <strong>Tips:</strong> Jika Anda baru saja memulai, coba kunjungi halaman <strong className="font-mono">/admin/manage-sub-teams</strong> terlebih dahulu untuk "membangunkan" database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bagian Atas (Header Tim) */}
      <section 
        className="py-24 px-8" 
        style={{ backgroundColor: '#1C2045' }} // Warna biru kustom Anda
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-12">
            {team.title}
          </h1>
          
          {/* FOTO UTAMA TIM */}
          <div className="relative w-full h-64 md:h-96 rounded-xl shadow-2xl overflow-hidden bg-gray-200 border-2 border-white">
            <ImageWithFallback
              src={team.mainImageUrl}
              fallbackSrc={'https://placehold.co/1200x600/e2e8f0/64748b?text=Foto+Tim'}
              alt={`Foto tim ${team.title}`}
              layout="fill"
              objectFit="cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Bagian Bawah (Deskripsi & Anggota Tim) */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">
          
          {/* Bagian 1: Deskripsi (Full Width) */}
          <div className="mb-20"> 
            <p className="text-lg text-gray-700 leading-relaxed text-justify"> 
              {team.description}
            </p>
          </div>

          {/* Bagian 2: Anggota Tim (Full Width, di bawah deskripsi) */}
          <div>
            {/* --- [PERBAIKAN DI SINI] --- */}
            <h3 className="text-4xl font-bold mb-6 text-gray-800 border-b-4 border-[#1C2045] pb-2 text-center">
              TEAM MEMBER
            </h3>
            {/* ----------------------------- */}
            <div className="space-y-4"> 
              {team.members && team.members.length > 0 ? (
                team.members.map((member) => (
                  <div key={member._id} className="flex flex-col md:flex-row md:justify-between md:items-baseline py-2 border-b border-gray-200"> 
                    <span className="text-xl font-semibold text-gray-900 mb-1 md:mb-0">{member.positionTitle}</span> 
                    <span className="text-lg text-gray-700 md:text-right">{member.memberName}</span> 
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-lg text-center">Anggota tim belum diatur.</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}