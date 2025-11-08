/* Path: src/app/api/news/[id]/route.js */
/* MENGGUNAKAN URLSearchParams UNTUK MENGHINDARI BUG PARAMS NEXT.JS */

import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';
import { NextResponse } from 'next/server';

// Fungsi bantuan untuk mendapatkan ID (mengatasi bug params)
// Fungsi ini akan mengambil ID dari URL jika 'params' gagal
const getNewsId = async (request, paramsPromise) => {
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
    const pathnameParts = url.pathname.split('/'); // Misal: ["", "api", "news", "id123"]
    
    // Asumsi ID adalah bagian terakhir dari pathname: /api/news/[id]
    if (pathnameParts.length > 0) {
        return pathnameParts[pathnameParts.length - 1]; 
    }
    
    throw new Error('News ID tidak ditemukan dalam request.');
};

/* =======================================================================
 * FUNGSI GET (Mengambil 1 Berita)
 * ======================================================================= */
export async function GET(request, { params: paramsPromise }) {
  try {
    const id = await getNewsId(request, paramsPromise); // Ambil ID dengan cara yang robust
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
  try {
    const id = await getNewsId(request, paramsPromise); // Ambil ID dengan cara yang robust
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
    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 }); // Berhasil!

  } catch (error) {
    // Tambahkan error code di pesan untuk debugging
    return NextResponse.json({ success: false, error: `Error PUT: ${error.message}` }, { status: 400 });
  }
}


/* =======================================================================
 * FUNGSI DELETE (Menghapus 1 Berita)
 * ======================================================================= */
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const id = await getNewsId(request, paramsPromise); // Ambil ID dengan cara yang robust
    await dbConnect();
    const deletedItem = await NewsItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { message: 'Item berhasil dihapus' } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: `Error DELETE: ${error.message}` }, { status: 400 });
  }
}