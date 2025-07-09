"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FileEdit, ChevronDown, LayoutDashboard } from "lucide-react";

export default function MasyarakatLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const isPengajuanSuratActive = useMemo(() => pathname.startsWith("/pengajuan-surat"), [pathname]);

  const [isOpen, setIsOpen] = useState(isPengajuanSuratActive);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    setIsOpen(isPengajuanSuratActive);
  }, [isPengajuanSuratActive]);

  // ✅ Cek token kadaluarsa
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      setShowSessionExpired(true);
    }
  }, []);

  // ✅ Ambil jenis surat jika token valid
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

  const linkClass = (path) =>
    `${isActive(path) ? "text-green-500 font-medium" : "text-black"} hover:text-green-600 flex items-center gap-2`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-57 p-6 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
        <h2 className="font-semibold text-base mb-4">PELAYANAN DESA</h2>
        <ul className="space-y-3 text-sm pl-3">
          <li>
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/beranda" className={linkClass("/beranda")}>
              <Home size={18} />
              Beranda
            </Link>
          </li>
          <li>
            <Link href="/pengaduan" className={linkClass("/pengaduan")}>
              <FileText size={18} />
              Pengaduan
            </Link>
          </li>
          <li>
            <div className="flex items-center gap-5">
              <Link
                href="/pengajuan-surat"
                className={`flex items-center gap-2 font-medium hover:text-green-600 ${
                  isPengajuanSuratActive ? "text-green-500" : "text-black"
                }`}
              >
                <FileEdit size={18} />
                Pengajuan Surat
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="ml-1 focus:outline-none">
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-green-500" : "text-black"
                  }`}
                />
              </button>
            </div>

            {isOpen && (
              <ul className="pl-7 mt-4 space-y-3 text-sm">
                {loading ? (
                  <li className="italic text-gray-500">Memuat...</li>
                ) : (
                  jenisSurat.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/pengajuan-surat/${item.id}`}
                        className={`${
                          isActive(`/pengajuan-surat/${item.id}`) ? "text-green-500 font-medium" : "text-black"
                        } hover:text-green-600 block max-w-[120px] break-words`}
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
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* 🔴 Popup Sesi Berakhir */}
      {showSessionExpired && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-4">Sesi Berakhir</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.
            </p>
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
    </div>
  );
}
