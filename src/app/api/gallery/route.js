/* Path: src/app/api/gallery/route.js */

import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem'; 
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHKAN IMPORT INI

/* FUNGSI GET (Mengambil SEMUA data Galeri)
 * Ini dipanggil oleh /admin/manage-gallery dan /gallery
 */

// --- 2. TAMBAHKAN BARIS INI ---
// Ini memaksa agar halaman 'GET' ini SELALU mengambil data terbaru
// dan tidak pernah menggunakan cache. Sangat penting untuk halaman admin.
export const dynamic = 'force-dynamic';
// ------------------------------

export async function GET() { 
  try {
    await dbConnect();
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Menambah data Galeri baru)
 * Ini dipanggil oleh /admin/add-gallery
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await GalleryItem.create(body);

    // --- 3. TAMBAHKAN BLOK INI ---
    // Ini adalah perintah untuk "membersihkan cache" 
    // setelah data baru berhasil disimpan.
    revalidatePath('/admin/manage-gallery'); // Membersihkan cache halaman manage
    revalidatePath('/gallery'); // Membersihkan cache halaman galeri publik (jika ada)
    // -------------------------------

    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}