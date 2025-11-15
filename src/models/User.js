import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email tidak boleh kosong.'],
    unique: true, // Pastikan email unik
    match: [/.+\@.+\..+/, 'Tolong masukkan email yang valid.'],
  },
  password: {
    type: String,
    required: [true, 'Password tidak boleh kosong.'],
    // Kita tidak akan menyimpan password asli, tapi HASH-nya
  },
  // Anda bisa tambahkan 'name' atau 'role' di sini jika perlu
});

export default mongoose.models.User || mongoose.model('User', UserSchema);