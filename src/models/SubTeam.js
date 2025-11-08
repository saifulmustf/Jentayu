/* Path: src/models/SubTeam.js */
import mongoose from 'mongoose';

/*
  Ini adalah 'cetakan' untuk 3 tim utama Anda.
  - teamId: Pengenal unik (cth: 'racing-plane')
  - title: Nama tim (cth: 'RACING PLANE')
  - description: Paragraf deskripsi yang bisa di-edit
  - mainImageUrl: Foto utama tim
*/
const SubTeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: [true, 'Team ID tidak boleh kosong.'],
    unique: true, // PASTI UNIK
  },
  title: {
    type: String,
    required: [true, 'Judul tidak boleh kosong.'],
  },
  description: {
    type: String,
    default: 'Deskripsi tim belum diatur.',
  },
  mainImageUrl: {
    type: String,
    default: 'https://placehold.co/1200x600/e2e8f0/64748b?text=Foto+Tim',
  },
}, { timestamps: true });

export default mongoose.models.SubTeam || mongoose.model('SubTeam', SubTeamSchema);