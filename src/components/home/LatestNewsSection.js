/* Path: src/components/home/LatestNewsSection.js */
/* Komponen Server Component untuk menampilkan Berita Terbaru di Homepage */

import Image from 'next/image';
import Link from 'next/link';

// 1. Ambil 3 Berita Terbaru
async function getLatestNews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news?limit=3`, { cache: 'no-store' }); // Limit 3 item

    if (!res.ok) {
      console.error("Gagal mengambil berita terbaru:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("FETCH ERROR (News Home):", error);
    return [];
  }
}


export default async function LatestNewsSection() {
    const newsItems = await getLatestNews();

    if (newsItems.length === 0) return null;

    return (
        // [MODIFIKASI]: Tambahkan min-h-screen dan flex untuk centering
        <section className="min-h-screen py-20 bg-gray-50 flex flex-col justify-center">
            <div className="container mx-auto px-8 max-w-7xl">
                {/* Meniru style Judul Sponsor: font-extrabold */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
                    Latest News & Events
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Memastikan hanya 3 item yang tampil */}
                    {newsItems.slice(0, 3).map((item) => (
                        <Link 
                            href={`/news/${item._id}`} 
                            key={item._id} 
                            // [MODIFIKASI]: Kartu Berita sekarang menggunakan BG PUTIH dengan shadow
                            className="block rounded-lg shadow-xl overflow-hidden bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
                        >
                            {/* Gambar diperbesar menjadi h-64 agar proporsional */}
                            <div className="relative w-full h-64">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="p-6">
                                {/* Font dan warna sesuai tema */}
                                <p className="text-sm text-[#515050] font-semibold mb-2">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </p>
                                {/* Judul utama menggunakan font-bold */}
                                <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-3 text-sm">
                                    {item.content}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-16">
                    <Link 
                        href="/news" 
                        // Menggunakan warna abu-abu gelap (#515050)
                        className="inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                    >
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </section>
    );
}