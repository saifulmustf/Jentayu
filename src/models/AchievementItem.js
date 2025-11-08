/* Path: src/models/AchievementItem.js */
/* Modifikasi: Menambahkan field 'year' */

import mongoose from 'mongoose';

const AchievementItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul tidak boleh kosong.'],
  },
  description: {
    type: String,
    required: [true, 'Deskripsi tidak boleh kosong.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'URL Gambar tidak boleh kosong.'],
  },
  // --- [TAMBAHAN BARU] ---
  year: {
    type: Number,
    required: [true, 'Tahun tidak boleh kosong.'],
    // Set default ke tahun saat ini jika tidak diisi
    default: () => new Date().getFullYear(), 
  },
  // ------------------------
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AchievementItem || mongoose.model('AchievementItem', AchievementItemSchema);