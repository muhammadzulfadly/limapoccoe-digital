"use client";

import { FileDown, Search, Plus, Info, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const { jenisSurat } = useParams();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [ajuanList, setAjuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namaSurat, setNamaSurat] = useState("Memuat...");
  const [suratSlug, setSuratSlug] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [suratList, setSuratList] = useState([]);
  const [suratDetail, setSuratDetail] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [profilLengkap, setProfilLengkap] = useState(true);
  const [showProfilModal, setShowProfilModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif
  const [colSpan, setColSpan] = useState(5);

  const [searchQuery, setSearchQuery] = useState("");

  const statusMap = {
    processed: "Sedang Proses",
    confirmed: "Butuh Konfirmasi",
    rejected: "Ditolak",
    approved: "Selesai",
  };

  const statusStyle = {
    "Sedang Proses": "text-[#8A8A8E] font-semibold",
    "Butuh Konfirmasi": "text-[#016E84] font-semibold",
    Ditolak: "text-[#E74C3C] font-semibold",
    Selesai: "text-[#34C759] font-semibold",
  };

  // urutan dan label tombol
  const STATUS_TABS = ["Semua", "Sedang Proses", "Butuh Konfirmasi", "Ditolak", "Selesai"];

  // warna tombol aktif (on) mengikuti gambar
  const ACTIVE_TAB_CLASS = {
    Semua: "bg-[#2B3A4A] text-white",
    "Sedang Proses": "bg-[#8A8A8E] text-white",
    "Butuh Konfirmasi": "bg-[#016E84] text-white",
    Ditolak: "bg-[#E74C3C] text-white",
    Selesai: "bg-[#34C759] text-white",
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // breakpoint md: di Tailwind
        setColSpan(4); // mobile
      } else {
        setColSpan(5); // desktop
      }
    };

    // jalankan pertama kali
    handleResize();

    // pasang event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !jenisSurat) return;

    fetch("/api/letter", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const surat = data.jenis_surat?.find((item) => item.slug === jenisSurat);
        if (surat) {
          setNamaSurat(surat.nama_surat);
          setSuratSlug(surat.slug);
        } else {
          setNamaSurat("Jenis Surat Tidak Dikenal");
        }
        setSuratList(data.jenis_surat || []);
      })
      .catch((err) => {
        console.error("Gagal mengambil nama surat:", err);
        setNamaSurat("Jenis Surat Tidak Dikenal");
      });
  }, [jenisSurat]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!suratSlug || !token) return;

    fetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const profil = res.profile || {};
        const requiredFields = ["alamat", "dusun", "tanggal_lahir", "tempat_lahir", "jenis_kelamin", "pekerjaan"];
        const lengkap = requiredFields.every((field) => !!profil[field]);
        setProfilLengkap(lengkap);
      })

      .catch((err) => {
        console.error("Gagal memuat profil:", err);
        setProfilLengkap(false);
      });

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/letter/${suratSlug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        const sorted = [...(data.pengajuan_surat || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAjuanList(sorted);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [suratSlug]);

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const filteredData = ajuanList.filter((item) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID");
    const statusLabel = statusMap[item.status.toLowerCase()] || item.status;

    const matchesSearch = formattedDate.includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "Semua" ? true : statusLabel === activeTab;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = async (id, namaSurat) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/letter/${suratSlug}/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${namaSurat}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      alert("Gagal mengunduh file.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <>
      {isDownloading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-md text-center">
            <p className="text-lg font-semibold mb-2">Mengunduh file...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#27AE60] mx-auto" />
          </div>
        </div>
      )}

      <div className="min-h-full p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat / {namaSurat}</h2>

        <div className="bg-white rounded-md shadow-sm p-8">
          {/* Tombol aksi */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="grid grid-cols-2 flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (profilLengkap) {
                    router.push(`/pengajuan-surat/${jenisSurat}/baru`);
                  } else {
                    setShowProfilModal(true);
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto"
              >
                <Plus className="w-3 h-3 sm:w-5 sm:h-5" strokeWidth={3} />
                <span className="block sm:hidden truncate whitespace-nowrap text-ellipsis" style={{ fontSize: "clamp(10px, 3vw, 14px)" }}>Buat Surat</span>
                <span className="hidden sm:block text-xs sm:text-sm"> Buat Pengajuan Surat</span>
              </button>

              <button
                onClick={() => {
                  const detail = suratList.find((item) => item.slug === jenisSurat);
                  setSuratDetail(detail);
                  setShowModal(true);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-[#F2FCF5] text-sm rounded-md text-gray w-full sm:w-auto"
              >
                <Info className="w-4 h-4" />
                <span className="block sm:hidden truncate whitespace-nowrap text-ellipsis" style={{ fontSize: "clamp(10px, 3vw, 14px)" }}>
                  Persyaratan
                </span>
                <span className="hidden sm:block truncate whitespace-nowrap text-ellipsis" style={{ fontSize: "clamp(10px, 2vw, 14px)" }}>
                  Penjelasan dan Persyaratan
                </span>
              </button>
            </div>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
              <Search className="w-5 h-5 mr-3" />
              <input type="text" placeholder="Cari Tanggal" className="outline-none bg-white placeholder-gray-500 w-full text-xs sm:text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* Tombol status */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 mb-2">
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

          {/* Tabel data */}
          <div className="w-full overflow-x-auto">
            <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
              <thead>
                <tr className="bg-[#27AE60] text-white">
                  <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Tanggal</th>
                  <th className="border border-black p-2 w-[25%] whitespace-normal break-words">Jenis surat</th>
                  <th className="border border-black p-2 w-[25%] whitespace-normal break-words">Status</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={colSpan} className="text-center text-black py-4 italic">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {ajuanList.length === 0 ? `Anda belum pernah melakukan pengajuan ${namaSurat}` : "Hasil Pencarian Tidak Ada"}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const status = item.status.toLowerCase();
                    const statusLabel = statusMap[status] || item.status;
                    const statusClass = statusStyle[statusLabel] || "";

                    return (
                      <tr key={item.id} className="text-center">
                        <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{item.surat?.nama_surat || namaSurat}</td>
                        <td className={`border border-black p-2 whitespace-normal break-words ${statusClass}`}>{statusLabel}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">
                          <div className="flex flex-col items-center justify-center text-center group">
                            <button
                              onClick={() => (item.status.toLowerCase() === "approved" ? handleDownload(item.id, `${namaSurat}`) : router.push(`/pengajuan-surat/${jenisSurat}/${item.id}`))}
                              className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm"
                            >
                              {item.status === "approved" ? (
                                <FileDown className="text-[#34C759] w-6 h-6 group-hover:scale-105 transition-transform" />
                              ) : (
                                <Search className="text-[#00A8E8] w-6 h-6 group-hover:scale-105 transition-transform" />
                              )}
                              <span className="text-black group-hover:underline">{item.status === "approved" ? "Unduh" : "Buka"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </div>
      </div>

      {showModal && suratDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-2xl shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">{suratDetail.nama_surat}</h2>
            <p className="text-justify">{suratDetail.deskripsi}</p>

            <h2 className="text-xl font-semibold mt-4">Persyaratan yang Harus Dibawa</h2>
            <ul className="list-disc pl-5 space-y-1">
              {(suratDetail.syarat_ketentuan || "").split(",").map((item, idx) => (
                <li key={idx}>{item.trim()}</li>
              ))}
            </ul>

            <div className="flex justify-end pt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#27AE60] text-white rounded hover:bg-green-600">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfilModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center w-[300px]">
            <h3 className="text-lg font-semibold text-[#EB5757] mb-3">Lengkapi Profil</h3>
            <p className="text-sm text-gray-700 mb-4">Anda harus melengkapi profil sebelum membuat pengajuan surat.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowProfilModal(false)} className="px-4 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100">
                Nanti
              </button>
              <button onClick={() => router.push("/auth/lengkapi-profil")} className="px-4 py-1 text-sm bg-[#27AE60] text-white rounded hover:bg-green-600">
                Lengkapi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
