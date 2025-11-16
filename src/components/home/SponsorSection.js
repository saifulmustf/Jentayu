/* Path: src/components/home/SponsorSection.js */
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import SponsorItem from '@/models/SponsorItem';

// Fungsi fetch sponsors dari database
async function getSponsors() {
  try {
    await dbConnect();
    const items = await SponsorItem.find({}).sort({ createdAt: 'asc' });
    const plainItems = JSON.parse(JSON.stringify(items));
    
    // ✅ FILTER: Hanya ambil sponsor dengan logoUrl valid
    return plainItems.filter(item => 
      item.logoUrl &&           // ✅ UBAH dari imageUrl → logoUrl
      item.logoUrl.trim() !== ''
    );
    
  } catch (error) {
    console.error("DB ERROR (Sponsor Home):", error.message);
    return [];
  }
}

// Komponen Server Component
export default async function SponsorSection() {
  const sponsors = await getSponsors();

  return (
    <section className="py-16 bg-gradient-to-b text-center from-gray-50 to-white">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <h2 className="text-6xl font-extrabold text-gray-800 mb-3">
            Our Sponsors
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We are proud to collaborate with our valued partners.
          </p>
        </div>

        {/* Sponsor Grid */}
        {sponsors.length === 0 ? (
          /* Skeleton Loading */
          <div className="text-center">
            <p className="text-gray-500 mb-8 text-lg">
              Belum ada sponsor yang ditambahkan.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {Array(7).fill(0).map((_, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="600"
                  className="bg-gray-200 rounded-xl shadow-md aspect-square animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Sponsor List */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {sponsors.map((sponsor, index) => (
              <div
                key={sponsor._id}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                data-aos-duration="600"
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex items-center justify-center group hover:scale-105"
              >
                <div className="relative w-full h-32">
                  {/* ✅ UBAH dari imageUrl → logoUrl */}
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}