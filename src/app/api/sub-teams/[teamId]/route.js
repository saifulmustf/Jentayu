/* Path: src/app/api/sub-teams/[teamId]/route.js */
/* Perbaikan: Menambahkan 'await' untuk 'paramsPromise' */

import dbConnect from '@/lib/dbConnect';
import SubTeam from '@/models/SubTeam';
import TeamMember from '@/models/TeamMember'; // Kita mungkin perlu ini nanti
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// --- INI FUNGSI YANG DIPERBAIKI ---
export async function GET(request, { params: paramsPromise }) { // <--- 'params' diubah jadi 'params: paramsPromise'
  await dbConnect();
  try {
    const { teamId } = await paramsPromise; // <--- 'await' ditambahkan di sini

    if (!teamId) {
      return NextResponse.json({ success: false, error: 'Team ID tidak valid.' }, { status: 400 });
    }

    // Sekarang pencarian ini akan berhasil
    const team = await SubTeam.findOne({ teamId: teamId }); 
    
    if (!team) {
      return NextResponse.json({ success: false, error: 'Tim tidak ditemukan di database' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: team }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
// ------------------------------------


// Fungsi PUT (Untuk Edit Info Tim)
export async function PUT(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { teamId } = await paramsPromise;
    if (!teamId) {
      return NextResponse.json({ success: false, error: 'Team ID tidak valid.' }, { status: 400 });
    }

    const body = await request.json();
    const { description, mainImageUrl } = body;

    const updatedTeam = await SubTeam.findOneAndUpdate(
      { teamId: teamId },
      {
        description: description,
        mainImageUrl: mainImageUrl,
      },
      { new: true, runValidators: true } // 'new: true' mengembalikan dokumen yang sudah di-update
    );

    if (!updatedTeam) {
      return NextResponse.json({ success: false, error: 'Tim tidak ditemukan untuk di-update' }, { status: 404 });
    }

    // Revalidasi (bersihkan cache) untuk halaman publik
    revalidatePath(`/sub-team/${teamId}`);
    revalidatePath('/admin/manage-sub-teams');

    return NextResponse.json({ success: true, data: updatedTeam }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// (Kita tidak perlu DELETE untuk 3 tim utama, jadi fungsi DELETE dihilangkan)