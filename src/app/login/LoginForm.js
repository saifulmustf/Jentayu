/* Path: src/app/login/LoginForm.js */
/* Ini adalah file BARU. Isinya adalah kode LAMA dari page.js */

'use client'; 

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- Aman di sini
import Image from 'next/image';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams(); // <-- Ini sekarang aman
  const error = searchParams.get('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false, 
      email: email,
      password: password,
    });

    setLoading(false);

    if (result.ok) {
      router.push('/admin'); // Redirect ke dashboard
    } 
  };

  return (
    // Ini adalah <div> pembungkus dari form Anda
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <Image 
          src="/jentayu-logo.png" 
          alt="Jentayu Logo" 
          width={200} 
          height={53}
          style={{ objectFit: "contain" }}
        />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Admin Login
      </h2>

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{decodeURIComponent(error)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}