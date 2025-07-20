"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FileEdit, ChevronDown, LayoutDashboard, User } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const isPengajuanSuratActive = useMemo(() => pathname.startsWith("/pengajuan-surat"), [pathname]);

  const [isOpenDropdown, setIsOpenDropdown] = useState(isPengajuanSuratActive);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsOpenDropdown(isPengajuanSuratActive);
  }, [isPengajuanSuratActive]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");

    const expired = !expiresAt || Date.now() > parseInt(expiresAt);
    const isLoggedIn = !!token && !!user && !expired;

    setUserLoggedIn(isLoggedIn);

    if (!isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      if (!pathname.startsWith("/beranda")) {
        setShowSessionExpired(expired);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/letter", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJenisSurat(data.jenis_surat || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const linkClass = (path) => `${isActive(path) ? "text-green-500" : "text-black"} hover:text-green-600 flex items-center gap-2`;

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`fixed top-[64px] left-0 z-40 w-57 bottom-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:transform-none bg-white md:bg-transparent border-r border-gray-200 flex flex-col`}
      >
        <aside className="p-6 flex-1 overflow-y-auto bg-white pb-44 md:pb-6">
          <h2 className="font-semibold text-base mb-4">PELAYANAN DESA</h2>

          {userLoggedIn ? (
            <ul className="space-y-3 text-sm pl-1">
              <li>
                <Link href="/profil" onClick={onClose} className={`${linkClass("/profil")} block md:hidden`}>
                  <User size={18} />
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/dashboard" onClick={onClose} className={linkClass("/dashboard")}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/beranda" onClick={onClose} className={linkClass("/beranda")}>
                  <Home size={18} />
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/pengaduan" onClick={onClose} className={linkClass("/pengaduan")}>
                  <FileText size={18} />
                  Pengaduan
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-5">
                  <Link href="/pengajuan-surat" className={`flex items-center gap-2 hover:text-green-600 ${isPengajuanSuratActive ? "text-green-500" : "text-black"}`}>
                    <FileEdit size={18} />
                    Pengajuan surat
                  </Link>
                  <button onClick={() => setIsOpenDropdown(!isOpenDropdown)} className="ml-1 focus:outline-none">
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isOpenDropdown ? "rotate-180 text-green-500" : "text-black"}`} />
                  </button>
                </div>

                {isOpenDropdown && (
                  <ul className="pl-7 mt-3 text-sm">
                    {loading ? (
                      <li className="italic text-gray-500">Memuat...</li>
                    ) : (
                      jenisSurat.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/pengajuan-surat/${item.slug}`}
                            onClick={onClose}
                            className={`${isActive(`/pengajuan-surat/${item.slug}`) ? "text-green-500" : "text-black"} hover:text-green-600 block break-words border-b border-gray-200 md:border-none py-1.5 max-w-[125px]`}
                          >
                            {item.nama_surat}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </li>
            </ul>
          ) : (
            <div className="space-y-3 text-sm">
              <Link href="/auth/daftar" className="block w-full border border-green-600 text-green-600 text-center rounded px-4 py-2 font-medium hover:bg-green-50 transition">
                Daftar
              </Link>
              <Link href="/auth/masuk" className="block w-full bg-[#2DB567] text-white text-center rounded px-4 py-2 font-medium hover:bg-[#28a65d] transition">
                Masuk
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Popup sesi berakhir */}
      {showSessionExpired && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-4">Sesi Berakhir</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.</p>
            <button
              onClick={() => {
                setShowSessionExpired(false);
                router.push("/auth/masuk");
              }}
              className="bg-[#EB5757] hover:bg-[#c94444] text-white rounded px-6 py-2 text-sm"
            >
              Masuk Ulang
            </button>
          </div>
        </div>
      )}
    </>
  );
}
