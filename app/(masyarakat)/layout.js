"use client";

import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function BerandaLayout({ children }) {
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const name = parsedUser?.user?.name || parsedUser?.name || "";
          setUserName(name);
        } catch (error) {
          console.error("Gagal parsing user dari localStorage:", error);
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // 🔒 Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const isBeranda = pathname.startsWith("/beranda");

  return (
    <>
      {/* Header */}
      <header className="bg-[#2DB567] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3 shadow">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Desa Limapocoe" width={45} height={45} priority />
          <span className="text-white font-bold text-lg md:text-xl">Desa Limapocoe</span>
        </Link>

        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
{sidebarOpen ? (
  <X size={28} className="text-white" />
) : (
  <Menu size={28} className="text-white" />
)}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {userName ? (
            <>
              <User size={18} className="text-white" />
              <Link href="/profil" className="text-white text-sm">
                {userName}
              </Link>
              {isBeranda && (
                <Link
                  href="/dashboard"
                  className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition"
                >
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/auth/masuk" className="text-white text-sm hover:underline">
                Masuk
              </Link>
              <Link
                href="/auth/daftar"
                className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Layout */}
      <div className="pt-16 relative flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white text-center py-4 text-base">
        © 2025 Pemerintah Desa Limapocoe - dikelola oleh Tim IT Desa
      </footer>
    </>
  );
}
