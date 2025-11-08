/* Path: src/components/home/AboutSection.js */
/* Kode UI Anda - Diperbarui dengan Animasi Scroll */

'use client'; // WAJIB: Ubah ke Client Component untuk bisa pakai hook

import React from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer'; // <-- 1. Import hook

export default function AboutSection() {
  
  // 2. Setup hook 'useInView'
  // 'ref' akan kita pasang ke <section> di bawah
  // 'inView' akan menjadi 'true' saat section-nya terlihat
  const { ref, inView } = useInView({
    triggerOnce: true, // Animasi hanya berjalan satu kali
    threshold: 0.2,    // Memicu saat 20% bagian terlihat
  });

  return (
    // 3. Pasang 'ref' di sini
    <section 
      ref={ref} 
      className="min-h-screen flex items-center justify-center bg-gray-100 py-16 px-4 overflow-hidden" // Tambahkan overflow-hidden
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
        
        {/* Kolom Gambar (Animasi #1: Slide dari Kiri) */}
        <div 
          className={`w-full md:w-1/3 flex-shrink-0 transition-all duration-700 ease-out
            ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
          `}
        >
          <div className="aspect-square bg-gray-300 flex items-center justify-center rounded-lg shadow-lg">
            <img src="/images/Home.png" alt="Jentayu Team" className="object-cover w-full h-full rounded-lg" />
          </div>
        </div>

        {/* Kolom Teks (Animasi #2: Slide dari Kanan) */}
        <div 
          className={`w-full md:w-1/2 text-center md:text-left transition-all duration-700 ease-out delay-200
            ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
          `}
        >
          <h2 className="text-5xl font-extrabold mb-4 text-gray-700">
            About Us
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This team was formed with a focus on innovation and breakthroughs
            in aeromodeling by developing efficiently designed UAVs. Operating
            within the rules of the competition is the community's goal.
          </p>
          <Link
            href="/profile/about-us"
            className="inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}