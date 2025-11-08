/* Path: src/app/profile/board-of-directors/page.js */
/* Perbaikan: Mengganti layout total menjadi Bagan Organisasi */

import ImageWithFallback from '@/components/common/ImageWithFallback';
import { AlertTriangle } from 'lucide-react';

async function getBoardMembers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    // API sudah otomatis mengurutkan berdasarkan 'order'
    const res = await fetch(`${baseUrl}/api/board-members`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'API mengembalikan data yang tidak valid');
    }
    
    // Memisahkan data berdasarkan grup
    const members = data.data || [];
    const directors = members.filter(m => m.group === 'Directors');
    const nonTechnical = members.filter(m => m.group === 'Non-Technical');

    return { directors, nonTechnical, error: null };

  } catch (error) {
    console.error("Error di getBoardMembers:", error.message);
    return { directors: [], nonTechnical: [], error: error.message };
  }
}

// Komponen Kartu Anggota (reusable)
const MemberCard = ({ member }) => (
  <div className="flex flex-col items-center text-center">
    {/* Foto */}
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 shadow-lg border-4 border-white">
      <ImageWithFallback
        src={member.memberPhotoUrl}
        fallbackSrc={'https://placehold.co/200x200/e2e8f0/64748b?text=Foto'}
        alt={`Foto ${member.memberName}`}
        layout="fill"
        objectFit="cover"
        unoptimized
      />
    </div>
    {/* Info */}
    <div className="mt-4">
      <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wide">{member.positionTitle}</h3>
      <p className="text-xl font-semibold text-gray-800">{member.memberName}</p>
    </div>
  </div>
);


export default async function BoardOfDirectorsPage() {
  const { directors, nonTechnical, error } = await getBoardMembers();

  return (
    // Latar belakang abu-abu terang sesuai desain
    <div className="bg-gray-100 min-h-screen">
      
      {/* Header Halaman statis (sesuai 'Group 66.jpg').
        Kita ganti hero biru gelap dengan foto tim.
      */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center" 
        style={{ backgroundImage: "url('/board-hero.png')" }} // <-- Ganti dengan foto tim Anda di /public/images/board-hero.jpg
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay gelap */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">BOARD OF DIRECTORS</h1>
        </div>
      </section>

      {/* Konten Utama Bagan Organisasi */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-5xl">
          
          {error && (
            <div className="flex items-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-lg mx-auto mb-12">
              <AlertTriangle className="w-10 h-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Gagal Memuat Data</h3>
                <p className="text-sm">Pesan error: <span className="font-mono bg-red-200 px-1 rounded">{error}</span></p>
              </div>
            </div>
          )}

          {/* --- BAGIAN 1: BOARD OF DIRECTORS --- */}
          {!error && directors.length > 0 && (
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-16">
                Board Of Directors
              </h2>
              
              {/* Layout Hirarki */}
              <div className="flex flex-col items-center gap-12">
                
                {/* Tier 1: General Manager (Asumsi order = 0) */}
                {directors[0] && (
                  <MemberCard member={directors[0]} />
                )}
                
                {/* Garis Penghubung (Opsional, tapi bagus) */}
                {directors.length > 1 && (
                  <div className="w-px h-16 bg-gray-300"></div>
                )}
                
                {/* Tier 2: Head of (Asumsi 2 orang berikutnya) */}
                {directors.length > 1 && (
                  <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-32">
                    {directors.slice(1).map((member) => (
                      <MemberCard key={member._id} member={member} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- BAGIAN 2: NON-TECHNICAL DIVISION --- */}
          {!error && nonTechnical.length > 0 && (
            <div className="mt-20 pt-16 border-t border-gray-300">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-16">
                Non-Technical Division
              </h2>
              
              {/* Layout Grid 3 Kolom */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {nonTechnical.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Pesan jika tidak ada data sama sekali */}
          {!error && directors.length === 0 && nonTechnical.length === 0 && (
             <p className="col-span-full text-center text-gray-500 text-lg">
                Data Board of Directors belum ditambahkan.
              </p>
          )}

        </div>
      </section>
    </div>
  );
}