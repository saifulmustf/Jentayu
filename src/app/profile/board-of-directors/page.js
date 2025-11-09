/* Path: src/app/profile/board-of-directors/page.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */

import ImageWithFallback from '@/components/common/ImageWithFallback';
import { AlertTriangle } from 'lucide-react';
import dbConnect from '@/lib/dbConnect'; // <-- [PERBAIKAN 1]
import BoardMember from '@/models/BoardMember'; // <-- [PERBAIKAN 2]

// [PERBAIKAN 3]: Fungsi getBoardMembers sekarang memanggil DB langsung
async function getBoardMembers() {
  try {
    await dbConnect(); // Koneksi langsung

    // API sudah otomatis mengurutkan berdasarkan 'order'
    const members = await BoardMember.find({}).sort({ order: 'asc' });
    const plainMembers = JSON.parse(JSON.stringify(members));
    
    // Memisahkan data berdasarkan grup
    const directors = plainMembers.filter(m => m.group === 'Directors');
    const nonTechnical = plainMembers.filter(m => m.group === 'Non-Technical');

    return { directors, nonTechnical, error: null };

  } catch (error) {
    console.error("Error di getBoardMembers:", error.message);
    // Error ini sekarang akan langsung menunjukkan masalah MONGODB_URI
    return { directors: [], nonTechnical: [], error: `Gagal terhubung ke Database: ${error.message}` };
  }
}

// Komponen Kartu Anggota (reusable)
const MemberCard = ({ member }) => (
  // JSX ini tidak diubah
  <div className="flex flex-col items-center text-center">
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 shadow-lg border-4 border-white">
      <ImageWithFallback
        src={member.memberPhotoUrl}
        fallbackSrc={'https://via.placeholder.com/200x200/e2e8f0/64748b?text=Foto'}
        alt={`Foto ${member.memberName}`}
        layout="fill"
        objectFit="cover"
        unoptimized
      />
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wide">{member.positionTitle}</h3>
      <p className="text-xl font-semibold text-gray-800">{member.memberName}</p>
    </div>
  </div>
);


export default async function BoardOfDirectorsPage() {
  const { directors, nonTechnical, error } = await getBoardMembers();

  return (
    // JSX Anda di bawah ini tidak diubah
    <div className="bg-gray-100 min-h-screen">
      
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center" 
        style={{ backgroundImage: "url('/board-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">BOARD OF DIRECTORS</h1>
        </div>
      </section>

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

          {!error && directors.length > 0 && (
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-16">
                Board Of Directors
              </h2>
              <div className="flex flex-col items-center gap-12">
                {directors[0] && (
                  <MemberCard member={directors[0]} />
                )}
                {directors.length > 1 && (
                  <div className="w-px h-16 bg-gray-300"></div>
                )}
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

          {!error && nonTechnical.length > 0 && (
            <div className="mt-20 pt-16 border-t border-gray-300">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-16">
                Non-Technical Division
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {nonTechnical.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </div>
          )}

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