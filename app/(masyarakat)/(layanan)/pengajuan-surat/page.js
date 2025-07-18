"use client";

import { useEffect, useState } from "react";
import SedangProsesCard from "@/components/card/SedangProses";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import DitolakCard from "@/components/card/DiTolak";
import SelesaiCard from "@/components/card/Selesai";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPengajuan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // 1. Fetch daftar jenis surat
        const suratRes = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const suratData = await suratRes.json();
        const jenisSurat = suratData.jenis_surat || [];

        // 2. Fetch semua pengajuan per surat slug
        const allPengajuan = await Promise.all(
          jenisSurat.map(async (surat) => {
            const res = await fetch(`/api/letter/${surat.slug}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            return data.pengajuan_surat || [];
          })
        );

        // 3. Gabungkan semua pengajuan
        const flatPengajuan = allPengajuan.flat();
        setPengajuan(flatPengajuan);
      } catch (err) {
        console.error("Gagal memuat pengajuan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPengajuan();
  }, []);

  // Hitung jumlah berdasarkan status
  const countByStatus = (key) =>
    pengajuan.filter((item) => item.status === key).length;

  const jumlahProcessed = countByStatus("processed");
  const jumlahConfirmed = countByStatus("confirmed");
  const jumlahRejected = countByStatus("rejected");
  const jumlahApproved = countByStatus("approved");

  return (
<div className="flex flex-col min-h-screen bg-[#EDF0F5]">
    {/* Konten utama */}
    <div className="flex-1 p-8 space-y-8">
      <section>
        <h2 className="font-semibold text-2xl mb-4">Pengajuan Surat</h2>

        {loading ? (
          <p className="text-gray-500 italic">Memuat data...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <SedangProsesCard count={jumlahProcessed} />
            <ButuhKonfirmasiCard count={jumlahConfirmed} />
            <DitolakCard count={jumlahRejected} />
            <SelesaiCard count={jumlahApproved} />
          </div>
        )}
      </section>
    </div>
    </div>
  );
}
