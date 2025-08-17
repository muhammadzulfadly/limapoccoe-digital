import Image from "next/image";
import FloatingButtons from "@/components/FloatingButtons";

export default function BeritaInformasiPage() {
  return (
    <div>
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Judul dan Deskripsi */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Berita</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base max-w-2xl mx-auto text-center">Halaman ini menyajikan informasi terbaru seputar kegiatan, pengumuman, dan perkembangan di lingkungan Desa Limapocoe.</p>

          {/* Daftar Berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white">
                {/* Gambar */}
                <div className="relative">
                  <Image src="/images/berita-desa.png" alt="Foto Rapat" width={400} height={250} className="w-full h-52 object-cover" />
                  <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded shadow">9 Mei 2025</span>
                </div>

                {/* Isi */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Hasil sidang rapat desa</h3>
                  <p className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3">
                    Hasil sidang rapat desa yang membahas program kerja tahun anggaran 2025 serta usulan masyarakat terkait pengembangan infrastruktur, pemberdayaan ekonomi lokal, dan digitalisasi pelayanan publik di lingkungan Desa
                    Limapocoe.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center border border-black/80 rounded overflow-hidden text-sm font-medium">
              {/* Tombol Prev */}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition" aria-label="Sebelumnya">
                «
              </button>

              {/* Halaman aktif */}
              <span className="px-4 py-2 bg-[#27AE60] text-white border-l border-r border-black/80">1</span>

              {/* Tombol Next */}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition" aria-label="Berikutnya">
                »
              </button>
            </div>
          </div>
        </div>
      </section>
      <FloatingButtons />
    </div>
  );
}
