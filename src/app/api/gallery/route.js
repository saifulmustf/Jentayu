/* Path: src/app/api/gallery/route.js */
/* FILE INI HANYA UNTUK MENGAMBIL SEMUA GALERI (GET) DAN MENAMBAH BARU (POST). */

import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem'; // Pastikan Anda punya file GalleryItem.js
import { NextResponse } from 'next/server';

/* FUNGSI GET (Mengambil SEMUA data Galeri)
 * Ini dipanggil oleh /admin/manage-gallery dan /gallery
 */
export async function GET() { 
  try {
    await dbConnect();
    // Cari semua item dan urutkan dari yang terbaru
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    // Kirim pesan error jika gagal koneksi atau query
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/* FUNGSI POST (Menambah data Galeri baru)
 * Ini dipanggil oleh /admin/add-gallery
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await GalleryItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}