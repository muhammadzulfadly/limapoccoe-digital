"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const Sidebar = () => {
  const [openSurat, setOpenSurat] = useState(false);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJenisSurat = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/surat`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          setJenisSurat(result.jenis_surat || []);
        } else {
          setError(result.message || "Gagal memuat data surat.");
        }
      } catch (err) {
        setError("Gagal menghubungi server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJenisSurat();
  }, []);

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Pelayanan Desa</h2>

        {/* Dropdown Jenis Surat */}
        <div className="mt-2">
          <button
            onClick={() => setOpenSurat(!openSurat)}
            className="flex items-center justify-between w-full text-left font-medium px-2 py-1 rounded hover:bg-teal-100 transition"
          >
            <span>Pembuatan Surat</span>
            <FaChevronDown
              className={`transition-transform ${openSurat ? "rotate-180" : ""}`}
            />
          </button>

          {openSurat && (
            <div className="ml-4 mt-2 space-y-1 text-sm">
              {loading && <p className="text-gray-500 text-sm">Memuat jenis surat...</p>}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              {jenisSurat.map((surat) => (
                <Link
                  key={surat.id}
                  href={`/layanan/pengajuan-surat/${surat.slug}`}
                  className="block px-2 py-1 rounded hover:bg-teal-100 transition"
                >
                  {surat.nama}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Link ke Halaman Pengaduan */}
        <div className="mt-4">
          <Link
            href="/layanan/pengaduan"
            className="block font-medium px-2 py-1 rounded hover:bg-teal-100 transition"
          >
            Pengaduan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
