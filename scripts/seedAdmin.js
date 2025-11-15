/* Path: scripts/seedAdmin.js */
/* Script ini untuk membuat satu akun admin secara manual */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// --- KONFIGURASI (Ubah Ini Sesuai Kebutuhan Anda) ---
const ADMIN_EMAIL = 'admin@jentayu.com';
const ADMIN_PASSWORD = 'passwordyangkuat123';
// ----------------------------------------------------

// Fungsi untuk membaca .env.local
function getMongoURI() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    for (const line of lines) {
      if (line.startsWith('MONGODB_URI=')) {
        return line.substring('MONGODB_URI='.length).trim();
      }
    }
  } catch (err) {
    console.error('Gagal membaca file .env.local', err);
    process.exit(1);
  }
}

// Model User Schema (didefinisikan di sini agar script simpel)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Fungsi utama Seeder
async function seedAdmin() {
  const MONGODB_URI = getMongoURI();
  if (!MONGODB_URI) {
    console.error('MONGODB_URI tidak ditemukan di .env.local');
    process.exit(1);
  }

  console.log('Menghubungkan ke MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Berhasil terhubung ke MongoDB.');

    // 1. Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Akun admin dengan email ini sudah ada.');
      return;
    }

    // 2. Jika belum ada, hash password
    console.log('Membuat hash password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // 3. Buat admin baru
    const admin = new User({
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });
    await admin.save();
    console.log('=============================================');
    console.log('✅ Akun admin berhasil dibuat!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('=============================================');

  } catch (error) {
    console.error('Terjadi error saat seeding admin:', error);
  } finally {
    // 4. Tutup koneksi
    await mongoose.disconnect();
    console.log('Koneksi MongoDB ditutup.');
  }
}

// Jalankan fungsi
seedAdmin();