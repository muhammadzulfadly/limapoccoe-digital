"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex">
      {/* Kiri - Gambar & Logo */}
      <div className="w-1/2 bg-black relative hidden md:flex items-center justify-center">
        <Image src="/background.png" alt="Background" layout="fill" objectFit="cover" className="opacity-60" />
        <div className="z-10 text-center text-white">
          <Image src="/logo-desa.png" alt="Logo Desa" width={100} height={100} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold">LimapoccoeDigital</h1>
        </div>
      </div>

      {/* Kanan - Formulir Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Masuk</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">NIK</label>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={16} placeholder="Masukkan NIK Anda" className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="Masukkan password unik Anda" className="w-full border rounded-md p-2" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm mt-1 text-right text-gray-700 underline">
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            <Link href="/dashboard">
              <button type="button" className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition">
                Masuk
              </button>
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/auth/register" className="text-blue-700 font-medium hover:underline">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
