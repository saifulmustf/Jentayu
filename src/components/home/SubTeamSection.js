/* Path: src/components/home/SubTeamSection.js */
/* Kode UI dengan Card 3D */

'use client';

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
    <section className="min-h-screen px-8 text-center bg-white flex flex-col justify-start items-center pt-24">
      <div className="w-full max-w-9xl">
        {/* Header dengan animasi fade-up */}
        <h2 
          className="text-7xl font-extrabold mb-3 text-gray-800"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Our Robot
        </h2>
        <p 
          className="text-xl mb-8 text-gray-500"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          Stop Dreaming, Start Flying!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-x-24 gap-y-12 mt-24">
          {teams.map((team, index) => (
            <Link 
              href={team.link} 
              key={team.name} 
              className="group text-center perspective-1000"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay={200 + (index * 150)}
            >
              {/* Card 3D Container */}
              <div className="relative w-72 h-96 transform-style-3d transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-y-5">
                {/* Card Background dengan Shadow 3D */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 transform group-hover:shadow-3xl transition-all duration-500">
                  {/* Inner Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-between p-6">
                    {/* Gambar Robot */}
                    <div className="w-full h-64 relative flex items-center justify-center">
                      <div className="w-56 h-56 relative transform group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={team.img}
                          alt={team.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    
                    {/* Divider Line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    
                    {/* Nama Tim */}
                    <div className="w-full py-4">
                      <p className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {team.name}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                </div>
                
                {/* 3D Shadow Effect */}
                <div className="absolute inset-0 bg-gray-300 rounded-2xl transform translate-y-2 translate-x-2 -z-10 group-hover:translate-y-4 group-hover:translate-x-4 transition-all duration-500 opacity-30"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* CSS untuk 3D Effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-5:hover {
          transform: rotateY(5deg);
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}