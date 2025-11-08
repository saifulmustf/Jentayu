/* Path: src/components/common/Footer.js */
/* Modifikasi: Menyamakan warna biru Copyright (Hex Code) */

import React from 'react';
import Image from 'next/image';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiYoutube } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-100">
      
      {/* Konten Utama Footer (dibatasi container) */}
      <div className="container mx-auto px-8 py-16">
        {/* Menggunakan struktur 3 kolom yang seimbang */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          {/* Kolom 1: Peta */}
          <div className="w-full h-64 bg-gray-300 rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.643398321682!2d110.4363293758925!3d-7.051939569088645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708c1c73a2162d%3A0xc0233496929c11a7!2sStudent%20Center%20Universitas%20Diponegoro!5e0!3m2!1sen!2sid!4v1726258759560!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Kolom 2: Contact Us */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <div className="flex items-start gap-4 mb-4">
              <FiMapPin size={24} className="mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Student Center Universitas Diponegoro</p>
                <p className="text-sm leading-relaxed">
                  Jl. Prof. Soedarto S.H, Tembalang, Kec. Tembalang, <br />
                  Kota Semarang, Jawa Tengah, 50275
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <FiPhone size={20} className="text-gray-500" />
              <p>+62-822-2528-3769</p>
            </div>
            <div className="flex items-center gap-4">
              <FiMail size={20} className="text-gray-500" />
              <p>undip.jentayuteam@gmail.com</p>
            </div>
          </div>

          {/* Kolom 3: Sosial Media */}
          <div className="flex flex-col space-y-4 md:pl-8">
            <a href="https://instagram.com/undipjentayu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg hover:text-gray-900 transition-colors">
              <FiInstagram size={24} />
              <span>undipjentayu</span>
            </a>
            <a href="https://youtube.com/@jentayuuundip7239" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg hover:text-gray-900 transition-colors">
              <FiYoutube size={24} />
              <span>jentayuuundip7239</span>
            </a>
            <a href="https://tiktok.com/@jentayu.undip" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg hover:text-gray-900 transition-colors">
              <FaTiktok size={24} />
              <span>jentayu.undip</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bagian Bawah Footer (Copyright) */}
      {/* [MODIFIKASI] Diubah ke bg-[#000D81] agar sama dengan Navbar Anda */}
      <div className="w-full bg-[#000D81] py-4 text-center text-sm text-white">
        Copyright © Jentayu | {new Date().getFullYear()}
      </div>
    </footer>
  );
}