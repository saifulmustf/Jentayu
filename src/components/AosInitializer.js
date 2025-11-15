/* Path: src/components/AosInitializer.js */
/* Komponen ini HANYA untuk memuat AOS satu kali */

'use client'; // Wajib 'use client' untuk useEffect

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // <-- Import CSS wajib untuk AOS

export default function AosInitializer() {
  
  // Gunakan useEffect untuk memastikan AOS.init()
  // hanya berjalan di sisi klien (browser)
  useEffect(() => {
    AOS.init({
      duration: 750, // Durasi animasi (dalam ms)
      once: true,      // Animasi hanya berjalan satu kali
      offset: 100,     // Memicu animasi 100px sebelum section terlihat
    });
  }, []); // Array kosong berarti ini hanya berjalan sekali

  return null; // Komponen ini tidak me-render HTML apapun
}