/* Path: src/app/admin/manage-sponsors/page.js */
/* Halaman untuk menampilkan daftar semua sponsor dan tombol delete/edit */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
const IconAdd = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

// Hapus confirm, ganti dengan window.confirm
const confirm = (message) => window.confirm(message);


export default function ManageSponsorsPage() {
  const [sponsorItems, setSponsorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // State untuk form tambah sponsor baru
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorFile, setNewSponsorFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);


  // --- FUNGSI FETCH ---
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sponsors');
      const data = await res.json();
      if (data.success) {
        setSponsorItems(data.data);
      } else {
        throw new Error(data.error || 'Gagal memuat data sponsor');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);


  // --- FUNGSI HAPUS ---
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sponsor ini?')) return;
    
    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Sponsor berhasil dihapus!' });
        fetchSponsors(); // Reload data
      } else {
        throw new Error(data.error || 'Gagal menghapus sponsor');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setDeletingId(null);
    }
  };


  // --- FUNGSI TAMBAH SPONSOR (di halaman yang sama) ---
  const handleAddSubmit = async (e) => {
    e.preventDefault(); 

    if (!newSponsorName || !newSponsorFile) {
      setMessage({ type: 'error', text: 'Nama dan File Logo tidak boleh kosong!' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // 1. Upload ke Cloudinary
      const formData = new FormData();
      formData.append('file', newSponsorFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const dataCloudinary = await resCloudinary.json();
      
      if (!dataCloudinary.secure_url) {
        throw new Error(dataCloudinary.error?.message || 'Gagal upload ke Cloudinary.');
      }
      const logoUrl = dataCloudinary.secure_url;

      // 2. Simpan ke Database
      const resApi = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSponsorName,
          logoUrl: logoUrl,
        }),
      });

      const dataApi = await resApi.json();

      if (!dataApi.success) {
        throw new Error(dataApi.error || 'Gagal menyimpan ke DB.');
      }

      // Sukses dan reset form
      setMessage({ type: 'success', text: 'Sponsor baru berhasil ditambahkan!' });
      setNewSponsorName('');
      setNewSponsorFile(null);
      document.getElementById('file-input-sponsor').value = null;
      fetchSponsors(); // Reload daftar sponsor

    } catch (error) {
      setMessage({ type: 'error', text: `Gagal: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading && sponsorItems.length === 0) {
    return <div className="text-center text-gray-500">Memuat daftar sponsor...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Sponsor</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* ===== BAGIAN TAMBAH SPONSOR (FORM) ===== */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
            <IconAdd /> <span className="ml-2">Tambah Sponsor Baru</span>
        </h2>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="sponsor-name" className="block text-sm font-medium text-gray-700">
                Nama Sponsor
              </label>
              <input
                type="text"
                id="sponsor-name"
                value={newSponsorName}
                onChange={(e) => setNewSponsorName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled={submitting}
                placeholder="Misal: PT Dirgantara"
              />
            </div>
            
            <div>
              <label htmlFor="file-input-sponsor" className="block text-sm font-medium text-gray-700">
                Logo Sponsor
              </label>
              <input
                type="file"
                id="file-input-sponsor"
                onChange={(e) => setNewSponsorFile(e.target.files[0])}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex justify-center items-center ${
                submitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={submitting}
            >
              {submitting ? <IconLoading /> : 'Simpan Sponsor'}
            </button>
          </div>
        </form>
      </div>

      {/* ===== BAGIAN DAFTAR SPONSOR ===== */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Sponsor ({sponsorItems.length})</h2>
        
        {sponsorItems.length === 0 ? (
          <p className="text-gray-500">Belum ada sponsor. Silakan tambahkan di atas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Sponsor
                  </th>
                  {/* MODIFIKASI: Menambah lebar kolom Aksi */}
                  <th scope="col" className="px-6 py-3 w-32"> 
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sponsorItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-24 h-12">
                          <Image
                              src={item.logoUrl}
                              alt={item.name}
                              layout="fill"
                              objectFit="contain"
                              className="grayscale opacity-75"
                          />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    {/* MODIFIKASI: Mengatur layout tombol agar tidak terpotong */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2"> 
                        {/* Tombol Edit */}
                        <Link
                          href={`/admin/edit-sponsors/${item._id}`}
                          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          title="Edit"
                        >
                          <IconEdit />
                        </Link>
                        
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className={`p-2 rounded-md transition-colors ${
                            deletingId === item._id 
                              ? 'bg-red-300 text-white' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          title="Hapus"
                        >
                          {deletingId === item._id ? <IconLoading /> : <IconDelete />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}