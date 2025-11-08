/* Path: src/app/api/board-members/[id]/route.js */
/* Perbaikan: Menambahkan 'await' untuk 'paramsPromise' di GET, PUT, DELETE */

import dbConnect from '@/lib/dbConnect';
import BoardMember from '@/models/BoardMember';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET (Ambil 1 anggota)
export async function GET(request, { params: paramsPromise }) { // <-- Perbaikan 1
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan 2
    
    const member = await BoardMember.findById(id); // <-- Perbaikan 3
    if (!member) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Update 1 anggota)
export async function PUT(request, { params: paramsPromise }) { // <-- Perbaikan 1
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan 2
    const body = await request.json();
    
    const member = await BoardMember.findByIdAndUpdate(id, body, { // <-- Perbaikan 3
      new: true,
      runValidators: true,
    });
    if (!member) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }

    revalidatePath('/profile/board-of-directors');
    revalidatePath('/admin/manage-board');
    revalidatePath(`/admin/edit-board-member/${id}`);

    return NextResponse.json({ success: true, data: member }, { status: 200 });
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

// DELETE (Hapus 1 anggota)
export async function DELETE(request, { params: paramsPromise }) { // <-- Perbaikan 1
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan 2

    const deletedMember = await BoardMember.findByIdAndDelete(id); // <-- Perbaikan 3
    if (!deletedMember) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }
    
    revalidatePath('/profile/board-of-directors');
    revalidatePath('/admin/manage-board');

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}