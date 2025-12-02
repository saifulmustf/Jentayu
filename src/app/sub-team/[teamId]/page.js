/* Path: src/app/sub-team/[teamId]/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */
/* Ditambahkan: AOS Animation */

import ImageWithFallback from '@/components/common/ImageWithFallback';
import { notFound } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import AosInitializer from '@/components/AosInitializer';
import dbConnect from '@/lib/dbConnect';
import SubTeam from '@/models/SubTeam';

// Fungsi getTeamDetail sekarang memanggil DB langsung
async function getTeamDetail(teamId) {
  if (!teamId) {
    return { team: null, error: "Team ID tidak valid atau 'undefined'." };
  }

  try {
    await dbConnect();

    const teams = await SubTeam.aggregate([
      {
        $lookup: {
          from: 'teammembers',
          localField: 'teamId',
          foreignField: 'teamId',
          as: 'members',
        },
      },
      {
        $match: { teamId: teamId }
      }
    ]);

    if (!teams || teams.length === 0) {
      return { team: null, error: `Tim dengan ID '${teamId}' tidak ditemukan di database.` };
    }
    
    const team = JSON.parse(JSON.stringify(teams[0]));
    return { team: team, error: null }; 
    
  } catch (error) {
    console.error("Error di getTeamDetail:", error.message);
    return { team: null, error: `Gagal terhubung ke Database: ${error.message}` }; 
  }
}

// Komponen Halaman (Server Component)
export default async function SubTeamDetailPage({ params: paramsPromise }) { 
  const { teamId } = await paramsPromise; 
  const { team, error } = await getTeamDetail(teamId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <AosInitializer />
        <div 
          className="flex items-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-lg text-left"
          data-aos="fade-up"
          data-aos-duration="600"
        >
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
      {/* Inisialisasi AOS */}
      <AosInitializer />
      
      {/* Hero Section dengan animasi */}
      <section 
        className="py-8 px-8" 
        style={{ backgroundColor: '#020B59' }}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 
            className="text-5xl md:text-6xl font-extrabold text-white text-center mb-144"
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
            {team.title}
          </h1>
          <div 
            className="relative w-full h-64 md:h-[32rem] rounded-xl shadow-2xl overflow-hidden bg-gray-200 border-2 border-white"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <ImageWithFallback
              src={team.mainImageUrl}
              fallbackSrc={'https://via.placeholder.com/1200x600/e2e8f0/64748b?text=Foto+Tim'}
              alt={`Foto tim ${team.title}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Content Section dengan animasi */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">
          
          {/* Description dengan animasi */}
          <div 
            className="mb-20"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
          > 
            <p className="text-lg text-gray-700 leading-relaxed text-justify"> 
              {team.description}
            </p>
          </div>
          
          {/* Team Members Section */}
          <div>
            <h3 
              className="text-4xl font-bold mb-6 text-gray-800 border-b-4 border-[#1C2045] pb-2 text-center"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="300"
            >
              TEAM MEMBER
            </h3>
            <div className="space-y-4"> 
              {team.members && team.members.length > 0 ? (
                team.members.map((member, index) => (
                  <div 
                    key={member._id} 
                    className="flex flex-col md:flex-row md:justify-between md:items-baseline py-2 border-b border-gray-200"
                    data-aos="fade-left"
                    data-aos-duration="600"
                    data-aos-delay={400 + (index * 50)} // 400ms, 500ms, 600ms, dst
                  > 
                    <span className="text-xl font-semibold text-gray-900 mb-1 md:mb-0">{member.positionTitle}</span> 
                    <span className="text-lg text-gray-700 md:text-right">{member.memberName}</span> 
                  </div>
                ))
              ) : (
                <p 
                  className="text-gray-500 text-lg text-center"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="400"
                >
                  Anggota tim belum diatur.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}