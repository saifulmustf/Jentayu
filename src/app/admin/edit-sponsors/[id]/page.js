/* Path: src/app/admin/edit-sponsors/[id]/page.js */
/* Halaman untuk mengedit sponsor yang sudah ada */
'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image'; // <-- PERBAIKAN: Import Image

// Komponen Loading Sederhana
const Spinner = () => (
  <div className="border-4 border-gray-300 border-t-indigo-600 rounded-full w-6 h-6 animate-spin"></div>
);

export default function EditSponsorPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; 

  // State untuk form
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [oldLogoUrl, setOldLogoUrl] = useState(''); 

  // State untuk UI
  const [loadingPage, setLoadingPage] = useState(true); 
  const [loadingSubmit, setLoadingSubmit] = useState(false); 
  const [message, setMessage] = useState(null);

  // 1. Ambil data sponsor yang ada saat halaman dimuat
  useEffect(() => {
    if (!id) return;

    const fetchSponsorData = async () => {
      try {
        const res = await fetch(`/api/sponsors/${id}`); 
        const data = await res.json();

        if (data.success) {
          setName(data.data.name);
          setOldLogoUrl(data.data.logoUrl); 
        } else {
          setMessage({ type: 'error', text: data.error });
        }
      } catch (error) {
        setMessage({ type: 'error', text: `Gagal mengambil data: ${error.message}` });
      } finally {
        setLoadingPage(false);
      }
    };

    fetchSponsorData();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 2. Fungsi saat tombol 'Simpan Perubahan' diklik
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setMessage({ type: 'error', text: 'Nama sponsor tidak boleh kosong!' });
      return;
    }

    setLoadingSubmit(true);
    setMessage(null);

    let logoUrl = oldLogoUrl; // Default pakai logo lama

    try {
      // --- LANGKAH 1: UPLOAD LOGO BARU JIKA ADA ---
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const dataCloudinary = await resCloudinary.json();

        if (!dataCloudinary.secure_url) {
          throw new Error(dataCloudinary.error?.message || 'Gagal upload ke Cloudinary.');
        }
        logoUrl = dataCloudinary.secure_url; 
      }

      // --- LANGKAH 2: SIMPAN PERUBAHAN KE DATABASE KITA ---
      const resApi = await fetch(`/api/sponsors/${id}`, { 
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          logoUrl: logoUrl, // Kirim URL baru atau lama
        }),
      });

      const dataApi = await resApi.json();

      if (!dataApi.success) {
        throw new Error(dataApi.error || 'Terjadi kesalahan saat menyimpan ke DB');
      }

      // --- SUKSES TOTAL ---
      setMessage({ type: 'success', text: 'Sponsor berhasil diperbarui!' });

      setTimeout(() => {
        router.push('/admin/manage-sponsors'); // Redirect ke halaman kelola sponsor
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: `Gagal: ${error.message}` });
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2 text-gray-700">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Sponsor</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama Sponsor
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loadingSubmit}
          />
        </div>

        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
            Ganti Logo (Opsional)
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
            disabled={loadingSubmit}
          />
          {oldLogoUrl && !file && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Logo saat ini:</p>
              {/* PERBAIKAN: Menggunakan komponen Image */}
              <div className="relative w-40 h-20 mt-1 border rounded-md p-2">
                <Image 
                  src={oldLogoUrl} 
                  alt="Preview Logo Lama" 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
            </div>
          )}
          {file && (
             <div className="mt-2 text-sm text-indigo-600">Logo baru akan di-upload.</div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loadingSubmit ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center`}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? <Spinner /> : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}