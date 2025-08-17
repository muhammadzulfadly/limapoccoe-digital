"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import MenungguCard from "@/components/card/Menunggu";
import DiterimaCard from "@/components/card/DiTerima";
import SelesaiCard from "@/components/card/Selesai";

const statusMap = {
  waiting: "Menunggu",
  processed: "Diterima",
  approved: "Selesai",
};

const statusColor = {
  Selesai: "text-[#34C759] font-semibold",
  Diterima: "text-[#016E84] font-semibold",
  Menunggu: "text-[#FF9500] font-semibold",
};

// urutan dan label tombol
const STATUS_TABS = ["Semua", "Menunggu", "Diterima", "Selesai"];

// warna tombol aktif (on) mengikuti gambar
const ACTIVE_TAB_CLASS = {
  Semua: "bg-[#2B3A4A] text-white",
  Menunggu: "bg-[#FF9500] text-white",
  Diterima: "bg-[#016E84] text-white",
  Selesai: "bg-[#34C759] text-white",
};

export default function PengaduanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif
  const itemsPerPage = 5;
  const router = useRouter();
  const [profilLengkap, setProfilLengkap] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [colSpan, setColSpan] = useState(6);

  useEffect(() => {
    const fetchAduanAndProfile = async () => {
      const token = localStorage.getItem("token");
      setLoading(true); // ⬅️ mulai loading
      try {
        const [aduanRes, profilRes] = await Promise.all([fetch("/api/complaint", { headers: { Authorization: `Bearer ${token}` } }), fetch("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })]);

        const aduanData = await aduanRes.json();
        const sorted = [...(aduanData.aduan || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setData(sorted);

        const profil = await profilRes.json();
        const fields = ["alamat", "dusun", "tanggal_lahir", "tempat_lahir", "jenis_kelamin", "pekerjaan"];
        const isComplete = fields.every((field) => !!profil.profile?.[field]);
        setProfilLengkap(isComplete);
      } catch (e) {
        console.error("Gagal memuat data:", e);
      } finally {
        setLoading(false); // ⬅️ selesai loading
      }
    };

    fetchAduanAndProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // breakpoint md: di Tailwind
        setColSpan(5); // mobile
      } else {
        setColSpan(6); // desktop
      }
    };

    // jalankan pertama kali
    handleResize();

    // pasang event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const jumlahMenunggu = data.filter((i) => statusMap[i.status] === "Menunggu").length;
  const jumlahDiterima = data.filter((i) => statusMap[i.status] === "Diterima").length;
  const jumlahSelesai = data.filter((i) => statusMap[i.status] === "Selesai").length;

  // filter pencarian + tab
  const filteredData = data.filter((item) => {
    const readableStatus = statusMap[item.status] || item.status;
    const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID");
    const keyword = searchTerm.toLowerCase();

    const matchesSearch = item.title.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword) || formattedDate.includes(keyword);

    const matchesStatus = activeTab === "Semua" ? true : readableStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8">
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengaduan</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <MenungguCard count={jumlahMenunggu} />
            <DiterimaCard count={jumlahDiterima} />
            <SelesaiCard count={jumlahSelesai} />
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          {/* tombol buat + search */}
          <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4 mb-6">
            <button
              className="flex items-center justify-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-xs sm:text-sm hover:bg-green-600 transition"
              onClick={() => (profilLengkap ? router.push("/pengaduan/buat") : setShowProfileModal(true))}
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="block sm:hidden text-xs">Buat Aduan</span>
              <span className="hidden sm:block text-xs sm:text-sm">Buat Pengaduan</span>
            </button>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Cari"
                className="flex-1 outline-none bg-white placeholder-gray-500 min-w-0 text-xs sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Tombol status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 mb-2">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (activeTab !== tab) {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }
                  }}
                  className={`w-full px-2 py-1 sm:px-4 sm:py-2 rounded font-medium transition-colors 
          truncate text-ellipsis whitespace-nowrap 
          ${isActive ? ACTIVE_TAB_CLASS[tab] : "bg-gray-300 text-black hover:bg-gray-400"}`}
                  style={{ fontSize: "clamp(10px, 3vw, 14px)" }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* tabel */}
          <div className="w-full overflow-x-auto">
            <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
              <thead>
                <tr className="bg-[#27AE60] text-white">
                  <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                  <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Tanggal</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Judul Pengaduan</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Kategori</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Status</th>
                  <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={colSpan} className="text-center py-4 italic bg-white">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => {
                    const readableStatus = statusMap[item.status] || item.status;
                    return (
                      <tr key={item.id} className="bg-white text-center align-top">
                        <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{item.title}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{item.category}</td>
                        <td className={`border border-black p-2 whitespace-normal break-words ${statusColor[readableStatus] || ""}`}>{readableStatus}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">
                          <Link href={`/pengaduan/${item.id}`} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                            <Search className="text-sky-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                            <span className="text-black group-hover:underline">Buka</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {data.length === 0 ? "Anda belum pernah melakukan pengaduan" : "Hasil Pencarian Tidak Ada"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {getPaginationRange().map((page, i) => (
                <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                  {page === "..." ? "..." : page}
                </button>
              ))}

              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center w-[300px]">
            <h3 className="text-lg font-semibold text-[#EB5757] mb-3">Lengkapi Profil</h3>
            <p className="text-sm text-gray-700 mb-4">Anda perlu melengkapi profil sebelum membuat pengaduan.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100">
                Nanti
              </button>
              <button onClick={() => router.push("/auth/lengkapi-profil")} className="px-4 py-1 text-sm bg-[#27AE60] text-white rounded hover:bg-green-600">
                Lengkapi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
