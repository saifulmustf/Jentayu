/* Path: src/app/admin/manage-sub-teams/page.js */
/* Perbaikan: Menambahkan prop 'unoptimized' */

'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Users, AlertTriangle, Loader2 } from 'lucide-react';

// Spinner component
function Spinner() {
  return <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />;
}

// Fungsi untuk mengambil data tim (termasuk anggota)
async function getTeams() {
  try {
    // Kita panggil API /api/sub-teams (dari BAB 2)
    // cache: 'no-store' penting agar data selalu terbaru
    const res = await fetch(`/api/sub-teams`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Gagal mengambil data: ${res.statusText}`);
    }
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Gagal memuat data tim.');
    }
    
    return { teams: data.data, error: null };
  } catch (error) {
    console.error("Error di getTeams:", error.message);
    return { teams: [], error: error.message };
  }
}

export default function ManageSubTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      const { teams, error } = await getTeams();
      if (error) {
        setError(error);
      } else {
        setTeams(teams);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Memuat data tim...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 mr-4 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold mb-2">Terjadi Kesalahan</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Sub Tim</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        
        {teams.length === 0 && (
          <p className="text-gray-500 text-center">Belum ada tim yang dibuat. Database akan di-seed secara otomatis.</p>
        )}

        {teams.map((team) => (
          // Setiap item tim
          <div key={team.teamId} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow">
            
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {/* Info Tim */}
              <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={team.mainImageUrl}
                  alt={team.title}
                  layout="fill"
                  objectFit="cover"
                  onError={(e) => e.currentTarget.src = 'https://placehold.co/400x200/e2e8f0/64748b?text=Foto+Tim'}
                  // --- INI PERBAIKANNYA (untuk mengatasi error SVG) ---
                  unoptimized
                  // ----------------------------------------------------
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{team.title}</h2>
                <p className="text-sm text-gray-500 truncate max-w-xs">{team.description}</p>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                  {team.members.length} Anggota
                </span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 flex-shrink-0">
              <Link href={`/admin/edit-team-info/${team.teamId}`} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Info
              </Link>
              <Link href={`/admin/manage-team-members/${team.teamId}`} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Kelola Anggota
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}