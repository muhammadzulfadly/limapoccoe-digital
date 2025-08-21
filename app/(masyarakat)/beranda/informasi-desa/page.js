"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingButtons from "@/components/FloatingButtons";
import { ChevronsLeft, ChevronsRight, Ban } from "lucide-react";

// helper dan fungsi tambahan
function paginate(items, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const end = start + perPage;
  return { data: items.slice(start, end), totalPages, page: safePage };
}

function getPaginationRange(currentPage, totalPages) {
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
}

function getImageSrc(gambar) {
  return gambar ? `/api/information/photo/${gambar.split("/").pop()}` : "/images/no-image.png";
}

// -------------------------------
// Komponen utama dibungkus Suspense
// -------------------------------
function InformasiDesaClient() {
  const [activeTab, setActiveTab] = useState("berita");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const perPage = 9;
  const searchParams = useSearchParams();

  useEffect(() => {
    const kategoriQuery = searchParams.get("kategori");
    if (kategoriQuery && ["berita", "wisata", "galeri", "produk"].includes(kategoriQuery)) {
      setActiveTab(kategoriQuery);
    }
  }, [searchParams]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/information");
        const result = await res.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = data.filter((item) => item.kategori === activeTab);
  const { data: pageItems, totalPages, page } = paginate(filteredItems, currentPage, perPage);
  const paginationRange = getPaginationRange(page, totalPages);

  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Informasi Desa</h2>
        <p className="text-gray-600 mb-10 text-sm sm:text-base mx-auto text-center">Halaman ini menyajikan informasi terbaru seputar kegiatan, pengumuman, wisata, galeri, produk dan perkembangan di lingkungan Desa Limapocoe.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {["berita", "wisata", "galeri", "produk"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`px-5 py-2 rounded-lg font-medium shadow transition ${activeTab === tab ? "bg-[#27AE60] text-white hover:bg-[#219653]" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
              onClick={() => changeTab(tab)}
            >
              {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Desa`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 italic">Memuat data...</p>
        ) : pageItems.length === 0 ? (
          <div className="bg-white p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
            <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
            Belum ada data
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((item) => (
                <Link href={`/beranda/informasi-desa/${item.slug}`} key={item.id}>
                  <div className="rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white">
                    <div className="relative">
                      <Image src={getImageSrc(item.gambar)} alt={item.judul} width={400} height={250} className="w-full h-52 object-cover" />
                      {(activeTab === "berita" || activeTab === "galeri") && (
                        <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded shadow">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    {activeTab !== "galeri" && (
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.judul}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3 whitespace-pre-line">{item.konten || "Tidak ada konten."}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {paginationRange.map((pageNum, i) => (
                  <button
                    key={i}
                    onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                    disabled={typeof pageNum !== "number"}
                    className={`px-3 py-1 ${pageNum === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}
                  >
                    {pageNum === "..." ? "..." : pageNum}
                  </button>
                ))}

                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="text-center py-10">Memuat halaman...</div>}>
        <InformasiDesaClient />
      </Suspense>
      <FloatingButtons />
    </>
  );
}
