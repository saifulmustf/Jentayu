/* Path: src/app/admin/edit-team-info/[teamId]/page.js */
/* Perbaikan: Menambahkan 'Link' dan pesan error yang lebih baik */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // <-- PERBAIKAN: Import Link
import { Upload, Loader2, Save, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function EditTeamInfoPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId;

  const [team, setTeam] = useState(null);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [fetchError, setFetchError] = useState(null); // State error baru

  // 1. Fetch data tim yang ada
  useEffect(() => {
    if (teamId) {
      setLoading(true);
      setFetchError(null); // Reset error setiap kali teamId berubah
      fetch(`/api/sub-teams/${teamId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTeam(data.data);
            setDescription(data.data.description);
            setOldImageUrl(data.data.mainImageUrl);
            setPreview(data.data.mainImageUrl);
          } else {
            // Simpan pesan error dari API
            setFetchError(data.error || 'Gagal memuat data tim. Tim tidak ditemukan.');
          }
          setLoading(false);
        })
        .catch(err => {
          setFetchError(`Error koneksi: ${err.message}`);
          setLoading(false);
        });
    }
  }, [teamId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let imageUrl = oldImageUrl; 

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
        
        if (!dataCloudinary.secure_url) {
          throw new Error(dataCloudinary.error?.message || 'Gagal upload ke Cloudinary.');
        }
        imageUrl = dataCloudinary.secure_url;
      } catch (error) {
        setMessage({ type: 'error', text: `Gagal upload: ${error.message}` });
        setSaving(false);
        return;
      }
    }

    try {
      const resApi = await fetch(`/api/sub-teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description,
          mainImageUrl: imageUrl,
        }),
      });

      const dataApi = await resApi.json();
      if (!dataApi.success) {
        throw new Error(dataApi.error || 'Gagal menyimpan data ke API.');
      }
      
      setMessage({ type: 'success', text: 'Info tim berhasil diperbarui!' });
      setOldImageUrl(imageUrl);
      setFile(null);
      setTimeout(() => {
        router.push('/admin/manage-sub-teams');
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
        <p className="ml-4 text-lg text-gray-600">Memuat data tim...</p>
      </div>
    );
  }

  // --- INI PESAN ERROR YANG SUDAH DIPERBAIKI ---
  if (fetchError) {
    return (
      <div className="flex items-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 mr-4 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold mb-2">Tim Tidak Ditemukan</h3>
          <p className="text-sm">Pesan error: <span className="font-mono bg-red-200 px-1 rounded">{fetchError}</span></p>
          <p className="mt-4 text-sm text-red-600">
            <strong>Tips:</strong> Ini mungkin terjadi karena database belum "di-seed".
            Silakan <Link href="/admin/manage-sub-teams" className="font-bold underline">klik di sini untuk kembali ke halaman 'Kelola Sub Tim'</Link> terlebih dahulu untuk membuat tim default.
          </p>
        </div>
      </div>
    );
  }
  // ------------------------------------

  if (!team) {
     return <div className="text-red-500 text-center">Terjadi kesalahan. Data tim tidak bisa dimuat.</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/manage-sub-teams" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Kelola Sub Tim
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Info Tim: <span className="text-indigo-600">{team.title}</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        
        {message && (
          <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Tim
          </label>
          <textarea
            id="description"
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto Utama Tim
          </label>
          {preview && (
            <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Preview Foto Tim"
                layout="fill"
                objectFit="cover"
                onError={(e) => e.currentTarget.src = 'https://placehold.co/800x400/e2e8f0/64748b?text=Preview'}
                unoptimized
              />
            </div>
          )}
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengganti foto utama.</p>
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            className="inline-flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
}