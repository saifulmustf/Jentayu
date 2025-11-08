/* Path: src/app/admin/edit-achievement/[id]/page.js */
/* Modifikasi: Menambahkan input 'year' dan perbaikan bug Uncontrolled Input */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Upload, Loader2, Save, ArrowLeft } from 'lucide-react';

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // --- [MODIFIKASI] State ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear()); // <-- Fallback ke tahun ini
  const [file, setFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  // -------------------------
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. Fetch data yang ada
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/achievements/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const item = data.data;
            setTitle(item.title);
            setDescription(item.description);
            // [PERBAIKAN BUG] Pastikan nilai yang disetel adalah angka (bukan null/undefined)
            setYear(Number(item.year || new Date().getFullYear())); 
            setOldImageUrl(item.imageUrl);
            setPreview(item.imageUrl);
          } else {
            setMessage({ type: 'error', text: data.error || 'Gagal memuat data.' });
          }
          setLoading(false);
        })
        .catch(err => {
          setMessage({ type: 'error', text: `Error: ${err.message}` });
          setLoading(false);
        });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 2. Handle Simpan Perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let imageUrl = oldImageUrl; 

    // 2.A. Upload foto baru jika ada
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const dataCloudinary = await resCloudinary.json();
        if (!dataCloudinary.secure_url) throw new Error(dataCloudinary.error?.message || 'Gagal upload.');
        imageUrl = dataCloudinary.secure_url;
      } catch (error) {
        setMessage({ type: 'error', text: `Gagal upload: ${error.message}` });
        setSaving(false);
        return;
      }
    }

    // 2.B. Simpan ke database
    try {
      const resApi = await fetch(`/api/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          year // <-- Data baru
        }),
      });

      const dataApi = await resApi.json();
      if (!dataApi.success) {
        if (dataApi.errors) {
          const errorMsg = Object.values(dataApi.errors).join(', ');
          throw new Error(errorMsg);
        }
        throw new Error(dataApi.error || 'Gagal menyimpan data ke API.');
      }
      
      setMessage({ type: 'success', text: 'Achievement berhasil diperbarui!' });
      setOldImageUrl(imageUrl); 
      setFile(null);
      
      setTimeout(() => {
        router.push('/admin/manage-achievements');
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: `Gagal menyimpan: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/manage-achievements" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Kelola Achievements
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Achievement
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        
        {message && (
          <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* --- Judul & Tahun dalam 1 baris --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Achievement</label>
            <input
              type="text" id="title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Tahun</label>
            <input
              type="number" id="year" value={year}
              placeholder="Contoh: 2024"
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        {/* ----------------------------------------------- */}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
          <textarea
            id="description"
            rows="4"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Foto/Gambar</label>
          {preview && (
            <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border">
              <Image src={preview} alt="Preview" layout="fill" objectFit="cover" unoptimized />
            </div>
          )}
          <input
            type="file" accept="image/*" onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
          <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengganti foto.</p>
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            className="inline-flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}