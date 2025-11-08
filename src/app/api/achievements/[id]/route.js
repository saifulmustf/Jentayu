/* Path: src/app/api/achievements/[id]/route.js */
/* Perbaikan FINAL: Memastikan 'year' di-update dengan konversi tipe data yang kuat */

import dbConnect from '@/lib/dbConnect';
import AchievementItem from '@/models/AchievementItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET (Ambil 1) - (Tidak berubah)
export async function GET(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }
    const item = await AchievementItem.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Update 1) - FUNGSI YANG DIPERBAIKI (FINAL)
export async function PUT(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }
    
    // Ambil body secara eksplisit
    const body = await request.json(); 
    // Data yang kita butuhkan
    const { title, description, imageUrl, year } = body; 
    
    // [PERBAIKAN KUNCI]: Lakukan update dengan body yang difilter dan konversi 'year'
    const item = await AchievementItem.findByIdAndUpdate(id, {
        title,
        description,
        imageUrl,
        year: Number(year) || new Date().getFullYear(), // <-- Pastikan ini adalah Number. Fallback jika konversi gagal.
    }, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }

    revalidatePath('/achievement');
    revalidatePath('/admin/manage-achievements');
    revalidatePath(`/admin/edit-achievement/${id}`);

    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json({ success: false, error: "Data tidak valid", errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE (Hapus 1) - (Tidak berubah)
export async function DELETE(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }
    const deletedItem = await AchievementItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item tidak ditemukan' }, { status: 404 });
    }
    
    revalidatePath('/achievement');
    revalidatePath('/admin/manage-achievements');

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}