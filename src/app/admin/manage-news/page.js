/* Path: src/app/admin/manage-news/page.js */
/* KODE LENGKAP - Ganti semua isi file Anda dengan ini */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Icon (Inline SVG)
const IconEdit = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const IconDelete = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const IconLoading = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function ManageNewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fungsi untuk mengambil data berita
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) {
        setNewsItems(data.data);
      } else {
        throw new Error(data.error || 'Gagal mengambil data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Fungsi untuk menghapus berita
  const handleDelete = async (id) => {
    // Menambahkan konfirmasi sebelum menghapus
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }
    
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setNewsItems(prevItems => prevItems.filter(item => item._id !== id));
      } else {
        throw new Error(data.error || 'Gagal menghapus berita');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && newsItems.length === 0) {
    return <div className="text-center text-gray-500">Memuat berita...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      
      {/* --- TOMBOL TAMBAH BARU (SESUAI IDE ANDA) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
        <Link 
          href="/admin/add-news" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors"
        >
          + Tambah Berita
        </Link>
      </div>
      {/* --- AKHIR TOMBOL --- */}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          Error: {error}
        </div>
      )}

      {newsItems.length === 0 ? (
        <p className="text-gray-500">Belum ada berita. Silakan tambahkan.</p>
      ) : (
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div 
              key={item._id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link 
                  href={`/admin/edit-news/${item._id}`}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  title="Edit"
                >
                  <IconEdit />
                </Link>
                
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className={`p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ${
                    deletingId === item._id ? 'bg-red-300' : ''
                  }`}
                  title="Hapus"
                >
                  {deletingId === item._id ? <IconLoading /> : <IconDelete />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}