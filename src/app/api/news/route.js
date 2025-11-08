/* Path: src/app/api/news/route.js */
/* FILE INI HANYA UNTUK MENGAMBIL SEMUA BERITA (GET) DAN MENAMBAH BARU (POST). */

import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';
import { NextResponse } from 'next/server';

/* FUNGSI GET (Mengambil SEMUA data)
 * Perhatikan: Fungsi ini TIDAK menerima argumen 'params'.
 */
export async function GET() { 
  try {
    await dbConnect();
    const items = await NewsItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Mengirim data baru)
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await NewsItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}