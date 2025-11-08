/* Path: src/models/BoardMember.js */
/* Perbaikan: Menambahkan field 'group' */

import mongoose from 'mongoose';

const BoardMemberSchema = new mongoose.Schema({
  positionTitle: {
    type: String,
    required: [true, 'Jabatan tidak boleh kosong.'],
    trim: true,
  },
  memberName: {
    type: String,
    required: [true, 'Nama anggota tidak boleh kosong.'],
    trim: true,
  },
  memberPhotoUrl: {
    type: String,
    required: [true, 'URL Foto tidak boleh kosong.'],
  },
  order: {
    type: Number,
    default: 0,
  },
  // --- [TAMBAHAN BARU] ---
  // Field untuk mengelompokkan (sesuai desain Anda)
  group: {
    type: String,
    required: [true, 'Grup tidak boleh kosong.'],
    enum: ['Directors', 'Non-Technical'], // Hanya 2 pilihan ini
    default: 'Directors',
  },
  // -------------------------
}, { timestamps: true });

export default mongoose.models.BoardMember || mongoose.model('BoardMember', BoardMemberSchema);