/* Path: src/components/gallery/GalleryGrid.js */
/*
  Perbaikan:
  1. Mengganti layout grid dari 3 kolom ('lg:grid-cols-3') 
     menjadi 2 kolom ('md:grid-cols-2') agar foto lebih besar.
*/

'use client'; 

import Image from 'next/image'; 

export default function GalleryGrid({ items }) {

  // Animasi fade-in (tetap dipertahankan)
  const animationStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .gallery-item {
      animation: fadeIn 0.5s ease-out forwards;
      opacity: 0;
    }
  `;

  return (
    <>
      <style jsx>{animationStyle}</style>

      {/* [PERBAIKAN]: Mengganti 'sm:grid-cols-2 lg:grid-cols-3' menjadi 'md:grid-cols-2' */}
      {/* Ini berarti: 1 kolom di mobile, 2 kolom di tablet dan desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {items.map((item, index) => (
          <div 
            key={item._id} 
            className="gallery-item" // Class untuk animasi
            style={{ animationDelay: `${index * 100}ms` }} 
          >
            {/* Menggunakan 'aspect-video' (persegi panjang) dan 'bg-gray-200' */}
            <div className="relative aspect-video bg-gray-200 rounded-lg shadow-md overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title || "Foto Galeri"}
                layout="fill"
                objectFit="cover" // Mengisi kotak
              />
            </div>

            {/* Judul dan overlay hover telah dihapus sesuai permintaan */}
            
          </div>
        ))}
      </div>
    </>
  );
}