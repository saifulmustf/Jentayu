/* Path: src/components/home/SponsorSection.js */
/* KODE DINAMIS: Mengambil data sponsor dari API */

import Image from 'next/image';

// Fungsi untuk mengambil data sponsor di server
async function getSponsors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/sponsors`, { 
      cache: 'no-store' // Selalu ambil data terbaru
    });

    if (!res.ok) {
      console.error("Gagal mengambil data sponsor:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || []; 
  } catch (error) {
    console.error("FETCH ERROR (Sponsor Home):", error);
    return [];
  }
}


// Komponen Utama (Server Component)
export default async function SponsorSection() {
  const sponsors = await getSponsors();

  return (
    <section className="min-h-screen px-8 text-center bg-gray-100 flex flex-col justify-center items-center py-20">
      <div className="container mx-auto">
        {/* Judul sesuai style Anda */}
        <h2 className="text-5xl font-extrabold mb-4 text-gray-800">Our Sponsored</h2>
        <p className="text-xl mb-16 text-gray-500">We are proud to collaborate with our valued partners.</p>
        
        {sponsors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>Belum ada sponsor yang ditambahkan.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-12 gap-y-8 items-center max-w-6xl mx-auto mt-8">
              {Array(7).fill(0).map((_, index) => (
                // Placeholder dengan dimensi yang lebih besar
                // [MODIFIKASI]: Menambah w-40 pada placeholder
                <div key={index} className="flex justify-center items-center h-32 w-40 mx-auto"> 
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-12 gap-y-8 items-center max-w-6xl mx-auto">
            {sponsors.map((sponsor) => (
                // [MODIFIKASI]: Menambah w-40 pada kontainer logo
                <div key={sponsor._id} className="flex justify-center items-center h-32 w-40 p-2 mx-auto">
                    <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        width={180} // Lebar yang lebih besar
                        height={96} // Tinggi 96px 
                        className="grayscale opacity-75 transition duration-300 hover:grayscale-0 hover:opacity-100"
                        style={{ objectFit: 'contain' }} // Memastikan logo tidak terdistorsi
                    />
                </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}