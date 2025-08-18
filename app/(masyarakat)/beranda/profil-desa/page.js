import Image from "next/image";
import FloatingButtons from "@/components/FloatingButtons";

export default function ProfilDesaPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-8 space-y-12">
      {/* VISI */}
      <section id="visi" className="text-center">
        <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">Visi</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">“Hadir lebih dekat melayani masyarakat demi terwujudnya Desa Limapoccoe yang lebih Maju, Mandiri, Sehat dan Sejahtera”</p>
        </div>
      </section>

      {/* MISI */}
      <section id="misi" className="text-center">
        <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-8">Misi</h2>
          <ul className="max-w-3xl mx-auto text-left space-y-5">
            {[
              "Mengoptimalkan kinerja perangkat desa sesuai tugas pokok dan fungsi demi tercapainya pelayanan yang baik dan efisien bagi masyarakat.",
              "Membangun koordinasi antar mitra kerja.",
              "Meningkatkan kualitas sumber daya manusia serta memanfaatkan sumber daya alam untuk kesejahteraan masyarakat.",
              "Meningkatkan kapasitas kelembagaan yang ada di Desa Limapoccoe.",
              "Meningkatkan kualitas kesehatan masyarakat.",
              "Meningkatkan keterlibatan masyarakat secara langsung dalam berbagai bentuk kegiatan di semua bidang.",
              "Melaksanakan pembangunan secara akuntabel, transparan, dan dapat dipertanggungjawabkan.",
              "Meningkatkan kegiatan pembinaan dan pemberdayaan masyarakat.",
              "Mengembangkan objek wisata di Desa Limapoccoe.",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-none">
                <div className="w-10 h-10 aspect-square rounded-full bg-[#27AE60] text-white flex items-center justify-center font-mono font-bold leading-none">{index + 1}</div>
                <p className="text-gray-700 text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STRUKTUR DESA */}
      <section id="struktur" className="text-center">
        <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">Struktur Desa</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">Struktur organisasi Pemerintah Desa Limapocoe.</p>

          <figure className="mt-8 md:mt-10">
            <Image src="/images/struktur-desa.png" alt="Bagan Struktur Desa Limapocoe" width={1600} height={900} priority className="w-full h-auto rounded-2xl border border-gray-200 shadow-sm" sizes="(max-width: 768px) 100vw, 1024px" />
            <figcaption className="mt-2 text-center text-sm text-gray-500">Bagan Struktur Pemerintah Desa Limapocoe</figcaption>
          </figure>
        </div>
      </section>
      <FloatingButtons />
    </div>
  );
}
