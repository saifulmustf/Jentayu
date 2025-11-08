/* Path: src/components/home/SubTeamSection.js */
/* Kode UI Anda - sudah dibersihkan dari spasi rusak */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SubTeamSection() {
  const teams = [
    { name: 'Racing Plane', img: '/images/robot-racing.png', link: '/sub-team/racing-plane' },
    { name: 'Fixed Wing', img: '/images/robot-fixed-wing.png', link: '/sub-team/fixed-wing' },
    { name: 'VTOL', img: '/images/robot-vtol.png', link: '/sub-team/vtol' },
  ];

  return (
    <section className="min-h-screen px-8 text-center bg-white flex flex-col justify-center items-center">
      <div className="w-full max-w-5xl"> {/* Kontrol lebar maksimum konten */}
        <h2 className="text-6xl font-extrabold mb-3 text-gray-800">
          Our Robot
        </h2>
        <p className="text-xl mb-16 text-gray-500">
          Stop Dreaming, Start Flying!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-x-24 gap-y-12">
          {teams.map((team) => (
            <Link href={team.link} key={team.name} className="group text-center">
              {/* Gambar diperbesar */}
              <div className="w-64 h-64 relative mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={team.img}
                  alt={team.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              {/* Teks diperbesar */}
              <p className="font-bold text-2xl text-gray-700">{team.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}