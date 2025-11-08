/* Path: src/components/admin/Sidebar.js */
/* Modifikasi: Menambahkan 'Kelola Direksi' */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GalleryVertical, 
  Newspaper, 
  Trophy, 
  Building, 
  UsersRound,
  ShieldHalf // <-- Ikon baru untuk Direksi
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { 
      group: 'Kelola Konten',
      links: [
        { href: '/admin/manage-gallery', label: 'Kelola Galeri', icon: GalleryVertical },
        { href: '/admin/manage-news', label: 'Kelola Berita', icon: Newspaper },
        { href: '/admin/manage-achievements', label: 'Kelola Achievement', icon: Trophy },
        { href: '/admin/manage-sponsors', label: 'Kelola Sponsor', icon: Building },
        { href: '/admin/manage-sub-teams', label: 'Kelola Sub Tim', icon: UsersRound },
        // --- LINK BARU DITAMBAHKAN DI SINI ---
        { href: '/admin/manage-board', label: 'Kelola Direksi', icon: ShieldHalf },
      ]
    }
  ];

  const NavLink = ({ href, label, icon: Icon }) => {
    // Cek apakah link aktif.
    // pathname.startsWith(href + '/') digunakan agar link tetap aktif saat di halaman edit (cth: /admin/manage-news/edit/123)
    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
    
    return (
      <Link href={href}>
        <span
          className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
            isActive
              ? 'bg-indigo-700 text-white shadow-lg' // Style aktif
              : 'text-gray-300 hover:bg-indigo-700 hover:text-white' // Style non-aktif
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="ml-3 text-sm font-medium">{label}</span>
        </span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-[#000D81] text-white h-screen fixed top-0 left-0 shadow-xl z-40 p-4">
      <div className="flex flex-col h-full">
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold">ADMIN PANEL</h1>
        </div>
        
        <nav className="flex-1 space-y-6 mt-6">
          {navLinks.map((item, index) => (
            <div key={index}>
              {item.group ? (
                <div className="space-y-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.group}</h3>
                  <div className="space-y-1">
                    {item.links.map(link => (
                      <NavLink key={link.href} {...link} />
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink {...item} />
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}