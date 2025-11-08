/* Path: src/app/admin/page.js */
/* VERSI FINAL (FIXED) DENGAN try...catch...finally */
'use client'; 

import { useState } from 'react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // --- FUNGSI handleSubmit YANG SUDAH DIPERBAIKI ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!title || !file) {
      setMessage({ type: 'error', text: 'Judul dan File tidak boleh kosong!' });
      return;
    }

    setLoading(true); 
    setMessage(null); 

    try {
      // --- LANGKAH 1: UPLOAD KE CLOUDINARY ---
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const dataCloudinary = await resCloudinary.json();
      
      // Jika error, lempar error dengan pesan dari Cloudinary
      if (!dataCloudinary.secure_url) {
        throw new Error(dataCloudinary.error?.message || 'Gagal upload ke Cloudinary. Cek .env.local');
      }

      const imageUrl = dataCloudinary.secure_url;

      // --- LANGKAH 2: SIMPAN KE DATABASE KITA ---
      const resApi = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          imageUrl: imageUrl,
        }),
      });

      const dataApi = await resApi.json();

      // Jika error, lempar error dari API kita
      if (!dataApi.success) {
        throw new Error(dataApi.error || 'Terjadi kesalahan saat menyimpan ke DB');
      }

      // --- SUKSES TOTAL ---
      setMessage({ type: 'success', text: 'Gambar berhasil ditambahkan!' });
      setTitle('');
      setFile(null);
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }

    } catch (error) {
      // --- CATCH BLOCK UNIVERSAL ---
      // Ini akan menangkap error DARI KEDUA langkah (Cloudinary ATAU API)
      // dan menampilkan pesan error yang SESUNGGUHNYA
      setMessage({ type: 'error', text: `Gagal: ${error.message}` });
    
    } finally {
      // --- BLOK FINAL (PALING PENTING) ---
      // Ini akan SELALU dijalankan, baik 'try' sukses ATAU 'catch' gagal
      setLoading(false); // <-- Ini akan menghentikan tombol "Menyimpan..."
    }
  };
  // --- AKHIR FUNGSI handleSubmit ---

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel - Tambah Galeri</h1>
        
        {message && (
          <div className={`p-4 mb-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Judul Gambar
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
              Upload Gambar
            </label>
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Gambar'}
          </button>
        </form>
      </div>
    </div>
  );
}