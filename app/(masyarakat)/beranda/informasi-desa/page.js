"use client";

import Image from "next/image";
import FloatingButtons from "@/components/FloatingButtons";
import { useMemo, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

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

export default function BeritaInformasiPage() {
  const [activeTab, setActiveTab] = useState("berita");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;

  const tabBtnClass = (tab) => `px-5 py-2 rounded-lg font-medium shadow transition ${activeTab === tab ? "bg-[#27AE60] text-white hover:bg-[#219653]" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`;

  const data = useMemo(
    () => ({
      berita: Array.from({ length: 100 }).map((_, i) => ({
        id: `berita-${i}`,
        title: "Hasil sidang rapat desa",
        date: "9 Mei 2025",
        img: "/images/berita-desa.png",
        excerpt:
          "Hasil sidang rapat desa yang membahas program kerja tahun anggaran 2025 serta usulan masyarakat terkait pengembangan infrastruktur, pemberdayaan ekonomi lokal, dan digitalisasi pelayanan publik di lingkungan Desa Limapocoe.",
      })),
      wisata: Array.from({ length: 8 }).map((_, i) => ({
        id: `wisata-${i}`,
        title: "Pemandian air hangat",
        img: "/images/wisata-desa.png",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      })),
      galeri: Array.from({ length: 10 }).map((_, i) => ({ id: `galeri-${i}`, src: i % 2 === 0 ? "/images/galeri1.png" : "/images/galeri2.png" })),
      produk: Array.from({ length: 12 }).map((_, i) => ({ id: `produk-${i}`, src: "/images/produk/produk3.png", name: "Kripik kaca", price: "Rp. 100.000" })),
    }),
    []
  );

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const items = data[activeTab] || [];
  const { data: pageItems, totalPages, page } = paginate(items, currentPage, perPage);
  const paginationRange = getPaginationRange(page, totalPages);

  return (
    <div>
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Informasi Desa</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base mx-auto text-center">
            Halaman ini menyajikan informasi terbaru seputar kegiatan, pengumuman, wisata, galeri, produk dan perkembangan di lingkungan Desa Limapocoe, serta menjadi sumber inspirasi dan referensi bagi masyarakat maupun pengunjung.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {["berita", "wisata", "galeri", "produk"].map((tab) => (
              <button key={tab} type="button" className={tabBtnClass(tab)} onClick={() => changeTab(tab)}>
                {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Desa`}
              </button>
            ))}
          </div>

          {activeTab === "berita" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white">
                  <div className="relative">
                    <Image src={item.img} alt="Foto Rapat" width={400} height={250} className="w-full h-52 object-cover" />
                    <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded shadow">{item.date}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3">{item.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "wisata" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-[#27AE60]">
                  <Image src={item.img} alt="Wisata Desa" width={400} height={250} className="w-full h-52 object-cover" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "galeri" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {pageItems.map((item) => (
                <div key={item.id}>
                  <Image src={item.src} alt="Galeri" width={400} height={250} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "produk" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden bg-white shadow-sm">
                  <Image src={item.src} alt="Produk Desa" width={400} height={250} className="w-full h-48 object-cover rounded-t-xl" />
                  <div className="flex justify-between items-center bg-[#27AE60] text-white px-4 py-3 text-sm font-semibold rounded-b-xl">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

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
        </div>
      </section>

      <FloatingButtons />
    </div>
  );
}
