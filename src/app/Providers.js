/* Path: src/app/Providers.js */
/* File ini WAJIB ada untuk next-auth */

'use client'; // <-- Tandai sebagai Client Component

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  // Bungkus seluruh aplikasi Anda dengan SessionProvider
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}