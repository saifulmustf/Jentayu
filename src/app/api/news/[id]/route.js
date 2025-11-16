/* Path: src/app/api/news/[id]/route.js */

import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHKAN IMPORT INI

// (Fungsi 'getNewsId' Anda ada di sini... saya potong agar ringkas)
// ...
const getNewsId = async (request, paramsPromise) => {
    try {
        const params = await paramsPromise;
        if (params && params.id) { return params.id; }
    } catch (e) {}
    const url = new URL(request.url);
    const pathnameParts = url.pathname.split('/'); 
    if (pathnameParts.length > 0) {
        return pathnameParts[pathnameParts.length - 1]; 
    }
    throw new Error('News ID tidak ditemukan dalam request.');
};
// ...

// --- 2. TAMBAHKAN BARIS INI (SANGAT PENTING) ---
// Ini memaksa API endpoint 'GET [id]' ini agar SELALU berjalan di server
// dan tidak pernah di-cache. Ini akan MEMPERBAIKI bug "Berita tidak ditemukan".
export const dynamic = 'force-dynamic';
// ----------------------------------------------

/* =======================================================================
 * FUNGSI GET (Mengambil 1 Berita)
 * ======================================================================= */
export async function GET(request, { params: paramsPromise }) {
  try {
    const id = await getNewsId(request, paramsPromise); 
    await dbConnect();
    const item = await NewsItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: `Error GET: ${error.message}` }, { status: 400 });
  }
}

/* =======================================================================
 * FUNGSI PUT (Meng-update 1 Berita) 
 * ======================================================================= */
export async function PUT(request, { params: paramsPromise }) {
  let id; // Definisikan id di sini
  try {
    id = await getNewsId(request, paramsPromise); // Ambil ID
    const body = await request.json();
    await dbConnect();

    const updatedItem = await NewsItem.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }

    // --- 3. TAMBAHKAN BLOK INI ---
    revalidatePath('/admin/manage-news'); // Bersihkan cache halaman admin
    revalidatePath('/news');              // Bersihkan cache halaman daftar berita publik
    if (id) {
      revalidatePath(`/news/${id}`);    // Bersihkan cache halaman detail publik
    }
    // -------------------------------

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 }); 

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error PUT: ${error.message}` }, { status: 400 });
  }
}


/* =======================================================================
 * FUNGSI DELETE (Menghapus 1 Berita)
 * ======================================================================= */
export async function DELETE(request, { params: paramsPromise }) {
  let id; // Definisikan id di sini
  try {
    id = await getNewsId(request, paramsPromise); // Ambil ID
    await dbConnect();
    const deletedItem = await NewsItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }

    // --- 3. TAMBAHKAN BLOK INI ---
    revalidatePath('/admin/manage-news'); // Bersihkan cache halaman admin
    revalidatePath('/news');              // Bersihkan cache halaman daftar berita publik
    if (id) {
      revalidatePath(`/news/${id}`);    // Bersihkan cache halaman detail publik
    }
    // -------------------------------

    return NextResponse.json({ success: true, data: { message: 'Item berhasil dihapus' } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error DELETE: ${error.message}` }, { status: 400 });
  }
}