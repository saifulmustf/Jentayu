/* Path: src/components/common/ImageWithFallback.js */
/* Ini adalah Client Component pembungkus untuk menangani onError */

'use client'; // <-- Menandakan ini adalah Client Component

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback(props) {
  const { src, fallbackSrc, ...rest } = props;
  
  // State untuk menyimpan URL gambar yang sedang aktif
  const [imgSrc, setImgSrc] = useState(src);

  // Jika 'src' (dari database) berubah, reset state kita
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest} // <-- Meneruskan semua prop lain (layout, objectFit, priority, unoptimized, alt)
      src={imgSrc} // <-- Gunakan 'imgSrc' dari state
      
      // 'onError' diizinkan di sini karena ini adalah Client Component
      onError={() => {
        // Jika gambar 'src' gagal dimuat, ganti state ke 'fallbackSrc'
        setImgSrc(fallbackSrc);
      }}
    />
  );
}