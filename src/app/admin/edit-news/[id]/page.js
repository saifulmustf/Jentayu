/* Path: src/app/admin/edit-news/[id]/page.js */
/* FILE INI MENGIRIM PERMINTAAN PUT */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Komponen Loading Sederhana
const Spinner = () => (
  <div className="border-4 border-gray-300 border-t-indigo-600 rounded-full w-6 h-6 animate-spin"></div>
);

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Ambil ID dari URL

  // State untuk form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(''); // Untuk menyimpan URL gambar lama

  // State untuk UI
  const [loadingPage, setLoadingPage] = useState(true); // Loading saat ambil data
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading saat submit
  const [message, setMessage] = useState(null);

  // 1. Ambil data berita yang ada saat halaman dimuat
  useEffect(() => {
    if (!id) return;

    const fetchNewsData = async () => {
      try {
        // PERIKSA: Ini memanggil GET /api/news/[id]
        const res = await fetch(`/api/news/${id}`); 
        const data = await res.json();

        if (data.success) {
          setTitle(data.data.title);
          setContent(data.data.content);
          setOldImageUrl(data.data.imageUrl); // Simpan URL lama
        } else {
          setMessage({ type: 'error', text: data.error });
        }
      } catch (error) {
        setMessage({ type: 'error', text: `Gagal mengambil data: ${error.message}` });
      } finally {
        setLoadingPage(false);
      }
    };

    fetchNewsData();
  }, [id]); // Jalankan setiap kali 'id' berubah

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 2. Fungsi saat tombol 'Simpan Perubahan' diklik
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setMessage({ type: 'error', text: 'Judul dan Konten tidak boleh kosong!' });
      return;
    }

    setLoadingSubmit(true);
    setMessage(null);

    let imageUrl = oldImageUrl; // Default pakai gambar lama

    try {
      // --- LANGKAH 1: UPLOAD GAMBAR BARU JIKA ADA ---
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
        imageUrl = dataCloudinary.secure_url; 
      }

      // --- LANGKAH 2: SIMPAN PERUBAHAN KE DATABASE KITA ---
      // PERIKSA: Ini memanggil PUT /api/news/[id]
      const resApi = await fetch(`/api/news/${id}`, { 
        method: 'PUT', // PASTIKAN METHOD INI BENAR
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
          imageUrl: imageUrl, 
        }),
      });

      const dataApi = await resApi.json();

      if (!dataApi.success) {
        // Jika API mengembalikan 405, dataApi.success akan false
        throw new Error(dataApi.error || 'Terjadi kesalahan saat menyimpan ke DB');
      }

      // --- SUKSES TOTAL ---
      setMessage({ type: 'success', text: 'Berita berhasil diperbarui!' });

      setTimeout(() => {
        router.push('/admin/manage-news');
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Berita</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Judul Berita
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loadingSubmit}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Konten Berita
          </label>
          <textarea
            id="content"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loadingSubmit}
          />
        </div>

        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
            Ganti Gambar (Opsional)
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
          {oldImageUrl && !file && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Gambar saat ini:</p>
              <img src={oldImageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md mt-1" />
            </div>
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