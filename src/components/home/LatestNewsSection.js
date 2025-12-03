/* Path: src/components/home/LatestNewsSection.js */
/* FIX: Menggunakan 'unstable_noStore' agar Homepage selalu menampilkan berita terbaru */

import Image from 'next/image';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache'; // <-- 1. IMPORT PENTING

import dbConnect from '@/lib/dbConnect';
import NewsItem from '@/models/NewsItem';

async function getLatestNews() {
  // 2. PASTI CACHE DIMATIKAN
  // Fungsi ini memerintahkan Next.js untuk tidak men-cache hasil query ini secara statis.
  // Setiap kali Homepage dibuka, dia akan cek DB lagi.
  noStore(); 

  try {
    await dbConnect(); 
    
    // Ambil 3 berita terbaru
    const items = await NewsItem.find({}).sort({ createdAt: -1 }).limit(3);
    
    const plainItems = JSON.parse(JSON.stringify(items));
    return plainItems;

  } catch (error) {
    console.error("DB ERROR (News Home):", error.message);
    return [];
  }
}

export default async function LatestNewsSection() {
    const newsItems = await getLatestNews();

    if (newsItems.length === 0) return null;

    return (
        <section className="min-h-screen py-20 bg-gray-50 flex flex-col justify-start items-center pt-24">
            <div className="container mx-auto px-8 max-w-7xl">
                {/* Header */}
                <h2 
                    className="text-4xl md:text-6xl font-extrabold text-center text-gray-800 "
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    Latest News & Events
                </h2>
                <p 
                    className="text-xl text-gray-500 text-center mb-12"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="100"
                >
                    The Future, Unfolding Now!
                </p>

                {/* Grid News Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {newsItems.slice(0, 3).map((item, index) => (
                        <Link 
                            href={`/news/${item._id}`} 
                            key={item._id} 
                            className="block rounded-lg shadow-xl overflow-hidden bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay={100 + (index * 150)}
                        >
                            <div className="relative w-full h-80">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            
                            <div className="p-8">
                                <p className="text-base text-[#515050] font-semibold mb-3">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </p>
                                
                                <h3 className="text-2xl font-bold text-gray-800 line-clamp-2 mb-3">
                                    {item.title}
                                </h3>
                                
                                <p className="text-gray-600 line-clamp-4 text-base">
                                    {item.content}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Button */}
                <div 
                    className="text-center mt-16"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="500"
                >
                    <Link 
                        href="/news" 
                        className="inline-block bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                        style={{ backgroundColor: '#000D81' }}
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
}