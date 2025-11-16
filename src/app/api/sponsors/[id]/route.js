/* Path: src/app/api/sponsors/[id]/route.js */
/* VERSI FINAL DENGAN REVALIDATEPATH YANG SUDAH DIKOREKSI UNTUK HOMEPAGE */

import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHAN IMPORT

// Fungsi bantuan untuk mendapatkan ID (LOGIKA ANDA TETAP SAMA)
const getSponsorId = async (request, paramsPromise) => {
    // 1. Coba ambil ID dari params (cara Next.js)
    try {
        const params = await paramsPromise;
        if (params && params.id) {
            return params.id;
        }
    } catch (e) {
        // Abaikan error promise
    }

    // 2. Fallback: Ambil ID dari request.url (cara yang lebih aman)
    const url = new URL(request.url);
    // [PERBAIKAN]: Filter bagian kosong untuk menangani trailing slash
    const pathnameParts = url.pathname.split('/').filter(part => part.length > 0); // Misal: ["api", "sponsors", "id123"]
    
    // Asumsi ID adalah bagian terakhir dari pathname
    if (pathnameParts.length > 0) {
        return pathnameParts[pathnameParts.length - 1]; 
    }
    
    throw new Error('Sponsor ID tidak ditemukan dalam request.');
};

// --- 2. TAMBAHAN ---
// Memaksa 'GET' (untuk halaman edit) agar selalu fresh
// dan tidak mengambil data cache lama.
export const dynamic = 'force-dynamic';
// --------------------

/* =======================================================================
 * FUNGSI GET (Mengambil 1 Sponsor)
 * ======================================================================= */
export async function GET(request, { params: paramsPromise }) {
  try {
    const id = await getSponsorId(request, paramsPromise);
    await dbConnect();
    const item = await SponsorItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: 'Sponsor tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: `Error GET: ${error.message}` }, { status: 400 });
  }
}

/* =======================================================================
 * FUNGSI PUT (Meng-update 1 Sponsor)
 * ======================================================================= */
export async function PUT(request, { params: paramsPromise }) {
  try {
    const id = await getSponsorId(request, paramsPromise);
    const body = await request.json();
    await dbConnect();

    const updatedItem = await SponsorItem.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: 'Sponsor tidak ditemukan' }, { status: 404 });
  _ }

    // --- 3. TAMBAHAN KOREKSI ---
    // Perintah untuk Vercel membersihkan cache setelah PUT (update) berhasil
    revalidatePath('/admin/manage-sponsors'); // Bersihkan cache halaman admin
    revalidatePath('/'); // <-- KOREKSI UTAMA: Bersihkan cache Homepage
    // ----------------------------

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 }); 

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error PUT: ${error.message}` }, { status: 400 });
  }
}


/* =======================================================================
 * FUNGSI DELETE (Menghapus 1 Sponsor)
 * ======================================================================= */
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const id = await getSponsorId(request, paramsPromise);
    await dbConnect();
    const deletedItem = await SponsorItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Sponsor tidak ditemukan' }, { status: 404 });
    }

    // --- 3. TAMBAHAN KOREKSI ---
    // Perintah untuk Vercel membersihkan cache setelah DELETE berhasil
    revalidatePath('/admin/manage-sponsors'); // Bersihkan cache halaman admin
    revalidatePath('/'); // <-- KOREKSI UTAMA: Bersihkan cache Homepage
    // ----------------------------

    return NextResponse.json({ success: true, data: { message: 'Sponsor berhasil dihapus' } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error DELETE: ${error.message}` }, { status: 400 });
  }
}