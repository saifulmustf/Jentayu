/* Path: src/app/admin/manage-gallery/page.js */
/* Halaman untuk menampilkan daftar semua item galeri dan tombol delete/edit */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

const Spinner = () => (
  <div className="border-4 border-gray-300 border-t-indigo-600 rounded-full w-6 h-6 animate-spin"></div>
);

// Hapus confirm, ganti dengan window.confirm
const confirm = (message) => window.confirm(message);

export default function ManageGalleryPage() {
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Fungsi untuk mengambil data galeri dari API
  const fetchGallery = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const res = await fetch('/api/gallery'); 

      if (!res.ok) {
          const errorText = await res.text();
          let errorMessage = `Gagal memuat data. Status: ${res.status}.`;
          try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || errorMessage;
          } catch (e) {}
          throw new Error(errorMessage);
      }

      const data = await res.json();

      if (data.success) {
        setGalleryItems(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memuat daftar galeri.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Koneksi atau Server Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Fungsi untuk menghapus item
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;

    try {
      setMessage(null);
      
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
          throw new Error(`Gagal menghapus item. Status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Item galeri berhasil dihapus.' });
        fetchGallery(); 
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus item galeri.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Koneksi gagal saat menghapus: ${error.message}` });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Galeri</h1>
        {/* PERBAIKAN: Hapus legacyBehavior dan gunakan styling langsung di Link */}
        <Link 
            href="/admin/add-gallery" 
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Item Baru
        </Link>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {loading && galleryItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
          <span className="ml-2 text-gray-700">Memuat daftar galeri...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Upload
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleryItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada item galeri ditemukan.
                  </td>
                </tr>
              ) : (
                galleryItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* PERBAIKAN: Hapus legacyBehavior dan gunakan Link langsung */}
                      <Link 
                          href={`/admin/edit-gallery/${item._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="w-5 h-5 inline" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}