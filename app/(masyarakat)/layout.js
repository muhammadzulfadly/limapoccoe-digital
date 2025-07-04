"use client";

import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function BerandaLayout({ children }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.name || "");
      } catch (error) {
        setUserName("");
      }
    } else {
      setUserName("");
    }
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-[#27AE60] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-3 shadow">
        {/* Kiri: Logo dan Nama */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Desa Limmapocoe" width={45} height={45} priority />
          <span className="text-white font-bold text-lg md:text-xl">Desa Limapocoe</span>
        </Link>

        {/* Kanan: Login vs Dashboard */}
        {userName ? (
          <div className="flex items-center gap-4">
            <User size={18} className="text-white" />
            <Link href="auth/profil" className="text-white text-sm hover:underline">{userName}</Link>
            <Link
              href="/masyarakat/dashboard"
              className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/auth/masuk" className="text-white text-sm hover:underline">
              Masuk
            </Link>
            <Link
              href="/auth/daftar"
              className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition"
            >
              Daftar
            </Link>
          </div>
        )}
      </header>

      {/* Isi halaman */}
      <main className="pt-16 min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white text-center py-4 text-base">
        © 2025 Desa Limapocoe - dikelola oleh Tim IT Desa
      </footer>
    </>
  );
}
