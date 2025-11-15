/* Path: src/app/login/page.js */
/* Ini adalah Server Component yang membungkus Form Login */

import { Suspense } from 'react';
import LoginForm from './LoginForm'; // <-- 1. Import form Anda

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#000D81' }} // Latar biru Jentayu
    >
      {/* 2. Bungkus LoginForm dengan <Suspense> */}
      {/* Ini akan memperbaiki error build Anda */}
      <Suspense fallback={
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-2xl text-center text-gray-800">
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}