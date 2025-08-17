import Image from "next/image";
import FloatingButtons from "@/components/FloatingButtons";

export default function ProfilDesaPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-8 space-y-12">
      {/* VISI */}
      <section id="visi" className="text-center">
        <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">Visi</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            “Terwujudnya Desa Limapocoe yang maju, mandiri, berdaya saing, dan sejahtera melalui pelayanan publik yang cepat, transparan, serta partisipasi aktif masyarakat.”
          </p>
        </div>
      </section>

      {/* MISI */}
      <section id="misi" className="text-center">
        <div className="bg-white border border-gray-200 shadow rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800">Misi</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Menyelenggarakan pemerintahan desa yang transparan dan akuntabel; meningkatkan kualitas layanan publik berbasis digital yang mudah dan inklusif; mendorong pertumbuhan ekonomi lokal melalui penguatan UMKM dan pertanian
            berkelanjutan; memperkuat infrastruktur dan konektivitas; melestarikan lingkungan serta nilai budaya; dan memperluas partisipasi masyarakat dalam perencanaan, pelaksanaan, dan pengawasan pembangunan desa.
          </p>
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
