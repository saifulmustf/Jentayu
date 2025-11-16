/* Path: src/app/api/gallery/[id]/route.js */
/* VERSI DENGAN REVALIDATEPATH UNTUK DEPLOY */

import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. TAMBAHAN IMPORT

// Fungsi bantuan untuk mendapatkan ID (mengatasi bug params)
// Ini mengambil ID dari params atau dari URL jika params gagal
const getGalleryId = async (request, paramsPromise) => {
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
    const pathnameParts = url.pathname.split('/'); // Misal: ["", "api", "gallery", "id123"]
    
    // Asumsi ID adalah bagian terakhir dari pathname: /api/gallery/[id]
    if (pathnameParts.length > 0) {
        return pathnameParts[pathnameParts.length - 1]; 
    }
    
    throw new Error('Gallery ID tidak ditemukan dalam request.');
};

// <-- 2. TAMBAHAN: Paksa agar GET selalu fresh (untuk halaman edit)
export const dynamic = 'force-dynamic';

/* =======================================================================
 * FUNGSI GET (Mengambil 1 Item Galeri)
 * ======================================================================= */
export async function GET(request, { params: paramsPromise }) {
  try {
    const id = await getGalleryId(request, paramsPromise);
    await dbConnect();
    const item = await GalleryItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item galeri tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: `Error GET: ${error.message}` }, { status: 400 });
  }
}

/* =======================================================================
 * FUNGSI PUT (Meng-update 1 Item Galeri)
 * ======================================================================= */
export async function PUT(request, { params: paramsPromise }) {
  try {
    const id = await getGalleryId(request, paramsPromise);
    const body = await request.json();
    await dbConnect();

    const updatedItem = await GalleryItem.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: 'Item galeri tidak ditemukan' }, { status: 404 });
    }

    // <-- 3. TAMBAHAN: Bersihkan cache setelah UPDATE
    revalidatePath('/admin/manage-gallery'); // Halaman daftar admin
    revalidatePath('/gallery');             // Halaman galeri publik

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 }); 

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error PUT: ${error.message}` }, { status: 400 });
  }
}


/* =======================================================================
 * FUNGSI DELETE (Menghapus 1 Item Galeri)
 * ======================================================================= */
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const id = await getGalleryId(request, paramsPromise);
    await dbConnect();
    const deletedItem = await GalleryItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item galeri tidak ditemukan' }, { status: 404 });
    }

    // <-- 3. TAMBAHAN: Bersihkan cache setelah DELETE
    revalidatePath('/admin/manage-gallery'); // Halaman daftar admin
    revalidatePath('/gallery');             // Halaman galeri publik

    return NextResponse.json({ success: true, data: { message: 'Item galeri berhasil dihapus' } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error DELETE: ${error.message}` }, { status: 400 });
  }
}