"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
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
  Selesai: "text-green-600 font-semibold",
  Diterima: "text-teal-800 font-semibold",
  Menunggu: "text-orange-600 font-semibold",
};

export default function PengaduanPage() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    category: "",
    status: "",
    date: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAduan = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      const sorted = [...(result.aduan || [])].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setData(sorted);
    };

    fetchAduan();
  }, []);

  const jumlahMenunggu = data.filter(
    (item) => statusMap[item.status] === "Menunggu"
  ).length;
  const jumlahDiterima = data.filter(
    (item) => statusMap[item.status] === "Diterima"
  ).length;
  const jumlahSelesai = data.filter(
    (item) => statusMap[item.status] === "Selesai"
  ).length;

  const filteredData = data.filter((item) => {
    const readableStatus = statusMap[item.status] || item.status;
    const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID");

    return (
      item.title.toLowerCase().includes(searchFilters.title.toLowerCase()) &&
      item.category.toLowerCase().includes(searchFilters.category.toLowerCase()) &&
      readableStatus.toLowerCase().includes(searchFilters.status.toLowerCase()) &&
      formattedDate.includes(searchFilters.date)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengaduan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <MenungguCard count={jumlahMenunggu} />
            <DiterimaCard count={jumlahDiterima} />
            <SelesaiCard count={jumlahSelesai} />
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          <div className="flex justify-between items-center mb-6">
            <Link href="/pengaduan/buat">
              <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Buat Pengaduan
              </button>
            </Link>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-96">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Cari judul pengaduan..."
                className="flex-1 outline-none text-sm bg-white placeholder-gray-500"
                value={searchFilters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
              />
              <button onClick={() => setShowFilter(!showFilter)}>
                <SlidersHorizontal className="w-4 h-4 ml-2 cursor-pointer" />
              </button>
            </div>
          </div>

          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Filter Kategori"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={searchFilters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter Status (Menunggu, Diterima, Selesai)"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={searchFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter Tanggal (contoh: 11/07/2025)"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={searchFilters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
          )}

          <table className="w-full table-fixed border border-black">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black p-2 w-1/6">Tanggal</th>
                <th className="border border-black p-2 w-1/6">Judul Pengaduan</th>
                <th className="border border-black p-2 w-1/6">Kategori</th>
                <th className="border border-black p-2 w-1/6">Status</th>
                <th className="border border-black p-2 w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const readableStatus = statusMap[item.status] || item.status;
                  return (
                    <tr key={index} className="bg-white text-center">
                      <td className="border border-black p-2">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="border border-black p-2">{item.title}</td>
                      <td className="border border-black p-2">{item.category}</td>
                      <td
                        className={`border border-black p-2 ${
                          statusColor[readableStatus] || ""
                        }`}
                      >
                        {readableStatus}
                      </td>
                      <td className="border border-black p-2">
                        <Link
                          href={`/pengaduan/${item.id}`}
                          className="flex justify-center items-center gap-1"
                        >
                          <Search className="text-blue-400" />
                          <span className="text-sm text-black hover:underline">
                            Buka
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="bg-white text-center text-black py-4">
                    Tidak ditemukan pengaduan yang sesuai
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 disabled:opacity-50"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 ${
                      currentPage === i + 1
                        ? "bg-green-600 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 disabled:opacity-50"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
