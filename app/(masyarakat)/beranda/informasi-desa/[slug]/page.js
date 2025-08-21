"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";

// helper untuk gambar aman
function getImageSrc(gambar) {
  return gambar ? `/api/information/photo/${gambar.split("/").pop()}` : "/images/no-image.png";
}

export default function DetailInformasiPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/information/${slug}`);
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Memuat data...
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-red-600 mt-10">Data tidak ditemukan.</p>;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-10">
        {/* Atas: Tombol Kembali kiri, Info kanan */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-y-2">
          <button type="button" onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition">
            <ChevronLeft size={20} className="mr-1" /> Kembali
          </button>

          <div className="text-right">
            <span className="inline-block bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded-full mb-1">{data.kategori?.toUpperCase() || "INFORMASI"}</span>
            <p className="text-sm text-gray-500">
              {new Date(data.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-snug">{data.judul}</h1>

        <div className="rounded-xl overflow-hidden mb-8">
          <img src={getImageSrc(data.gambar)} alt={data.judul} className="w-full object-cover aspect-video" loading="lazy" />
        </div>

        <article className="prose prose-sm sm:prose lg:prose-lg prose-p:text-gray-700 whitespace-pre-line max-w-none">{data.konten}</article>
      </div>
    </section>
  );
}
