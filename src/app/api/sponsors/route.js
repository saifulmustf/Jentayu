/* Path: src/app/api/sponsors/route.js */

import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- WAJIB

// Memaksa GET agar selalu fresh (PENTING untuk admin)
export const dynamic = 'force-dynamic';

/* FUNGSI GET */
export async function GET() { 
  try {
    await dbConnect();
    const items = await SponsorItem.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await SponsorItem.create(body);

    // --- INI KOREKSI UTAMANYA ---
    revalidatePath('/admin/manage-sponsors'); // Membersihkan cache halaman admin
    revalidatePath('/'); // <-- Path-nya '/' (Homepage), BUKAN '/profile'
    // ----------------------------

    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}