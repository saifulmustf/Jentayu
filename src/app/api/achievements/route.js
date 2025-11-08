/* Path: src/app/api/achievements/route.js */
/* Modifikasi: Menambahkan 'year' */

import dbConnect from '@/lib/dbConnect';
import AchievementItem from '@/models/AchievementItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET (Ambil semua)
export async function GET() {
  await dbConnect();
  try {
    // [PERUBAHAN]: Urutkan berdasarkan TAHUN (terbaru dulu), lalu createdAt
    const items = await AchievementItem.find({}).sort({ year: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST (Tambah baru)
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json(); // body = { title, description, imageUrl, year }
    
    // [PERUBAHAN]: 'body' sekarang sudah berisi 'year' dari form
    const item = await AchievementItem.create(body); 

    revalidatePath('/achievement');
    revalidatePath('/admin/manage-achievements');

    return NextResponse.json({ success: true, data: item }, { status: 201 });
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