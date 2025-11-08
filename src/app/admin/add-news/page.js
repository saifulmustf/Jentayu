/* Path: src/app/admin/add-news/page.js */
/* INI ADALAH HALAMAN BARU UNTUK ADMIN MENAMBAH BERITA */
'use client'; 

import { useState } from 'react';

export default function AdminAddNewsPage() {
  // Kita tambahkan state baru untuk 'content'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // <- STATE BARU
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Tambahkan 'content' di validasi
    if (!title || !file || !content) { // <- VALIDASI BARU
      setMessage({ type: 'error', text: 'Judul, Konten, dan File tidak boleh kosong!' });
      return;
    }

    setLoading(true); 
    setMessage(null); 

    try {
      // --- LANGKAH 1: UPLOAD KE CLOUDINARY (Sama persis) ---
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const dataCloudinary = await resCloudinary.json();
      
      if (!dataCloudinary.secure_url) {
        throw new Error(dataCloudinary.error?.message || 'Gagal upload ke Cloudinary. Cek .env.local');
      }

      const imageUrl = dataCloudinary.secure_url;

      // --- LANGKAH 2: SIMPAN KE DATABASE KITA ---
      const resApi = await fetch('/api/news', { // <- GANTI API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          imageUrl: imageUrl, // Ini akan jadi 'cover image'
          content: content,   // <- DATA BARU
        }),
      });

      const dataApi = await resApi.json();

      if (!dataApi.success) {
        throw new Error(dataApi.error || 'Terjadi kesalahan saat menyimpan ke DB');
      }

      // --- SUKSES TOTAL ---
      setMessage({ type: 'success', text: 'Berita berhasil ditambahkan!' }); // <- GANTI Teks
      setTitle('');
      setContent(''); // <- RESET STATE BARU
      setFile(null);
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }

    } catch (error) {
      setMessage({ type: 'error', text: `Gagal: ${error.message}` });
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel - Tambah Berita</h1> {/* <- GANTI Teks */}
        
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
              Judul Berita {/* <- GANTI Teks */}
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

          {/* --- INPUT BARU UNTUK KONTEN --- */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Isi Berita
            </label>
            <textarea
              id="content"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          {/* --- AKHIR INPUT BARU --- */}

          <div>
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
              Upload Cover Image {/* <- GANTI Teks */}
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
            {loading ? 'Menyimpan...' : 'Simpan Berita'} {/* <- GANTI Teks */}
          </button>
        </form>
      </div>
    </div>
  );
}