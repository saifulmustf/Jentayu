/* Path: src/app/admin/manage-team-members/[teamId]/page.js */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';

function Spinner() {
  return <div className="border-2 border-gray-200 border-t-indigo-600 rounded-full w-5 h-5 animate-spin"></div>;
}

export default function ManageTeamMembersPage() {
  const router = useRouter();
  const params = useParams(); // { teamId: 'racing-plane' }
  const { teamId } = params;
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // State untuk form (Tambah & Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [positionTitle, setPositionTitle] = useState('');
  const [memberName, setMemberName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Ambil data anggota tim
  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/team-members?teamId=${teamId}`);
      if (!res.ok) throw new Error('Gagal mengambil data anggota');
      const data = await res.json();
      setMembers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (teamId) {
      fetchMembers();
    }
  }, [teamId]);

  // Fungsi untuk reset form
  const resetForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentMemberId(null);
    setPositionTitle('');
    setMemberName('');
    setSubmitting(false);
  };

  // Buka form untuk TAMBAH
  const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Buka form untuk EDIT
  const handleEdit = (member) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setCurrentMemberId(member._id);
    setPositionTitle(member.positionTitle);
    setMemberName(member.memberName);
  };

  // Hapus anggota
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota/jabatan ini?')) return;
    
    try {
      const res = await fetch(`/api/team-members/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setMessage({ type: 'success', text: 'Anggota berhasil dihapus.' });
      fetchMembers(); // Ambil ulang data
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // Submit form (Tambah atau Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const url = isEditing 
      ? `/api/team-members/${currentMemberId}` 
      : '/api/team-members';
    
    const method = isEditing ? 'PUT' : 'POST';

    const body = JSON.stringify({
      teamId: teamId, // Wajib untuk POST
      positionTitle,
      memberName,
    });

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setMessage({ type: 'success', text: `Anggota berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.` });
      resetForm();
      fetchMembers(); // Ambil ulang data

    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Mengambil judul tim (cth: "RACING PLANE") dari teamId
  const teamTitle = teamId?.replace(/-/g, ' ').toUpperCase() || 'Tim';

  return (
    <div className="p-8">
      <button
        onClick={() => router.push('/admin/manage-sub-teams')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Kelola Tim
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Anggota Tim</h1>
          <h2 className="text-2xl font-semibold text-indigo-600">{teamTitle}</h2>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleAdd}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Anggota/Jabatan
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* --- FORM TAMBAH/EDIT --- */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{isEditing ? 'Edit Anggota/Jabatan' : 'Tambah Anggota/Jabatan Baru'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="positionTitle" className="block text-sm font-medium text-gray-700">Jabatan</label>
              <input
                type="text"
                id="positionTitle"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium text-gray-700">Nama Anggota</label>
              <input
                type="text"
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 flex justify-center items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? <Spinner /> : <Save className="w-5 h-5 mr-2" />}
              {submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Anggota Baru')}
            </button>
          </form>
        </div>
      )}

      {/* --- TABEL DAFTAR ANGGOTA --- */}
      {loading && <div className="flex justify-center"><Spinner /></div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
      
      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anggota</th>
                <th scope="col" className="relative px-6 py-3 w-32">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length > 0 ? members.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{member.positionTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{member.memberName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(member)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Belum ada anggota di tim ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}