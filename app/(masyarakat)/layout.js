"use client";

import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import PropTypes from "prop-types";

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

  // NAV LINKS KHUSUS DESKTOP
  const navLinks = [
    { label: "Beranda", href: "/beranda" },
    { label: "Profil Desa", href: "/beranda/profil-desa" },
    { label: "Informasi Desa", href: "/beranda/informasi-desa" },
    { label: "Infografis Desa", href: "/beranda/infografis-desa" },
  ];

  // GANTI fungsi isActive lama dengan ini
  const normalize = (p) => p.replace(/\/+$/, "") || "/";

  const isActive = (href) => {
    const current = normalize(pathname);
    const target = normalize(href);

    // aktif kalau cocok persis atau current berada di bawah target
    const matches = target === "/" ? current === "/" : current === target || current.startsWith(`${target}/`);

    if (!matches) return false;

    // pastikan HANYA link dengan prefix TERPANJANG yang aktif
    const hasLongerMatch = navLinks.some((l) => {
      const t = normalize(l.href);
      if (t === target) return false;
      const ok = t === "/" ? current === "/" : current === t || current.startsWith(`${t}/`);
      return ok && t.length > target.length;
    });

    return !hasLongerMatch;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#27AE60] fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-3 shadow">
        <div className="mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo Desa Limapocoe" width={45} height={45} priority />
            <span className="text-white font-semibold text-lg md:text-xl">Desa Limapoccoe</span>
          </Link>

          {/* NAV DESKTOP – hanya tampil di md+ */}
          {isBeranda && (
            <nav className="hidden md:flex md:flex-nowrap items-center gap-8 whitespace-nowrap overflow-x-auto">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg transition
  ${active ? "bg-white/20 text-white" : "text-white/90 hover:text-white hover:bg-white/10"}`}
                  >
                    {link.label}
                    {active && <span className="sr-only">(halaman saat ini)</span>}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Aksi kanan */}
          <div className="flex items-center gap-4">
            {/* Tombol burger hanya di mobile */}
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}>
              {sidebarOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
            </button>

            {/* Aksi kanan di desktop */}
            <div className="hidden md:flex items-center gap-4">
              {userName ? (
                <>
                  {!isBeranda && (
                    <>
                      <User size={18} className="text-white" />
                      <Link href="/profil" className="text-white text-sm">
                        {userName}
                      </Link>
                    </>
                  )}
                  {isBeranda && (
                    <Link href="/dashboard" className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition">
                      Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/auth/masuk" className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="pt-16 relative flex flex-1">
        {/* Sidebar */}
        {(!isBeranda || (isBeranda && sidebarOpen)) && (
          <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && <button type="button" aria-label="Tutup sidebar" className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
          </>
        )}

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white text-center py-4 px-4 text-xs sm:text-base">
        <div className="max-w-screen-xl mx-auto">© 2025 Pemerintah Desa Limapoccoe - dikelola oleh Tim IT Desa</div>
      </footer>
    </div>
  );
}

BerandaLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
