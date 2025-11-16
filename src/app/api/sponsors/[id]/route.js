/* Path: src/app/api/sponsors/[id]/route.js */
/* MENGGUNAKAN LOGIKA ROBUST UNTUK ID + REVALIDATE */

import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHKAN IMPORT INI

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
    const pathnameParts = url.pathname.split('/').filter(part => part.length > 0); 
    if (pathnameParts.length > 0) {
        return pathnameParts[pathnameParts.length - 1]; 
    }
    throw new Error('Sponsor ID tidak ditemukan dalam request.');
};

// --- 2. TAMBAHKAN BARIS INI ---
// Memaksa 'GET' (untuk halaman edit) agar selalu fresh
export const dynamic = 'force-dynamic';
// -------------------------------

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
    }

    // --- 3. TAMBAHKAN BLOK INI ---
    // Perintah untuk Vercel membersihkan cache setelah PUT (update) berhasil
    revalidatePath('/admin/manage-sponsors'); // Bersihkan cache halaman admin
    revalidatePath('/profile'); // <-- Ganti '/profile' jika halaman sponsor publik Anda berbeda
    // -------------------------------

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

    // --- 3. TAMBAHKAN BLOK INI ---
    // Perintah untuk Vercel membersihkan cache setelah DELETE berhasil
    revalidatePath('/admin/manage-sponsors'); // Bersihkan cache halaman admin
    revalidatePath('/profile'); // <-- Ganti '/profile' jika halaman sponsor publik Anda berbeda
    // -------------------------------

    return NextResponse.json({ success: true, data: { message: 'Sponsor berhasil dihapus' } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error DELETE: ${error.message}` }, { status: 400 });
  }
}