/* Path: src/app/admin/edit-gallery/[id]/page.js */
/* Halaman form untuk meng-edit satu item */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Hook Next.js

export default function EditGalleryPage() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const params = useParams(); // Hook untuk mengambil { id: '12345' } dari URL
  const router = useRouter(); // Hook untuk redirect halaman
  const { id } = params;

  // 1. Ambil data item yang mau diedit saat halaman dimuat
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/gallery/${id}`) // Panggil API 'GET by ID' Anda
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTitle(data.data.title); // Isi form dengan data yang ada
            setImageUrl(data.data.imageUrl); // Simpan URL gambar (untuk ditampilkan)
          } else {
            setMessage({ type: 'error', text: data.error });
          }
          setLoading(false);
        });
    }
  }, [id]); // Dijalankan ulang jika 'id' berubah

  // 2. Fungsi untuk submit form (UPDATE data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Panggil API 'PUT' Anda
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title }), // Kirim judul yang baru
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Update berhasil!' });
        // Redirect kembali ke halaman manage setelah 1.5 detik
        setTimeout(() => {
          router.push('/admin/manage-gallery');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error });
        setLoading(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setLoading(false);
    }
  };

  if (loading && !title) return <p className="text-center p-8">Memuat item...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Item Galeri</h1>
        
        {message && (
          <div className={`p-4 mb-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Menampilkan gambar yang sedang diedit */}
        {imageUrl && (
          <div className="mb-4">
            <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover rounded" />
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

          <p className="text-sm text-gray-500">
            (Catatan: Ganti gambar belum didukung di form ini. Hanya ganti judul.)
          </p>

          <button
            type="submit"
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}