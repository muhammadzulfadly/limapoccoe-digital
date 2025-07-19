"use client";

import { FileDown, Search, Plus, Info, SlidersHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    date: "",
    status: "",
  });

  const statusMap = {
    processed: "Sedang Proses",
    confirmed: "Butuh Konfirmasi",
    rejected: "Ditolak",
    approved: "Selesai",
  };

  const statusStyle = {
    "Sedang Proses": "text-gray-500 font-semibold",
    "Butuh Konfirmasi": "text-blue-600 font-semibold",
    Ditolak: "text-red-600 font-semibold",
    Selesai: "text-green-600 font-semibold",
  };

  const iconStyle = (status) => {
    if (status === "approved") return <FileDown className="text-green-600 w-4 h-4" />;
    return <Search className="text-blue-600 w-4 h-4" />;
  };

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
    const namaSurat = item.surat?.nama_surat || "";

    const query = searchQuery.toLowerCase();

    const matchesSearch = namaSurat.toLowerCase().includes(query) || statusLabel.toLowerCase().includes(query) || formattedDate.includes(query);

    const matchesStatus = statusLabel.toLowerCase().includes(searchFilters.status.toLowerCase());

    const matchesDate = formattedDate.includes(searchFilters.date);

    return matchesSearch && matchesStatus && matchesDate;
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
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600 mx-auto" />
          </div>
        </div>
      )}

      <div className="flex h-full">
        <div className="flex-1 bg-gray-100 p-8">
          <h1 className="text-lg sm:text-xl font-semibold mb-6">
            Pengajuan Surat / <span className="font-semibold">{namaSurat}</span>
          </h1>

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
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} />
                  <span className="block sm:hidden">Buat Surat</span>
                  <span className="hidden sm:block"> Buat Pengajuan Surat</span>
                </button>

                <button
                  onClick={() => {
                    const detail = suratList.find((item) => item.slug === jenisSurat);
                    setSuratDetail(detail);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-green-100 text-sm rounded-md text-gray w-full sm:w-auto"
                >
                  <Info className="w-4 h-4" />
                  <span className="block sm:hidden">Persyaratan</span>
                  <span className="hidden sm:block">Penjelasan dan Persyaratan</span>
                </button>
              </div>

              <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
                <Search className="w-5 h-5 mr-3" />
                <input type="text" placeholder="Cari" className="outline-none text-sm bg-white placeholder-gray-500 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={() => setShowFilter(!showFilter)}>
                  <SlidersHorizontal className={`w-4 h-4 ml-2 cursor-pointer transition-colors ${showFilter ? "text-green-600" : "text-gray-500"}`} />
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input type="text" placeholder="Filter Tanggal" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.date} onChange={(e) => handleFilterChange("date", e.target.value)} />
                <input type="text" placeholder="Filter Status" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.status} onChange={(e) => handleFilterChange("status", e.target.value)} />
              </div>
            )}

            {/* Tabel data */}
            <div className="w-full">
              <table className="table-auto w-full border border-black text-[10px] sm:text-xs md:text-base">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="border border-black p-2 w-[5%]">No.</th>
                    <th className="border border-black p-2 w-1/5">Tanggal</th>
                    <th className="border border-black p-2 w-1/5">Jenis surat</th>
                    <th className="border border-black p-2 w-1/5">Status</th>
                    <th className="border border-black p-2 w-1/5">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center text-black py-4 italic">
                        Memuat data...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-black py-4">
                        Anda belum pernah melakukan pengajuan {namaSurat}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => {
                      const status = item.status.toLowerCase();
                      const statusLabel = statusMap[status] || item.status;
                      const statusClass = statusStyle[statusLabel] || "";

                      return (
                        <tr key={item.id} className="text-center">
                          <td className="border border-black p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="border border-black p-2">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                          <td className="border border-black p-2">{item.surat?.nama_surat || namaSurat}</td>
                          <td className={`border border-black p-2 ${statusClass}`}>{statusLabel}</td>
                          <td className="border border-black p-2">
                            <div className="flex flex-col items-center justify-center text-center group">
                              <button
                                onClick={() => (item.status.toLowerCase() === "approved" ? handleDownload(item.id, `${namaSurat}`) : router.push(`/pengajuan-surat/${jenisSurat}/${item.id}`))}
                                className="flex flex-col items-center justify-center group"
                              >
                                {item.status === "approved" ? (
                                  <FileDown className="text-green-600 w-6 h-6 group-hover:scale-105 transition-transform" />
                                ) : (
                                  <Search className="text-sky-500 w-6 h-6 group-hover:scale-105 transition-transform" />
                                )}
                                <span className="text-[10px] sm:text-sm text-black group-hover:underline">{item.status === "approved" ? "Unduh" : "Buka"}</span>
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
                  <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-green-700 text-white" : "hover:bg-slate-100"}`}>
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
              <h2 className="text-xl font-bold">{suratDetail.nama_surat}</h2>
              <p className="text-justify">{suratDetail.deskripsi}</p>

              <h3 className="text-lg font-semibold mt-4">Persyaratan yang Harus Dibawa</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(suratDetail.syarat_ketentuan || "").split(",").map((item, idx) => (
                  <li key={idx}>{item.trim()}</li>
                ))}
              </ul>

              <div className="flex justify-end pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
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
                <button onClick={() => router.push("/auth/lengkapi-profil")} className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Lengkapi Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
