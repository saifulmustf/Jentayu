/* Path: src/app/profile/about-us/page.js */

import { Eye, Rocket, Target } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Halaman */}
      <section 
        className="py-32 px-8 text-center text-white" 
        style={{ backgroundImage: "url('/about-hero.png')" }} // Warna biru gelap
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Jentayu</h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          Mengenal lebih dekat tim riset UAV kebanggaan Universitas Diponegoro.
        </p>
      </section>

      {/* Konten Utama */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">
          
          {/* Sejarah Singkat */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Sejarah Kami</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-justify space-y-4">
              <span>
                Jentayu (UAV Research Team) Universitas Diponegoro adalah sebuah tim riset yang berfokus pada pengembangan teknologi Pesawat Terbang Tanpa Awak atau Unmanned Aerial Vehicle (UAV). Dibentuk oleh sekelompok mahasiswa berbakat dari berbagai disiplin ilmu, Jentayu bertujuan untuk berinovasi dan berkompetisi di kancah nasional maupun internasional.
              </span>
              <span>
                Kami mendedikasikan diri untuk memajukan teknologi kedirgantaraan, menerapkan solusi cerdas untuk tantangan dunia nyata, dan mengharumkan nama almamater melalui pencapaian di bidang teknologi UAV.
              </span>
            </p>
          </div>

          {/* Visi & Misi dalam Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Visi */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
              <Eye className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Visi</h3>
              <p className="text-gray-700">
                Menjadi pusat unggulan riset dan pengembangan teknologi Unmanned Aerial Vehicle (UAV) yang inovatif dan berdaya saing global.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
              <Rocket className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Misi</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Melakukan riset berkelanjutan di bidang teknologi UAV.</li>
                <li>Mengembangkan prototipe UAV untuk berbagai aplikasi.</li>
                <li>Berpartisipasi aktif dalam kompetisi UAV nasional dan internasional.</li>
              </ul>
            </div>

            {/* Tujuan */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
              <Target className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tujuan</h3>
              <p className="text-gray-700">
                Menghasilkan inovasi teknologi yang bermanfaat bagi masyarakat dan industri, serta mencetak talenta-talenta muda yang ahli di bidang kedirgantaraan.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}