/* Path: src/components/home/GalleryPreviewSection.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */
/* Ditambahkan: AOS Animation */

import Image from 'next/image';
import Link from 'next/link';

// [PERBAIKAN 1]: Impor Model dan dbConnect
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';

// [PERBAIKAN 2]: getLatestGallery sekarang memanggil DB langsung
async function getLatestGallery() {
    try {
        await dbConnect(); // Koneksi langsung ke DB
        
        // [PERBAIKAN 3]: Menggunakan limit(3) sesuai kode asli Anda
        const items = await GalleryItem.find({}).sort({ createdAt: -1 }).limit(3);
        
        const plainItems = JSON.parse(JSON.stringify(items));
        return plainItems;
    } catch (error) {
        // Jika ini error, MONGODB_URI di Vercel Anda salah
        console.error("DB ERROR (Gallery Home):", error.message);
        return [];
    }
}

export default async function GalleryPreviewSection() {
    const galleryItems = await getLatestGallery();
    
    if (galleryItems.length === 0) return null;

    return (
        /* =============================================
           STRUKTUR FRONTEND (JSX) DENGAN AOS ANIMATION
           =============================================
        */
        <section className="min-h-screen py-20 bg-white flex flex-col justify-center">
            <div className="container mx-auto px-8 max-w-7xl">
                {/* Header dengan animasi fade-up */}
                <h2 
                    className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    Our Gallery
                </h2>
                
                {/* Grid Gallery dengan animasi zoom-in bertahap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {galleryItems.slice(0, 3).map((item, index) => (
                        <div 
                            key={item._id} 
                            className="relative w-full rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:shadow-2xl group"
                            data-aos="zoom-in"
                            data-aos-duration="800"
                            data-aos-delay={100 + (index * 150)} // Delay: 100ms, 250ms, 400ms
                        >
                            <div className="relative w-full h-64"> 
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title || "Foto Galeri"}
                                    layout="fill"
                                    objectFit="cover"
                                    className="group-hover:scale-105 transition duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-100 transition duration-300 p-4">
                                <p className="text-white text-lg font-bold line-clamp-2">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Button dengan animasi fade-up */}
                <div 
                    className="text-center mt-16"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="500"
                >
                    <Link 
                        href="/gallery" 
                        className="inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                    >
                        Lihat Semua Galeri
                    </Link>
                </div>
            </div>
        </section>
    );
}