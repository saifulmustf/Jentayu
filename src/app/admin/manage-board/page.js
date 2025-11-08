/* Path: src/app/admin/manage-board/page.js */
/* Perbaikan: Memastikan 'group' dikirim saat POST */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Save, Trash2, Edit, AlertTriangle, Users, PlusCircle } from 'lucide-react';

export default function ManageBoardPage() {
  const router = useRouter();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State untuk form 'Tambah Baru' ---
  const [positionTitle, setPositionTitle] = useState('');
  const [memberName, setMemberName] = useState('');
  const [order, setOrder] = useState(0);
  const [group, setGroup] = useState('Directors'); // <-- State untuk grup
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  // ------------------------------------

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch('/api/board-members');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        throw new Error(data.error || 'Gagal memuat data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // --- [PERBAIKAN KUNCI DI SINI] ---
  // Memastikan 'group' dikirim dalam body POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFormError("Foto wajib di-upload untuk anggota baru.");
      return;
    }
    
    setSaving(true);
    setFormError(null);
    let imageUrl = '';

    // 1. Upload ke Cloudinary
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
      setFormError(`Gagal upload: ${error.message}`);
      setSaving(false);
      return;
    }

    // 2. Simpan ke Database
    try {
      const resApi = await fetch('/api/board-members', {
        method: 'POST',
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

      // Sukses! Reset form & refresh data
      setPositionTitle('');
      setMemberName('');
      setOrder(0);
      setGroup('Directors'); // Reset ke default
      setFile(null);
      setPreview('');
      fetchMembers(); // Refresh tabel
    } catch (error) {
      setFormError(`Gagal menyimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  // --- [AKHIR PERBAIKAN] ---


  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      return;
    }
    try {
      const res = await fetch(`/api/board-members/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMembers(); // Refresh tabel
      } else {
        setError(data.error || 'Gagal menghapus data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Kolom Kiri: Form Tambah Baru */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tambah Anggota Direksi</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {formError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{formError}</div>
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

          {/* Upload Foto */}
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
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PlusCircle className="w-5 h-5 mr-2" />}
            {saving ? 'Menyimpan...' : 'Tambah Anggota'}
          </button>
        </form>
      </div>

      {/* Kolom Kanan: Daftar Anggota */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Direksi Saat Ini</h2>
        
        {loading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}
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
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={member.memberPhotoUrl} alt={member.memberName} layout="fill" objectFit="cover" unoptimized />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{member.positionTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{member.memberName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                         member.group === 'Directors' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                       }`}>
                        {member.group}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{member.order}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/edit-board-member/${member._id}`} className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-100 transition-colors">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
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