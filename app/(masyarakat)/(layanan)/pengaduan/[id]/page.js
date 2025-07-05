"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function DetailPengaduanPage() {
  const router = useRouter();
  const { id } = useParams();

  const [pengaduan, setPengaduan] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Ambil user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Gagal parsing user dari localStorage");
      }
    }

    // Fetch pengaduan dari API
    const fetchPengaduan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/complaint/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data pengaduan.");
        }

        const data = await res.json();
        setPengaduan(data.aduan);
      } catch (err) {
        console.error(err);
        setErrorMsg("Gagal memuat detail pengaduan.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPengaduan();
  }, [id]);

  if (loading) return <p className="p-8">Memuat...</p>;
  if (errorMsg) return <p className="p-8 text-red-500">{errorMsg}</p>;
  if (!pengaduan) return <p className="p-8">Data tidak ditemukan.</p>;

  return (
    <div className="bg-[#EDF0F5] min-h-screen p-8">
      <h1 className="text-lg font-semibold mb-6">
        Pengaduan / <span className="font-bold">Detail Pengaduan</span>
      </h1>

      <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" />
          Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-500">Nama Lengkap</label>
            <div className="mt-1 p-2 border rounded bg-gray-100">{user?.name || pengaduan.name}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Kategori</label>
            <div className="mt-1 p-2 border rounded bg-gray-100">{pengaduan.category}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Judul</label>
            <div className="mt-1 p-2 border rounded bg-gray-100">{pengaduan.title}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Lokasi Kejadian</label>
            <div className="mt-1 p-2 border rounded bg-gray-100">{pengaduan.location}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Status</label>
            <div className="mt-1 p-2 border rounded bg-gray-100 capitalize">{pengaduan.status}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Tanggal Dibuat</label>
            <div className="mt-1 p-2 border rounded bg-gray-100">{new Date(pengaduan.created_at).toLocaleString()}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Deskripsi</label>
            <div className="mt-1 p-2 border rounded bg-gray-100 whitespace-pre-line">{pengaduan.content}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Bukti Foto</label>
            {pengaduan.evidence ? (
              <img src={`/api/photo/${pengaduan.evidence}`} alt="Bukti" className="mt-2 max-w-full rounded border" />
            ) : (
              <div className="mt-1 p-2 border rounded bg-gray-100 text-sm text-gray-500 italic">Tidak ada foto</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
