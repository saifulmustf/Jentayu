/* Path: src/app/api/sponsors/route.js */

import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';
import { NextResponse } from 'next/server';

/* FUNGSI GET (Mengambil SEMUA data Sponsor) */
export async function GET() { 
  try {
    await dbConnect();
    // Urutkan sponsor berdasarkan nama (A-Z)
    const items = await SponsorItem.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Menambah data Sponsor baru) */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await SponsorItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}