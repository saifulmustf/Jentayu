/* Path: src/app/contact/page.js */
'use client'; // <-- Karena kita akan menggunakan form (useState)

import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiYoutube } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

export default function ContactUsPage() {
  
  // State untuk form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '...' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setIsSubmitting(true);
    setStatus(null);

    // --- [SIMULASI PENGIRIMAN] ---
    // Di aplikasi nyata, di sinilah Anda akan memanggil API
    // untuk mengirim email (Nodemailer, SendGrid, dll.)
    
    // Kita akan berpura-pura sukses setelah 2 detik
    await new Promise(resolve => setTimeout(resolve, 1500));

    // PENTING: Ganti ini dengan pesan error/info
    setStatus({ 
      type: 'info', 
      text: 'Fitur ini masih dalam tahap pengembangan. Silakan hubungi kami via email langsung.' 
    });
    
    // Reset form jika (misalnya) sukses
    // setName('');
    // setEmail('');
    // setMessage('');
    // setStatus({ type: 'success', text: 'Pesan Anda telah terkirim!' });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION (Banner) */}
      <section 
        className="relative py-48 px-8 text-center text-white bg-cover bg-center"
        // Ganti gambar ini dengan gambar hero untuk Kontak
        style={{ backgroundImage: "url('/contact-hero.png')" }} 
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay gelap */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">CONTACT US</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Kami siap mendengar dari Anda.
          </p>
        </div>
      </section>

      {/* 2. KONTEN UTAMA (Info & Form) */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            
            {/* Kolom Kiri: Info Kontak (Diambil dari Footer) */}
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Informasi Kontak</h2>
              
              {/* Alamat */}
              <div className="flex items-start gap-4 mb-6">
                <FiMapPin size={24} className="mt-1 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Alamat</h3>
                  <p className="font-semibold text-gray-700">Student Center Universitas Diponegoro</p>
                  <p className="text-md leading-relaxed text-gray-600">
                    Jl. Prof. Soedarto S.H, Tembalang, Kec. Tembalang, <br />
                    Kota Semarang, Jawa Tengah, 50275
                  </p>
                </div>
              </div>
              
              {/* Telepon */}
              <div className="flex items-center gap-4 mb-6">
                <FiPhone size={20} className="text-indigo-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Telepon</h3>
                  <p className="text-md text-gray-600">+62-822-2528-3769</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 mb-10">
                <FiMail size={20} className="text-indigo-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Email</h3>
                  <p className="text-md text-gray-600">undip.jentayuteam@gmail.com</p>
                </div>
              </div>
              
              {/* Sosial Media */}
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Ikuti Kami</h3>
              <div className="flex flex-col space-y-8">
                <a href="https://instagram.com/undipjentayu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg text-gray-700 hover:text-indigo-600 transition-colors">
                  <FiInstagram size={24} /> <span>undipjentayu</span>
                </a>
                <a href="https://youtube.com/@jentayuuundip7239" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg text-gray-700 hover:text-indigo-600 transition-colors">
                  <FiYoutube size={24} /> <span>jentayuuundip7239</span>
                </a>
                <a href="https://tiktok.com/@jentayu.undip" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg text-gray-700 hover:text-indigo-600 transition-colors">
                  <FaTiktok size={24} /> <span>jentayu.undip</span>
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Formulir Kontak */}
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Kirim Pesan</h2>

              {status && (
                <div className={`p-4 mb-4 rounded-md text-sm ${
                  status.type === 'success' ? 'bg-green-100 text-green-700' : 
                  status.type === 'error' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700' // Tipe 'info'
                }`}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Anda</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Anda</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Pesan */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Tombol Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 flex justify-center items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      'Kirim Pesan'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}