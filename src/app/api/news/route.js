/* Path: src/app/api/news/route.js */

import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHKAN IMPORT INI

// --- 2. TAMBAHKAN BARIS INI ---
// Ini memaksa API endpoint 'GET' ini agar SELALU berjalan di server
// dan tidak pernah di-cache. Ini penting untuk admin dan publik.
export const dynamic = 'force-dynamic';
// ------------------------------

/* FUNGSI GET (Mengambil SEMUA data) */
export async function GET() { 
  try {
    await dbConnect();
    const items = await NewsItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Mengirim data baru) */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await NewsItem.create(body);

    // --- 3. TAMBAHKAN BLOK INI ---
    // Perintah untuk Vercel membersihkan cache halaman
    revalidatePath('/admin/manage-news'); // Bersihkan cache halaman admin
    revalidatePath('/news');              // Bersihkan cache halaman daftar berita publik
    // -------------------------------

    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}