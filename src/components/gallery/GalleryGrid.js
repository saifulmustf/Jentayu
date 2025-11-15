/* Path: src/components/gallery/GalleryGrid.js */
/*
  Perbaikan:
  1. Menggunakan 2 kolom layout (md:grid-cols-2)
  2. Ditambahkan AOS Animation - setiap 2 foto muncul bersamaan
*/

'use client'; 

import Image from 'next/image'; 

export default function GalleryGrid({ items }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {items.map((item, index) => {
        // Hitung delay: setiap 2 foto (index 0-1, 2-3, 4-5, dst) punya delay yang sama
        // index 0,1 = delay 0ms
        // index 2,3 = delay 150ms
        // index 4,5 = delay 300ms
        const pairIndex = Math.floor(index / 2); // 0,0,1,1,2,2,3,3...
        const delay = pairIndex * 150;
        
        return (
          <div 
            key={item._id}
            data-aos="zoom-in"
            data-aos-duration="600"
            data-aos-delay={delay}
          >
            {/* Menggunakan 'aspect-video' (persegi panjang) dan 'bg-gray-200' */}
            <div className="relative aspect-video bg-gray-200 rounded-lg shadow-md overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title || "Foto Galeri"}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}