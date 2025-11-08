/* Path: src/components/home/GalleryPreviewSection.js */
/* Komponen Server Component untuk menampilkan Galeri Terbaru di Homepage */

import Image from 'next/image';
import Link from 'next/link';

// 2. Ambil 3 Item Galeri Terbaru
async function getLatestGallery() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        // Panggil API dengan limit, HANYA AMBIL 3 ITEM
        const res = await fetch(`${baseUrl}/api/gallery?limit=3`, { cache: 'no-store' }); // Limit 3 item

        if (!res.ok) {
            console.error("Gagal mengambil galeri terbaru:", res.status);
            return [];
        }
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("FETCH ERROR (Gallery Home):", error);
        return [];
    }
}

export default async function GalleryPreviewSection() {
    const galleryItems = await getLatestGallery();
    
    if (galleryItems.length === 0) return null;

    return (
        // [MODIFIKASI]: Tambahkan min-h-screen dan flex untuk centering
        <section className="min-h-screen py-20 bg-white flex flex-col justify-center">
            <div className="container mx-auto px-8 max-w-7xl">
                {/* Judul: Meniru style Judul Sponsor (font-extrabold, text-gray-800) */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
                    Our Gallery
                </h2>
                
                {/* [PERBAIKAN 2]: Grid 3 kolom dan menggunakan slice(0, 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {galleryItems.slice(0, 3).map((item) => (
                        <div key={item._id} className="relative w-full rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:shadow-2xl group">
                            {/* Gambar diatur tinggi tetap (h-64) agar proporsional */}
                            <div className="relative w-full h-64"> 
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title || "Foto Galeri"}
                                    layout="fill"
                                    objectFit="cover"
                                    className="group-hover:scale-105 transition duration-500"
                                />
                            </div>
                            {/* Overlay gelap untuk kontras judul */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-100 transition duration-300 p-4">
                                <p className="text-white text-lg font-bold line-clamp-2">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-16">
                    <Link 
                        href="/gallery" 
                        // [PERBAIKAN 3]: Menggunakan warna abu-abu gelap (#515050)
                        className="inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                    >
                        Lihat Semua Galeri
                    </Link>
                </div>
            </div>
        </section>
    );
}        