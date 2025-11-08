/* Path: src/models/GalleryItem.js */

import mongoose from 'mongoose';

/* Ini adalah 'cetakan' atau 'struktur' untuk setiap data
  yang akan kita simpan di database untuk Galeri.
  Setiap item Galeri akan punya: title dan imageUrl.
*/
const GalleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul tidak boleh kosong.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'URL Gambar tidak boleh kosong.'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Otomatis diisi tanggal saat ini
  },
});

/* PENTING:
  Mencegah Mongoose membuat model baru setiap kali
  file ini dipanggil di 'hot-reload' (mode development).
*/
export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);