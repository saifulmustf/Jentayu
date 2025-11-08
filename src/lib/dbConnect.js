import mongoose from 'mongoose';

// Mengambil URL koneksi dari file .env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Tolong definisikan variabel MONGODB_URI di dalam .env.local'
  );
}

/**
 * Koneksi global (cached) digunakan untuk menghindari
 * pembuatan koneksi baru setiap kali ada 'hot reload' di development.
 * Ini menghemat sumber daya.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Gunakan koneksi yang sudah ada (cached)
    return cached.conn;
  }

  if (!cached.promise) {
    // Jika belum ada koneksi, buat promise koneksi baru
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;