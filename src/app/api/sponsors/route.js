/* Path: src/app/api/sponsors/route.js */

import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHKAN IMPORT INI

// --- 2. TAMBAHKAN BARIS INI ---
// Memaksa 'GET' ini agar SELALU mengambil data terbaru dari DB
// dan tidak pernah di-cache. Sangat penting untuk halaman admin.
export const dynamic = 'force-dynamic';
// ------------------------------

/* FUNGSI GET (Mengambil SEMUA data Sponsor) */
export async function GET() { 
  try {
    await dbConnect();
    // Urutkan sponsor berdasarkan nama (A-Z)
    const items = await SponsorItem.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Menambah data Sponsor baru) */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await SponsorItem.create(body);

    // --- 3. TAMBAHKAN BLOK INI ---
    // Perintah untuk Vercel membersihkan cache setelah POST berhasil
    revalidatePath('/admin/manage-sponsors'); // Bersihkan cache halaman admin
    revalidatePath('/profile'); // <-- Ganti '/profile' jika halaman sponsor publik Anda berbeda
    // -------------------------------

    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}