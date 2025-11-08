/* Path: src/app/api/sub-teams/route.js */
import dbConnect from '@/lib/dbConnect';
import SubTeam from '@/models/SubTeam';
import TeamMember from '@/models/TeamMember'; // Kita butuh ini untuk $lookup
import { NextResponse } from 'next/server';

// Daftar 3 tim default Anda
const defaultTeams = [
  { teamId: 'racing-plane', title: 'RACING PLANE', description: 'Deskripsi default untuk Racing Plane.' },
  { teamId: 'fixed-wing', title: 'FIXED WING', description: 'Deskripsi default untuk Fixed Wing.' },
  { teamId: 'vtol', title: 'VTOL', description: 'Deskripsi default untuk VTOL.' },
];

export async function GET() {
  await dbConnect();
  try {
    // --- Logika "Seeding" Otomatis ---
    // Cek apakah 3 tim sudah ada
    for (const team of defaultTeams) {
      await SubTeam.updateOne(
        { teamId: team.teamId }, // Cari berdasarkan teamId
        { $setOnInsert: team }, // Jika tidak ada, buat baru
        { upsert: true } // Opsi "Update or Insert"
      );
    }
    // ----------------------------------

    // --- Logika "Penggabungan" Cerdas ($lookup) ---
    // Ambil semua tim, DAN gabungkan data anggota tim terkait
    const teamsWithMembers = await SubTeam.aggregate([
      {
        $lookup: {
          from: 'teammembers', // Nama koleksi (lowercase, plural)
          localField: 'teamId', // Kunci di SubTeam
          foreignField: 'teamId', // Kunci di TeamMember
          as: 'members', // Simpan hasilnya di array 'members'
        },
      },
      {
        $sort: { createdAt: 1 } // Urutkan
      }
    ]);
    // ---------------------------------------------

    return NextResponse.json({ success: true, data: teamsWithMembers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}