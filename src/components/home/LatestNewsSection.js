/* Path: src/components/home/LatestNewsSection.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */

import Image from 'next/image';
import Link from 'next/link';

// [PERBAIKAN 1]: Impor Model dan dbConnect
import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';

// [PERBAIKAN 2]: getLatestNews sekarang memanggil DB langsung
async function getLatestNews() {
  try {
    await dbConnect(); // Koneksi langsung ke DB
    
    // Langsung query ke database, (Limit 3 item)
    const items = await NewsItem.find({}).sort({ createdAt: -1 }).limit(3);
    
    // Konversi data Mongoose ke object JSON sederhana
    const plainItems = JSON.parse(JSON.stringify(items));
    return plainItems;

  } catch (error) {
    // Jika ini error, MONGODB_URI di Vercel Anda salah
    console.error("DB ERROR (News Home):", error.message);
    return [];
  }
}


export default async function LatestNewsSection() {
    const newsItems = await getLatestNews();

    if (newsItems.length === 0) return null;

    return (
        /* =============================================
           STRUKTUR FRONTEND (JSX) ANDA DI BAWAH INI
           TIDAK SAYA UBAH SAMA SEKALI
           =============================================
        */
        <section className="min-h-screen py-20 bg-gray-50 flex flex-col justify-center">
            <div className="container mx-auto px-8 max-w-7xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
                    Latest News & Events
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {newsItems.slice(0, 3).map((item) => (
                        <Link 
                            href={`/news/${item._id}`} 
                            key={item._id} 
                            className="block rounded-lg shadow-xl overflow-hidden bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
                        >
                            <div className="relative w-full h-64">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-[#515050] font-semibold mb-2">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </p>
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
                        className="inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                    >
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </section>
    );
}