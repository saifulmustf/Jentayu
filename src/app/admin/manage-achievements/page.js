/* Path: src/app/admin/manage-achievements/page.js */
/* Modifikasi: Menambahkan kolom 'Tahun' */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, Trash2, Edit, PlusCircle, Trophy } from 'lucide-react';

// Spinner component
function Spinner() {
  return <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />;
}

// Fungsi untuk mengambil data
async function getItems() {
  // API sudah diatur untuk mengurutkan berdasarkan tahun (-1)
  const res = await fetch('/api/achievements', { cache: 'no-store' });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Gagal mengambil data');
  }
  return res.json();
}

export default function ManageAchievementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      return;
    }
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal menghapus');
      }
      loadItems(); // Refresh daftar
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-indigo-600" />
          Kelola Achievements
        </h1>
        <Link href="/admin/add-achievement" className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Baru
        </Link>
      </div>

      {loading && <div className="flex justify-center"><Spinner /></div>}
      
      {error && (
        <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-md">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <div>
            <h4 className="font-bold">Gagal Memuat Data</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                {/* --- [TAMBAHAN BARU] --- */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                {/* --------------------- */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Belum ada data achievement.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-10 rounded-md overflow-hidden">
                        <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" unoptimized />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-sm truncate">{item.description}</div>
                    </td>
                    {/* --- [TAMBAHAN BARU] --- */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-700">{item.year}</span>
                    </td>
                    {/* --------------------- */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/edit-achievement/${item._id}`} className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-100 transition-colors">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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