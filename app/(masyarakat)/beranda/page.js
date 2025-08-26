"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, User, Ban, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import FloatingButtons from "@/components/FloatingButtons";
import { useRef, useState, useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beritaTerbaru, setBeritaTerbaru] = useState([]);
  const [wisataTerbaru, setWisataTerbaru] = useState([]);
  const [galeriTerbaru, setGaleriTerbaru] = useState([]);
  const [produkTerbaru, setProdukTerbaru] = useState([]);
  const [videoProfilDesa, setVideoProfilDesa] = useState(null);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [infoPenduduk, setInfoPenduduk] = useState({
    total: "...",
    keluarga: "...",
    perempuan: "...",
    laki: "...",
  });

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  function convertToYouTubeEmbed(url) {
    try {
      const yt = new URL(url);
      if (yt.hostname.includes("youtube.com") && yt.searchParams.has("v")) {
        return `https://www.youtube.com/embed/${yt.searchParams.get("v")}`;
      }

      if (yt.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${yt.pathname.slice(1)}`;
      }

      return url; // fallback
    } catch {
      return url;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/information");
        const result = await res.json();
        const data = result.data || [];

        // Pisahkan berdasarkan kategori dan ambil 3 data terbaru
        const sortByDate = (arr) => [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
        const sortByDateAsc = (arr) => [...arr].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        setBeritaTerbaru(sortByDate(data.filter((d) => d.kategori === "berita")));
        setWisataTerbaru(sortByDate(data.filter((d) => d.kategori === "wisata")));
        setGaleriTerbaru(sortByDate(data.filter((d) => d.kategori === "galeri")));
        setProdukTerbaru(sortByDate(data.filter((d) => d.kategori === "produk")));

        const defaultSlide = {
          isDefault: true, // penanda khusus untuk slide pertama
        };

        const bannerData = sortByDateAsc(data.filter((d) => d.kategori === "banner"));
        setBanners([defaultSlide, ...bannerData]);

        // Ambil video profil desa
        const videoItem = data.find((d) => d.kategori === "pengumuman" && d.judul === "Tautan Video Profil Desa");
        const youtubeEmbed = videoItem?.konten ? convertToYouTubeEmbed(videoItem.konten) : null;
        setVideoProfilDesa(youtubeEmbed);
      } catch (err) {
        console.error("Gagal ambil data informasi:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStatistik = async () => {
      const token = localStorage.getItem("token");

      try {
        const [resPenduduk, resKeluarga, resKelamin] = await Promise.all([
          fetch("/api/population/jumlah-penduduk", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/jumlah-keluarga", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/jenis-kelamin", {
            headers: { Authorization: token },
          }),
        ]);

        const penduduk = await resPenduduk.json();
        const keluarga = await resKeluarga.json();
        const kelamin = await resKelamin.json();

        const jumlahL = kelamin.find((item) => item.jenis_kelamin === "Laki-laki")?.total ?? 0;
        const jumlahP = kelamin.find((item) => item.jenis_kelamin === "Perempuan")?.total ?? 0;

        setInfoPenduduk({
          total: penduduk?.jumlah_penduduk ?? 0,
          keluarga: keluarga?.jumlah_keluarga ?? 0,
          perempuan: jumlahP,
          laki: jumlahL,
        });
      } catch (err) {
        console.error("Gagal memuat data statistik penduduk:", err);
      }
    };

    fetchStatistik();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/information");
        const result = await res.json();
        const data = result.data || [];

        // Pisahkan berdasarkan kategori dan ambil 3 data terbaru
        const sortByDate = (arr) => [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

        setBeritaTerbaru(sortByDate(data.filter((d) => d.kategori === "berita")));
        setWisataTerbaru(sortByDate(data.filter((d) => d.kategori === "wisata")));
        setGaleriTerbaru(sortByDate(data.filter((d) => d.kategori === "galeri")));
        setProdukTerbaru(sortByDate(data.filter((d) => d.kategori === "produk")));
      } catch (err) {
        console.error("Gagal ambil data informasi:", err);
      }
    };

    fetchData();
  }, []);

  function getImageSrc(gambar) {
    return gambar ? `/api/information/photo/${gambar.split("/").pop()}` : "/images/no-image.png";
  }

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
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] overflow-hidden bg-white">
        {banners.length > 0 && (
          <>
            {banners[currentBannerIndex].isDefault ? (
              // Slide default
              <>
                <div className="absolute inset-0 bg-[url('/bg-limapoccoe.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                  <p className="text-white text-sm sm:text-base font-medium mb-2">SELAMAT DATANG DI WEBSITE RESMI</p>
                  <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">DESA LIMAPOCCOE</h1>
                </div>
              </>
            ) : (
              // Slide dari kategori "banner"
              <>
                <Image src={`/api/information/photo/${banners[currentBannerIndex].gambar.split("/").pop()}`} alt={`Banner ${currentBannerIndex}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />
                {/* Tidak ada tulisan di sini */}
              </>
            )}

            {/* Tombol navigasi */}
            {banners.length > 1 && (
              <>
                <button onClick={prevBanner} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 p-2 rounded-full text-white">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextBanner} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 p-2 rounded-full text-white">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </>
        )}
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
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">Sambutan Kepala Desa</h2>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Foto Kepala Desa */}
            <div className="flex justify-center lg:w-[40%]">
              <div className="rounded-full p-2 shadow-md">
                <Image
                  src="/images/kepdes.png"
                  alt="Kepala Desa"
                  width={300}
                  height={300} // Ubah jadi square agar bundar sempurna
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            {/* Kanan: Teks */}
            <div className="lg:w-[60%]">
              {/* Scrollable Sambutan - Batasi tinggi agar tampak pendek di awal */}
              <div className="max-h-[350px] overflow-y-auto pr-2">
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    <strong>Assalamu’alaikum Warahmatullahi Wabarakatuh,</strong>
                  </p>
                  <p>
                    Dengan penuh rasa syukur, kita panjatkan ke hadirat Allah SWT karena atas limpahan rahmat-Nya, kita semua masih diberikan kesehatan dan kesempatan untuk terus berbuat yang terbaik bagi desa tercinta, Desa Limapoccoe.
                    Website ini kami hadirkan bukan sekadar sebagai media informasi, tetapi juga sebagai jembatan komunikasi antara pemerintah desa dengan seluruh warga. Melalui platform digital ini, kita dapat bersama-sama membangun
                    keterbukaan, memperkuat pelayanan publik, serta memperkenalkan potensi Desa Limapoccoe kepada dunia luar.
                  </p>
                  <p>
                    Kami percaya, pembangunan desa tidak akan berhasil tanpa kebersamaan dan partisipasi aktif masyarakat. Dengan adanya teknologi, kita memiliki peluang besar untuk menjadikan pelayanan lebih cepat, transparan, dan mudah
                    dijangkau.
                  </p>
                  <p>Harapan saya, website ini menjadi wadah yang hidup:</p>
                  <ul className="list-disc list-inside">
                    <li>Tempat masyarakat mendapatkan informasi resmi desa.</li>
                    <li>Ruang bagi warga untuk menyampaikan aspirasi, kritik, maupun saran.</li>
                    <li>Sarana promosi potensi desa, baik di bidang pertanian, ekonomi kreatif, maupun budaya.</li>
                  </ul>
                  <p>Mari kita jadikan Desa Limapoccoe sebagai desa yang maju, sejahtera, dan tetap berpegang pada nilai kebersamaan. Semoga Allah SWT senantiasa meridai langkah kita.</p>
                  <p>
                    <strong>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</strong>
                  </p>
                </div>
              </div>

              {/* Informasi Kepala Desa - Tetap terlihat */}
              <div className="flex items-center gap-4 mt-6">
                <div className="bg-[#27AE60] text-white p-3 rounded-full">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">H. A. ABU BAKRI</p>
                  <p className="text-sm text-gray-600">Kepala Desa Limapoccoe</p>
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
          <div className="aspect-w-16 aspect-h-9">
            {videoProfilDesa ? (
              <iframe src={videoProfilDesa} width="100%" height="480" allow="autoplay" allowFullScreen className="rounded-xl"></iframe>
            ) : (
              <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-xl text-gray-500 italic text-center">Belum ada Profil Desa.</div>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83238.12680236783!2d119.76345437124547!3d-4.9913258515696635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe8ab0aeac6a13%3A0x51b73738e9481b09!2sLimpoccoe%2C%20Kec.%20Cenrana%2C%20Kabupaten%20Maros%2C%20Sulawesi%20Selatan!5e1!3m2!1sid!2sid!4v1755491659447!5m2!1sid!2sid"
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
                <p className="text-sm sm:text-lg text-gray-600">
                  {infoPenduduk.total} {infoPenduduk.total !== "..." ? "Jiwa" : ""}
                </p>
              </div>
            </div>

            {/* KEPALA KELUARGA */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/kepala-keluarga.png" alt="Kepala Keluarga" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">KEPALA KELUARGA</p>
                <p className="text-sm sm:text-lg text-gray-600">
                  {infoPenduduk.keluarga} {infoPenduduk.keluarga !== "..." ? "KK" : ""}
                </p>
              </div>
            </div>

            {/* PEREMPUAN */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/perempuan.png" alt="Perempuan" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">PEREMPUAN</p>
                <p className="text-sm sm:text-lg text-gray-600">
                  {infoPenduduk.perempuan} {infoPenduduk.perempuan !== "..." ? "Jiwa" : ""}
                </p>
              </div>
            </div>

            {/* LAKI-LAKI */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src="/images/penduduk/laki-laki.png" alt="Laki-Laki" width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg  text-gray-600">LAKI-LAKI</p>
                <p className="text-sm sm:text-lg text-gray-600">
                  {infoPenduduk.laki} {infoPenduduk.laki !== "..." ? "Jiwa" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Desa Limmapocoe */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Berita Desa</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">Berita Desa Limapoccoe menyajikan informasi terbaru seputar kegiatan, pengumuman, dan perkembangan di lingkungan Desa Limapoccoe.</p>

          {beritaTerbaru.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
              <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
              Belum ada Berita Desa
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {beritaTerbaru.map((item, index) => (
                  <Link href={`/beranda/informasi-desa/${item.slug}`} key={item.id}>
                    <div className={`rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white ${index > 0 ? "md:block hidden" : ""}`}>
                      <div className="relative">
                        <Image src={getImageSrc(item.gambar)} alt={item.judul} width={400} height={250} className="w-full h-52 object-cover" />
                        <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded shadow">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.judul}</h3>
                        <div className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3" dangerouslySetInnerHTML={{ __html: item.konten || "Tidak ada konten." }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-end">
                <Link href={{ pathname: "/beranda/informasi-desa", query: { kategori: "berita" } }} className="text-sm font-medium text-[#27AE60] hover:underline">
                  Lihat lebih banyak →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Wisata Desa Limmapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Wisata Desa</h2>
          <p className="text-gray-700 mb-10 text-sm sm:text-base">Wisata Desa Limapoccoe menawarkan pesona alam dan budaya lokal yang masih asri, cocok untuk rekreasi dan pengalaman wisata desa yang autentik.</p>

          {wisataTerbaru.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
              <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
              Belum ada Wisata Desa
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {wisataTerbaru.map((item, index) => (
                  <Link href={`/beranda/informasi-desa/${item.slug}`} key={item.id}>
                    <div key={item.id} className={`rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white ${index > 0 ? "md:block hidden" : ""}`}>
                      <div className="relative">
                        <Image src={getImageSrc(item.gambar)} alt={item.judul} width={400} height={250} className="w-full h-52 object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.judul}</h3>
                        <div className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3" dangerouslySetInnerHTML={{ __html: item.konten || "Tidak ada konten." }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-end">
                <Link href={{ pathname: "/beranda/informasi-desa", query: { kategori: "wisata" } }} className="text-sm font-medium text-[#27AE60] hover:underline">
                  Lihat lebih banyak →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Galeri Desa Limmapocoe */}
      <section className="bg-[#F0FFF6] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Galeri Desa</h2>
          <p className="text-gray-600 mb-10 text-sm sm:text-base">Galeri Desa Limapoccoe menampilkan dokumentasi foto kegiatan yang berlangsung di Desa Limapoccoe.</p>

          {galeriTerbaru.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
              <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
              Belum ada Galeri Desa
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {galeriTerbaru.map((item, index) => (
                  <Link href={`/beranda/informasi-desa/${item.slug}`} key={item.id}>
                    <div key={item.id} className={`rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white ${index > 0 ? " md:block hidden" : ""}`}>
                      <div className="relative">
                        <Image src={getImageSrc(item.gambar)} alt={item.judul} width={400} height={250} className="w-full h-52 object-cover" />
                        <span className="absolute bottom-2 right-2 bg-[#27AE60] text-white text-xs font-medium px-3 py-1 rounded shadow">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-end">
                <Link href={{ pathname: "/beranda/informasi-desa", query: { kategori: "galeri" } }} className="text-sm font-medium text-[#27AE60] hover:underline">
                  Lihat lebih banyak →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Produk Desa Limapocoe */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Produk Desa</h2>
          <p className="text-gray-700 mb-10 text-sm sm:text-base">Produk Desa Limapoccoe merupakan hasil karya dan potensi lokal yang mencerminkan kekayaan sumber daya dan keterampilan masyarakat desa.</p>

          {produkTerbaru.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-600 italic text-center">
              <Ban className="w-6 h-6 text-gray-600 mr-2 shrink-0" />
              Belum ada Produk Desa
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {produkTerbaru.map((item, index) => (
                  <Link href={`/beranda/informasi-desa/${item.slug}`} key={item.id}>
                    <div key={item.id} className={`rounded-xl overflow-hidden border border-[#27AE60] shadow-sm bg-white ${index > 0 ? "md:block hidden" : ""}`}>
                      <div className="relative">
                        <Image src={getImageSrc(item.gambar)} alt={item.judul} width={400} height={250} className="w-full h-52 object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.judul}</h3>
                        <div className="text-sm text-gray-700 leading-relaxed text-justify line-clamp-3" dangerouslySetInnerHTML={{ __html: item.konten || "Tidak ada konten." }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-end">
                <Link href={{ pathname: "/beranda/informasi-desa", query: { kategori: "produk" } }} className="text-sm font-medium text-[#27AE60] hover:underline">
                  Lihat lebih banyak →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white py-12 px-4">
        <div className="max-w-screen-xl mx-auto grid gap-8 items-start text-left md:grid-cols-[2fr_2fr_1fr]">
          {/* Kolom 1: Logo dan Alamat */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Image src="/logo.png" alt="Logo Desa" width={95} height={95} />
            <div>
              <h4 className="text-lg font-semibold mb-2">Desa Limapoccoe</h4>
              <p className="text-base leading-relaxed">
                Dusun Wt. Bengo, Desa Limapoccoe,
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
              <span className="text-base hover:underline">085338807929</span>
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
                <Link className="hover:underline" href="/beranda/informasi-desa">
                  Informasi Desa
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/beranda/infografis-desa">
                  Infografis Desa
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
