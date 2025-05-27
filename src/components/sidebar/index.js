"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const Sidebar = () => {
  const [openSurat, setOpenSurat] = useState(false);

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Pelayanan Desa</h2>

        {/* Pembuatan Surat - dengan Dropdown */}
        <div className="mt-2">
          <button onClick={() => setOpenSurat(!openSurat)} className="flex items-center justify-between w-full text-left font-medium block px-2 py-1 rounded hover:bg-teal-100 transition">
            <span>Pembuatan Surat</span>
            <FaChevronDown className={`transition-transform ${openSurat ? "rotate-180" : ""}`} />
          </button>
          {openSurat && (
            <ul className="ml-4 mt-2 space-y-1 text-sm">
              <li>
                <Link href="/layanan/pengajuan-surat/sk-tidak-mampu" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Tidak Mampu
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-usaha" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Usaha
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/skck" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SKCK
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-bbm" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Rekomendasi BBM
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-kelahiran" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Kelahiran
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-kehilangan-kk" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Kehilangan KK
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-belum-menikah" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Belum Menikah
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-mahar" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Mahar
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-nikah" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Nikah
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-penghasilan" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Penghasilan
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/surat-domisili" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  Surat Domisili
                </Link>
              </li>
              <li>
                <Link href="/layanan/pengajuan-surat/sk-belum-memiliki-rumah" className="block px-2 py-1 rounded hover:bg-teal-100 transition">
                  SK Belum Memiliki Rumah
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Pengaduan - Tanpa Dropdown */}
        <div className="mt-4">
          <Link href="/layanan/pengaduan" className="block font-medium px-2 py-1 rounded hover:bg-teal-100 transition">
            Pengaduan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
