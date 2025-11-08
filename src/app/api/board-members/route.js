/* Path: src/app/api/board-members/route.js */

import dbConnect from '@/lib/dbConnect';
import BoardMember from '@/models/BoardMember';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET (Ambil Semua, diurutkan)
export async function GET() {
  await dbConnect();
  try {
    const members = await BoardMember.find({}).sort({ order: 'asc', createdAt: 'asc' });
    return NextResponse.json({ success: true, data: members }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST (Tambah Baru)
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const member = await BoardMember.create(body);
    
    revalidatePath('/profile/board-of-directors');
    revalidatePath('/admin/manage-board');

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error) {
    // Tangani error validasi Mongoose
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