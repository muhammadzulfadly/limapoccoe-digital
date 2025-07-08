"use client";

import {
  FileDown,
  Search,
  Plus,
  Info,
  SlidersHorizontal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
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

  // Ambil nama surat & slug dari ID via route internal
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
        const surat = data.jenis_surat?.find(
          (item) => item.id.toString() === jenisSurat
        );
        if (surat) {
          setNamaSurat(surat.nama_surat);
          setSuratSlug(surat.slug);
        } else {
          setNamaSurat("Jenis Surat Tidak Dikenal");
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil nama surat:", err);
        setNamaSurat("Jenis Surat Tidak Dikenal");
      });
  }, [jenisSurat]);

  // Ambil daftar pengajuan via internal route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!suratSlug || !token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/letter/${suratSlug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        setAjuanList(data.pengajuan_surat || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [suratSlug]);

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = {
    selesai: "text-green-600 font-semibold",
    "butuh konfirmasi": "text-blue-600 font-semibold",
    ditolak: "text-red-600 font-semibold",
    "sedang proses": "text-gray-500 font-semibold",
    processed: "text-gray-500 font-semibold",
  };

  const iconStyle = (status) => {
    if (status === "selesai") return <FileDown className="text-green-600" />;
    return <Search className="text-blue-600" />;
  };

  const disabledStyle = (status) =>
    ["sedang proses", "butuh konfirmasi", "processed"].includes(status)
      ? "opacity-50"
      : "";

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-xl font-semibold mb-6">
          Pengajuan Surat / <span className="font-bold">{namaSurat}</span>
        </h1>

        <div className="bg-white rounded-md shadow-sm p-8">
          {/* Tombol aksi */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              <Link href={`/pengajuan-surat/${jenisSurat}/baru`}>
                <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                  <Plus className="w-5 h-5" strokeWidth={3} />
                  Buat Pengajuan Surat
                </button>
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-green-100 text-sm rounded-md text-gray"
              >
                <Info className="w-4 h-4" />
                Penjelasan dan Persyaratan
              </button>
            </div>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 transition-colors">
              <Search className="w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Cari"
                className="outline-none text-sm w-28 bg-white placeholder-gray-500"
              />
              <SlidersHorizontal className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Tabel data */}
          <table className="w-full table-fixed border border-black">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="border border-black p-2 w-1/5">Tanggal</th>
                <th className="border border-black p-2 w-1/5">Jenis surat</th>
                <th className="border border-black p-2 w-1/5">Status</th>
                <th className="border border-black p-2 w-1/5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center text-black py-4 italic">
                    Memuat data...
                  </td>
                </tr>
              ) : ajuanList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-black py-4">
                    Belum ada proses pengajuan surat
                  </td>
                </tr>
              ) : (
                ajuanList.map((item) => {
                  const status = item.status.toLowerCase();
                  return (
                    <tr key={item.id} className="text-center">
                      <td className="border border-black p-2">
                        {formatTanggal(item.created_at)}
                      </td>
                      <td className="border border-black p-2">
                        {item.surat?.nama_surat || namaSurat}
                      </td>
                      <td className={`border border-black p-2 ${statusStyle[status] || ""}`}>
                        {item.status}
                      </td>
                      <td className={`border border-black p-2 ${disabledStyle(status)}`}>
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() =>
                              router.push(`/pengajuan-surat/${jenisSurat}/${item.id}`)
                            }
                            className="flex items-center gap-1 text-sm text-black hover:underline"
                          >
                            {iconStyle(status)}
                            <span>{status === "selesai" ? "Unduh" : "Buka"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination (dummy) */}
          <div className="flex justify-center mt-6">
            <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm">
              <button className="px-3 py-1">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1">1</button>
              <button className="px-3 py-1">2</button>
              <button className="px-3 py-1">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
