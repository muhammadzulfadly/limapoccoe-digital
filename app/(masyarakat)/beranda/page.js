"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, User, Ban, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import FloatingButtons from "@/components/FloatingButtons";
import { useRef, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLogin = (target) => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
      setTimeout(() => {
        router.push("/auth/masuk");
      }, 1800);
    } else {
      router.push(target);
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="relative w-full aspect-[16/4] overflow-hidden bg-white">
        {/* Gambar background penuh */}
        <Image src="/bg-limapoccoe.png" alt="Banner Limapoccoe" fill className="object-cover" priority />

        {/* Overlay gelap tipis */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

        {/* Konten teks selamat datang */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white text-sm sm:text-base font-medium mb-2">SELAMAT DATANG DI WEBSITE RESMI</p>
          <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">DESA LIMAPOCCOE</h1>
        </div>
      </div>

      {/* LAYANAN KAMI */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">LAYANAN KAMI</h2>

        {/* Paragraf hanya tampil di desktop */}
        <p className="hidden sm:block max-w-2xl mx-auto text-gray-600 text-sm sm:text-base mb-12">
          Kami menyediakan platform digital untuk mempermudah masyarakat dalam mengajukan permohonan surat serta menyampaikan pengaduan secara online. Tanpa perlu datang ke kantor desa, semua layanan kini dapat diakses dengan cepat, mudah,
          dan transparan.
        </p>

        <div className="grid grid-cols-2 gap-6 sm:gap-12 justify-center items-start max-w-4xl mx-auto">
          {/* Pengajuan Surat */}
          <div className="flex flex-col items-center text-center">
            <Image src="/icons/surat.png" alt="Ikon Surat" width={50} height={50} className="mx-auto mb-3 sm:mb-4 sm:w-[100px] sm:h-[100px]" />
            <button onClick={() => handleLogin("/pengajuan-surat")} className="bg-[#27AE60] text-white px-5 py-2 rounded-full shadow-md font-medium text-sm hover:bg-green-600 transition whitespace-nowrap w-fit">
              Pengajuan Surat
            </button>

            {/* Teks hanya tampil di desktop */}
            <p className="hidden sm:block mt-3 text-gray-600 text-sm max-w-[220px]">Ajukan berbagai jenis surat secara online, mudah dan tanpa antre.</p>
          </div>

          {/* Pengaduan */}
          <div className="flex flex-col items-center text-center">
            <Image src="/icons/pengaduan.png" alt="Ikon Pengaduan" width={50} height={50} className="mx-auto mb-3 sm:mb-4 sm:w-[100px] sm:h-[100px]" />
            <button onClick={() => handleLogin("/pengaduan")} className="bg-[#27AE60] text-white px-5 py-2 rounded-full shadow-md font-medium text-sm hover:bg-green-600 transition">
              Pengaduan
            </button>
            {/* Teks hanya tampil di desktop */}
            <p className="hidden sm:block mt-3 text-gray-600 text-sm max-w-[220px]">Sampaikan keluhan atau aspirasi Anda langsung ke pihak desa, cepat dan praktis.</p>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Desa */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto ">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Sambutan Kepala Desa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Kiri: Gambar */}
            <div className="">
              <Image src="/images/tentang-desa.png" alt="Tentang Desa Limmapocoe" width={700} height={400} className="w-full h-auto object-cover" />
            </div>

            {/* Kanan: Teks */}
            <div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                Sekilas tentang desa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nunc et convallis placerat, ex nisi volutpat sapien, vel eleifend elit libero a erat. Sed nec augue at urna vehicula pretium sit
                amet vel odio. Praesent ac orci eu tortor vehicula.
              </p>

              <div className="space-y-5">
                {/* Kepala Desa */}
                <div className="flex items-center gap-4">
                  <div className="bg-[#27AE60] text-white p-3 rounded-full">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">H A Abu Bakri</p>
                    <p className="text-sm text-gray-600">Kepala Desa Limmapocoe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Desa Limmapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Profil Desa</h2>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
            <video ref={videoRef} controls className="w-full h-full object-cover" poster="/images/cover.png">
              <source src="/images/video-desa.mp4" type="video/mp4" />
              Browser Anda tidak mendukung pemutaran video.
            </video>

            {!isPlaying && (
              <button onClick={handlePlay} className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition">
                <div className="bg-[#27AE60] rounded-full p-4 sm:p-8">
                  <Play className="w-10 h-10 sm:w-20 sm:h-20 text-white" />
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Lokasi Desa Limmapocoe */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Lokasi Desa</h2>

          <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63595.16322478062!2d119.7589252125757!3d-4.989799616488523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe8ab0aeac6a13%3A0x51b73738e9481b09!2sLimpoccoe%2C%20Kec.%20Cenrana%2C%20Kabupaten%20Maros%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1755436327875!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Jumlah Penduduk Desa Limmapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Jumlah Penduduk Desa</h2>
          <p className="text-gray-700 mb-10 text-sm sm:text-base">Jumlah Penduduk dan Kepala Keluarga Desa Limapoccoe mencerminkan data demografis terkini yang digunakan sebagai dasar perencanaan dan pelayanan publik desa.</p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-6">
            {/* TOTAL PENDUDUK */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/total.png" alt="Total Penduduk" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">TOTAL PENDUDUK</p>
                <p className="text-sm sm:text-lg  text-gray-600">0 Jiwa</p>
              </div>
            </div>

            {/* KEPALA KELUARGA */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/kepala-keluarga.png" alt="Kepala Keluarga" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">KEPALA KELUARGA</p>
                <p className="text-sm sm:text-lg  text-gray-600">0 Jiwa</p>
              </div>
            </div>

            {/* PEREMPUAN */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/perempuan.png" alt="Perempuan" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">PEREMPUAN</p>
                <p className="text-sm sm:text-lg text-gray-600">0 Jiwa</p>
              </div>
            </div>

            {/* LAKI-LAKI */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/laki-laki.png" alt="Laki-Laki" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">LAKI-LAKI</p>
                <p className="text-sm sm:text-lg  text-gray-600">0 Jiwa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Desa Limmapocoe */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Berita Desa</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">Berita Desa Limmapocoe menyajikan informasi terbaru seputar kegiatan, pengumuman, dan perkembangan di lingkungan Desa Limmapocoe.</p>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden border border-[#27AE60] shadow-sm">

                <div className="relative">
                  <Image src="/images/berita-desa.png" alt="Foto Rapat" width={400} height={250} className="w-full h-52 object-cover" />
                  <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded">9 Mei 2025</span>
                </div>


                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Hasil sidang rapat desa</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Hasil sidang rapat desa Hasil sidang rapat desa Hasil sidang rapat desa Hasil sidang rapat desa Hasil sidang rapat desa Hasil sidang rapat desa</p>
                </div>
              </div>
            ))}
          </div> */}
          <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
            <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
            Belum ada Berita Desa
          </div>
        </div>
      </section>

      {/* Wisata Desa Limmapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Wisata Desa</h2>
          <p className="text-gray-700 mb-10 text-sm sm:text-base">Wisata Desa Limmapoccoe menawarkan pesona alam dan budaya lokal yang masih asri, cocok untuk rekreasi dan pengalaman wisata desa yang autentik.</p>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-[#27AE60]">

                <div className="rounded-t-2xl overflow-hidden">
                  <Image src="/images/wisata-desa.png" alt="Wisata Desa" width={400} height={250} className="w-full h-52 object-cover" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pemandian air hangat</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nunc et convallis placerat, ex nisi volutpat sapien, vel eleifend elit libero a erat.</p>
                </div>
              </div>
            ))}
          </div> */}
          <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
            <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
            Belum ada Wisata Desa
          </div>
        </div>
      </section>

      {/* Galeri Desa Limmapocoe */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Galeri Desa</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">Galeri Desa Limmapocoe menampilkan dokumentasi foto kegiatan yang berlangsung di desa Limapoccoe.</p>

          {/* 
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {["/images/galeri1.png", "/images/galeri2.png", "/images/galeri1.png", "/images/galeri2.png", "/images/galeri1.png", "/images/galeri2.png"].map((src, index) => (
              <div key={index} className="">
                <Image src={src} alt={`Galeri ${index + 1}`} width={400} height={250} />
              </div>
            ))}
          </div>
           */}
          <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
            <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
            Belum ada Galeri Desa
          </div>
        </div>
      </section>

      {/* Produk Desa Limmapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Produk Desa</h2>
          <p className="text-gray-700 mb-10 text-sm sm:text-base">Produk Desa Limapoccoe merupakan hasil karya dan potensi lokal yang mencerminkan kekayaan sumber daya dan keterampilan masyarakat desa.</p>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["/images/produk/produk1.png", "/images/produk/produk2.png", "/images/produk/produk3.png", "/images/produk/produk3.png", "/images/produk/produk3.png", "/images/produk/produk3.png"].map((src, index) => (
              <div key={index} className="rounded-xl overflow-hidden bg-white shadow-sm">
                <Image src={src} alt={`Produk ${index + 1}`} width={400} height={250} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="flex justify-between items-center bg-[#27AE60] text-white px-4 py-3 text-sm font-semibold rounded-b-xl">
                  <span>Kripik kaca</span>
                  <span>Rp. 100.000</span>
                </div>
              </div>
            ))}
          </div> */}
          <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
            <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
            Belum ada Produk Desa
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white py-12 px-4">
        <div className="max-w-screen-xl mx-auto grid gap-8 items-start text-left md:grid-cols-[2fr_2fr_1fr]">
          {/* Kolom 1: Logo dan Alamat */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Image src="/logo.png" alt="Logo Desa" width={95} height={95} />
            <div>
              <h4 className="text-lg font-semibold mb-2">Desa Limapocoe</h4>
              <p className="text-base leading-relaxed">
                Dusun Wt. Bengo, Desa Limapocoe,
                <br />
                Kec. Cenrana, Kab. Maros 90562
              </p>
            </div>
          </div>

          {/* Kolom 2: Kontak */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Hubungi Kami</h4>
            <div className="flex items-start gap-2 mb-2">
              <Mail className="w-5 h-5 mt-1" />
              <span className="text-base hover:underline break-words">desalimapoccoe07@gmail.com</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 mt-1" />
              <span className="text-base hover:underline">0881080268674</span>
            </div>
          </div>

          {/* Kolom 3: Navigasi */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Jelajahi</h4>
            <ul className="space-y-1 text-base">
              <li>
                <Link className="hover:underline" href="/beranda/profil-desa">
                  Profil Desa
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/beranda/berita-informasi">
                  Berita & Informasi
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/beranda/infografis">
                  Infografis
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <FloatingButtons />
    </>
  );
}
