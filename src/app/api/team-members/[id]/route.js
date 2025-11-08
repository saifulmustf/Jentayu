/* Path: src/app/api/team-members/[id]/route.js */
/* Perbaikan: Menambahkan 'await' untuk 'params' di PUT dan DELETE */

import dbConnect from '@/lib/dbConnect';
import TeamMember from '@/models/TeamMember';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET (Ambil 1 anggota)
export async function GET(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan diterapkan di sini
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }
    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Update 1 anggota)
export async function PUT(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan diterapkan di sini
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }
    
    const body = await request.json();
    const member = await TeamMember.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }

    // Revalidasi (members, karena tim mungkin ditampilkan di halaman utama)
    revalidatePath('/admin/manage-team-members');

    return NextResponse.json({ success: true, data: member }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE (Hapus 1 anggota)
export async function DELETE(request, { params: paramsPromise }) {
  await dbConnect();
  try {
    const { id } = await paramsPromise; // <-- Perbaikan diterapkan di sini
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }

    const deletedMember = await TeamMember.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ success: false, error: 'Anggota tidak ditemukan' }, { status: 404 });
    }
    
    // Revalidasi (members, karena tim mungkin ditampilkan di halaman utama)
    revalidatePath('/admin/manage-team-members');

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}