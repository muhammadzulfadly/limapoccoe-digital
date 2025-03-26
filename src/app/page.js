"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <header className="bg-teal-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/logo-desa.png" alt="Logo Desa" width={40} height={40} />
          <span className="font-bold text-lg">Desa Limapoccoe</span>
        </div>
        <a href="/login" className="bg-white text-teal-800 px-4 py-1 rounded-full text-sm font-medium">
          Login
        </a>
      </header>

      {/* Hero */}
      <section className="bg-gray-200 h-[300px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Selamat Datang di Portal Digital</h1>
          <p className="text-lg text-gray-700">Desa Limapoccoe</p>
        </div>
      </section>

      {/* Menu Cepat */}
      <section className="py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="bg-gray-300 h-24 mb-2"></div>
          <p>Pengajuan surat</p>
        </div>
        <div>
          <div className="bg-gray-300 h-24 mb-2"></div>
          <p>Pengaduan</p>
        </div>
        {/* Tambah fitur lain jika ada */}
      </section>

      {/* Tentang Desa */}
      <section className="bg-gray-100 py-10 px-6 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-gray-300 h-40 w-full md:w-1/2"></div>
        <p className="text-gray-700 text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nunc et convallis placerat, ex nisi
          volutpat sapien, vel eleifend elit libero a erat...
        </p>
      </section>

      {/* Galeri / Berita */}
      <section className="py-10 px-6 grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="text-center">
            <div className="bg-gray-300 h-32 mb-2"></div>
            <p className="text-sm">Lorem ipsum dolor sit amet</p>
          </div>
        ))}
      </section>

      {/* Statistik / Progres */}
      <section className="py-10 px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 rounded-full border-8 border-teal-600 border-t-transparent animate-spin-slow flex items-center justify-center text-xl font-bold text-teal-700">
          70%
        </div>
        <p className="text-gray-700 text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nunc et convallis placerat, ex nisi
          volutpat sapien, vel eleifend elit...
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        © 2025 Desa Limapoccoe. All rights reserved.
      </footer>
    </div>
  );
}
