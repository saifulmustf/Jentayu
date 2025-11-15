/* Path: src/components/home/SponsorSection.js */
/* Perbaikan: Menghapus 'fetch' dan memanggil DB langsung */
/* Ditambahkan: AOS Animation */

import Image from 'next/image';

// [PERBAIKAN 1]: Impor Model dan dbConnect
import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';

// [PERBAIKAN 2]: getSponsors sekarang memanggil DB langsung
async function getSponsors() {
  try {
    await dbConnect(); // Koneksi langsung ke DB
    
    // Langsung query ke database
    const items = await SponsorItem.find({}).sort({ createdAt: 'asc' });
    
    // Konversi data Mongoose ke object JSON sederhana
    const plainItems = JSON.parse(JSON.stringify(items));
    return plainItems;

  } catch (error) {
    // Jika ini error, MONGODB_URI di Vercel Anda salah
    console.error("DB ERROR (Sponsor Home):", error.message);
    return [];
  }
}


// Komponen Utama (Server Component)
export default async function SponsorSection() {
  const sponsors = await getSponsors();

  return (
    /* =============================================
       STRUKTUR FRONTEND (JSX) DENGAN AOS ANIMATION
       =============================================
    */
    <section className="min-h-screen px-8 text-center bg-gray-100 flex flex-col justify-center items-center py-20">
      <div className="container mx-auto">
        {/* Header dengan animasi fade-up */}
        <h2 
          className="text-5xl font-extrabold mb-4 text-gray-800"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Our Sponsored
        </h2>
        <p 
          className="text-xl mb-16 text-gray-500"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          We are proud to collaborate with our valued partners.
        </p>
        
        {sponsors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>Belum ada sponsor yang ditambahkan.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-12 gap-y-8 items-center max-w-6xl mx-auto mt-8">
              {Array(7).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className="flex justify-center items-center h-32 w-40 mx-auto"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={50 * index}
                > 
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-12 gap-y-8 items-center max-w-6xl mx-auto">
            {sponsors.map((sponsor, index) => (
                <div 
                  key={sponsor._id} 
                  className="flex justify-center items-center h-32 w-40 p-2 mx-auto"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={50 * index} // Delay bertahap: 0ms, 50ms, 100ms, 150ms, dst
                >
                    <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        width={180}
                        height={96}
                        className="grayscale opacity-75 transition duration-300 hover:grayscale-0 hover:opacity-100"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}