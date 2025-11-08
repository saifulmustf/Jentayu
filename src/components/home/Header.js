/* Path: src/components/home/Header.js */
/* Modifikasi: Menambahkan Dropdown untuk Profile */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const [isSubTeamOpen, setIsSubTeamOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // <-- State baru
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Ref untuk menutup dropdown saat klik di luar
  const subTeamRef = useRef(null);
  const profileRef = useRef(null); // <-- Ref baru
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (subTeamRef.current && !subTeamRef.current.contains(event.target)) {
        setIsSubTeamOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false); // <-- Handler baru
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [subTeamRef, profileRef, mobileMenuRef]); // <-- Ref baru ditambahkan

  // Tutup menu saat navigasi
  useEffect(() => {
    setIsSubTeamOpen(false);
    setIsProfileOpen(false); // <-- State baru ditambahkan
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ href, children }) => (
    <Link href={href}>
      <span className={`px-3 py-2 rounded-md text-sm font-medium ${
        pathname === href ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
      } transition-colors`}>
        {children}
      </span>
    </Link>
  );

  const DropdownLink = ({ href, children }) => (
    <Link href={href}>
      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
        {children}
      </span>
    </Link>
  );

  const subTeams = [
    { id: 'racing-plane', title: 'Racing Plane' },
    { id: 'fixed-wing', title: 'Fixed Wing' },
    { id: 'vtol', title: 'VTOL' },
  ];

  // --- [PERUBAHAN] Daftar Link Profile ---
  const profileLinks = [
    { href: '/profile/about-us', title: 'About Us' },
    { href: '/profile/board-of-directors', title: 'Board of Directors' },
  ];

  // --- Komponen Navigasi (Desktop) ---
  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-4">
      <NavLink href="/">HOME</NavLink>
      
      {/* --- [PERUBAHAN] DROPDOWN PROFILE --- */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            pathname.startsWith('/profile') ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
          } transition-colors`}
        >
          <span>PROFILE</span>
          <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>
        {isProfileOpen && (
          <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {profileLinks.map(link => (
                <DropdownLink key={link.href} href={link.href}>
                  {link.title}
                </DropdownLink>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* --- AKHIR DROPDOWN PROFILE --- */}

      {/* --- DROPDOWN SUB TEAM --- */}
      <div className="relative" ref={subTeamRef}>
        <button
          onClick={() => setIsSubTeamOpen(!isSubTeamOpen)}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            pathname.startsWith('/sub-team') ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
          } transition-colors`}
        >
          <span>SUB TEAM</span>
          <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isSubTeamOpen ? 'rotate-180' : ''}`} />
        </button>
        {isSubTeamOpen && (
          <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {subTeams.map(team => (
                <DropdownLink key={team.id} href={`/sub-team/${team.id}`}>
                  {team.title}
                </DropdownLink>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* --- AKHIR DROPDOWN SUB TEAM --- */}

      <NavLink href="/achievement">ACHIEVEMENT</NavLink>
      <NavLink href="/gallery">GALLERY</NavLink>
      <NavLink href="/news">NEWS</NavLink>
      <NavLink href="/contact">CONTACT US</NavLink>
    </div>
  );

  // --- Komponen Navigasi (Mobile) ---
  const MobileNav = () => (
    <div className="md:hidden" ref={mobileMenuRef}>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#000D81] shadow-lg py-2 z-50">
          <NavLink href="/">HOME</NavLink>
          
          {/* --- [PERUBAHAN] Sub Link Profile di Mobile --- */}
          <div className="px-3 py-2">
            <span className="text-sm font-medium text-gray-400">PROFILE</span>
            <div className="pl-4 mt-1 space-y-1">
              {profileLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <span className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white">
                    {link.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* --- AKHIR PERUBAHAN --- */}

          {/* Sub Team di Mobile */}
          <div className="px-3 py-2">
            <span className="text-sm font-medium text-gray-400">SUB TEAM</span>
            <div className="pl-4 mt-1 space-y-1">
              {subTeams.map(team => (
                <Link key={team.id} href={`/sub-team/${team.id}`}>
                  <span className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white">
                    {team.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <NavLink href="/achievement">ACHIEVEMENT</NavLink>
          <NavLink href="/gallery">GALLERY</NavLink>
          <NavLink href="/news">NEWS</NavLink>
          <NavLink href="/contact">CONTACT US</NavLink>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-[#000D81] sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="cursor-pointer">
                <Image 
                  src="/logojentayu.png" 
                  alt="Jentayu Logo" 
                  width={150} 
                  height={40} 
                  objectFit="contain"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </span>
            </Link>
          </div>
          <DesktopNav />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}