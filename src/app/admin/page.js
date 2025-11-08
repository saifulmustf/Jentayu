/* Path: src/app/admin/page.js */
/* Ini adalah halaman 'Dashboard' BARU Anda. 
   (File lama sudah Anda pindahkan ke 'add-gallery/page.js')
*/

export default function AdminDashboardPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Selamat Datang di Admin Panel
      </h1>
      <p className="text-gray-600">
        Silakan gunakan menu di sebelah kiri untuk mengelola konten website Anda.
      </p>
    </div>
  );
}