/* Path: src/models/NewsItem.js */

import mongoose from 'mongoose';

/* Ini adalah 'cetakan' untuk data Berita.
 * Mirip dengan GalleryItem, tapi kita tambahkan 'content'
 * untuk menyimpan isi artikel beritanya.
*/
const NewsItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul tidak boleh kosong.'],
  },
  imageUrl: {
    type: String, // Ini akan kita gunakan untuk 'Cover Image' berita
    required: [true, 'URL Gambar tidak boleh kosong.'],
  },
  content: {
    type: String, // Ini untuk menyimpan isi artikel
    required: [true, 'Konten berita tidak boleh kosong.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* Mencegah Mongoose membuat model baru setiap kali hot-reload */
export default mongoose.models.NewsItem || mongoose.model('NewsItem', NewsItemSchema);