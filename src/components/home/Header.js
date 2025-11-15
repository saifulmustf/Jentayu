/* Path: src/components/Header.js */
/* VERSI FINAL: Dropdown mobile untuk Profile & Sub Team sudah diperbaiki */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  // --- STATE UNTUK DESKTOP ---
  const [isSubTeamOpen, setIsSubTeamOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // --- STATE UNTUK MOBILE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // [PERBAIKAN] State terpisah untuk dropdown di dalam menu mobile
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMobileSubTeamOpen, setIsMobileSubTeamOpen] = useState(false);

  const pathname = usePathname();
  
  const subTeamRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (subTeamRef.current && !subTeamRef.current.contains(event.target)) {
        setIsSubTeamOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('button[aria-controls="mobile-menu"]')) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [subTeamRef, profileRef, mobileMenuRef]);

  // Tutup semua menu saat navigasi halaman
  useEffect(() => {
    setIsSubTeamOpen(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(false); // [PERBAIKAN] Reset state mobile
    setIsMobileSubTeamOpen(false); // [PERBAIKAN] Reset state mobile
  }, [pathname]);

  const NavLink = ({ href, children }) => (
    <Link
      href={href}
      className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium ${
        pathname === href ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
      } transition-colors`}
    >
      {children}
    </Link>
  );

  const DropdownLink = ({ href, children }) => (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
    >
      {children}
    </Link>
  );

  const subTeams = [
    { id: 'racing-plane', title: 'Racing Plane' },
    { id: 'fixed-wing', title: 'Fixed Wing' },
    { id: 'vtol', title: 'VTOL' },
  ];

  const profileLinks = [
    { href: '/profile/about-us', title: 'About Us' },
    { href: '/profile/board-of-directors', title: 'Board of Directors' },
  ];

  // --- Komponen Navigasi (Desktop) ---
  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-4">
      <NavLink href="/">HOME</NavLink>
      
      {/* DROPDOWN PROFILE (DESKTOP) */}
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

      {/* DROPDOWN SUB TEAM (DESKTOP) */}
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
        aria-controls="mobile-menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* [PERBAIKAN] Menu mobile sekarang menggunakan 'transform' untuk slide-down */}
      <div 
        className={`absolute top-16 left-0 right-0 bg-[#000D81] shadow-lg py-2 z-50 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        
        <NavLink href="/">HOME</NavLink>
        
        {/* --- [PERBAIKAN] DROPDOWN PROFILE (MOBILE) --- */}
        <div className="px-3 py-2">
          <button
            onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)} // <-- Menggunakan state mobile
            className="flex justify-between items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white"
          >
            <span>PROFILE</span>
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isMobileProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* Tampilkan sub-link HANYA jika isMobileProfileOpen true */}
          {isMobileProfileOpen && (
            <div className="pl-4 mt-1 space-y-1">
              {profileLinks.map(link => (
                <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white">
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* --- AKHIR PERBAIKAN --- */}

        {/* --- [PERBAIKAN] DROPDOWN SUB TEAM (MOBILE) --- */}
        <div className="px-3 py-2">
          <button
            onClick={() => setIsMobileSubTeamOpen(!isMobileSubTeamOpen)} // <-- Menggunakan state mobile
            className="flex justify-between items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white"
          >
            <span>SUB TEAM</span>
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isMobileSubTeamOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* Tampilkan sub-link HANYA jika isMobileSubTeamOpen true */}
          {isMobileSubTeamOpen && (
            <div className="pl-4 mt-1 space-y-1">
              {subTeams.map(team => (
                <Link key={team.id} href={`/sub-team/${team.id}`} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white">
                  {team.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* --- AKHIR PERBAIKAN --- */}
        
        <NavLink href="/achievement">ACHIEVEMENT</NavLink>
        <NavLink href="/gallery">GALLERY</NavLink>
        <NavLink href="/news">NEWS</NavLink>
        <NavLink href="/contact">CONTACT US</NavLink>
      </div>
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
                  style={{objectFit: "contain"}}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  priority={true} // Tambahkan priority untuk logo (LCP)
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