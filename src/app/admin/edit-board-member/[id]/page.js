/* Path: src/app/admin/edit-board-member/[id]/page.js */
/* Perbaikan: Memastikan 'group' dikirim saat PUT */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Upload, Loader2, Save, ArrowLeft } from 'lucide-react';

export default function EditBoardMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [positionTitle, setPositionTitle] = useState('');
  const [memberName, setMemberName] = useState('');
  const [order, setOrder] = useState(0);
  const [group, setGroup] = useState('Directors'); // <-- State 'group'
  const [file, setFile] = useState(null);
  const [oldPhotoUrl, setOldPhotoUrl] = useState('');
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. Fetch data anggota yang ada
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/board-members/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const member = data.data;
            setPositionTitle(member.positionTitle);
            setMemberName(member.memberName);
            setOrder(member.order);
            setGroup(member.group); // <-- Set state 'group'
            setOldPhotoUrl(member.memberPhotoUrl);
            setPreview(member.memberPhotoUrl);
          } else {
            setMessage({ type: 'error', text: data.error || 'Gagal memuat data anggota.' });
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

  // --- [PERBAIKAN KUNCI DI SINI] ---
  // Memastikan 'group' dikirim dalam body PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let imageUrl = oldPhotoUrl;

    // 2.A. Jika ada file BARU, upload ke Cloudinary
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

    // 2.B. Simpan data ke database kita
    try {
      const resApi = await fetch(`/api/board-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionTitle,
          memberName,
          memberPhotoUrl: imageUrl,
          order,
          group // <-- PASTIKAN FIELD INI ADA
        }),
      });

      const dataApi = await resApi.json();
       if (!dataApi.success) {
        // Menampilkan error validasi dari server (jika ada)
        if (dataApi.errors) {
          const errorMsg = Object.values(dataApi.errors).join(', ');
          throw new Error(errorMsg);
        }
        throw new Error(dataApi.error || 'Gagal menyimpan data ke API.');
      }
      
      setMessage({ type: 'success', text: 'Anggota berhasil diperbarui!' });
      setOldPhotoUrl(imageUrl);
      setFile(null);
      
      setTimeout(() => {
        router.push('/admin/manage-board');
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: `Gagal menyimpan: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };
  // --- [AKHIR PERBAIKAN] ---


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/manage-board" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Kelola Direksi
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Anggota Direksi
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        
        {message && (
          <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">Jabatan</label>
          <input
            type="text" id="position" value={positionTitle}
            onChange={(e) => setPositionTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Anggota</label>
          <input
            type="text" id="name" value={memberName}
            onChange={(e) => setMemberName(e.target.value)} 
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">Urutan</label>
            <input
              type="number" id="order" value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {/* Input 'group' */}
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700">Grup</label>
            <select
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Directors">Directors</option>
              <option value="Non-Technical">Non-Technical</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Foto Anggota</label>
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