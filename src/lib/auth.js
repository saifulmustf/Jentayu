/* Path: src/lib/auth.js */
/* Ini adalah "Otak Login" terpusat Anda */

import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  // 1. Konfigurasi Provider (Kita pakai Email & Password)
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // 2. Logika Otorisasi (Inti dari login)
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Email dan Password tidak boleh kosong.');
        }

        await dbConnect();

        const user = await User.findOne({ 
          email: credentials.email 
        });

        if (!user) {
          throw new Error('Email tidak terdaftar.');
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error('Password salah.');
        }

        return { 
          id: user._id.toString(), 
          email: user.email 
        };
      }
    })
  ],

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  // 8. Halaman Kustom (PENTING)
  pages: {
    signIn: '/login', // Beri tahu next-auth di mana halaman login kita
  },
};