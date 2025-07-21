"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";


import AngkaHuruf from "@/components/forms/AngkaHuruf";
import Dusun from "@/components/forms/Dusun";
import Huruf from "@/components/forms/Huruf";
import JenisKelamin from "@/components/forms/JenisKelamin";
import NIK from "@/components/forms/NIK";
import RTRW from "@/components/forms/RTRW";
import Tanggal from "@/components/forms/Tanggal";
import Date from "@/components/forms/Date";

export default function DetailAjuanSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [slug, setSlug] = useState(null);
  const [surat, setSurat] = useState(null);
  const [formKey, setFormKey] = useState(null);

  const statusMap = {
    processed: "Sedang Proses",
    confirmed: "Butuh Konfirmasi",
    rejected: "Ditolak",
    approved: "Selesai",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !jenisSurat) return;

    const fetchSlug = async () => {
      try {
        const res = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        const found = data.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);
        if (found) {
          setFormKey(found.kode_surat);
          setSlug(found.slug);
          setSurat(found);
        } else throw new Error("Surat tidak ditemukan");
      } catch (err) {
        console.error("⚠️ Gagal mendapatkan slug:", err);
      }
    };

    fetchSlug();
  }, [jenisSurat]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!slug || !id) return;

    const fetchDetailAjuan = async () => {
      try {
        const res = await fetch(`/api/letter/${slug}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        setAjuan(json.pengajuan_surat);
      } catch (err) {
        console.error("⚠️ Gagal fetch detail ajuan:", err);
      }
    };

    fetchDetailAjuan();
  }, [slug, id]);

  const user = ajuan?.user;
  const profile = user?.profile_masyarakat;

  return (
    <div className="">
      <div className="min-h-screen p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">
          Pengajuan Surat / {surat?.nama_surat} / {statusMap[ajuan?.status]}
        </h2>

        <div className="bg-white rounded-md shadow-sm p-8">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>

          {!ajuan ? (
            <p className="text-gray-600">🔄 Memuat data ajuan...</p>
          ) : (
            <>
              {/* Informasi Pengajuan Surat*/}
              <div className="pt-4 mb-6">
                <p className="text-xl text-start font-semibold text-gray-700 mb-4">Informasi Pengajuan Surat</p>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <AngkaHuruf value={ajuan.nomor_surat_tersimpan || "-"} disabled label="Nomor Surat"/>
                  <Date value={ajuan.created_at?.split("T")[0] || "-"} disabled />
                </div>
              </div>

              {/* Informasi Pribadi */}
              {formKey !== "SKL" && (
                <>
                  <legend className="pt-4 text-xl text-start font-semibold text-gray-700">Informasi Pribadi</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
                    <NIK value={user?.nik || ""} disabled />
                    <Huruf value={user?.name || ""} disabled label="Nama Lengkap"/>
                    <Huruf value={profile?.tempat_lahir || ""} disabled label="Tempat Lahir"/>
                    <Tanggal value={profile?.tanggal_lahir || ""} disabled label="Tanggal Lahir"/>
                    <JenisKelamin value={profile?.jenis_kelamin || ""} disabled />
                    <AngkaHuruf value={profile?.alamat || ""} disabled label="Alamat"/>
                    <Huruf value={profile?.pekerjaan || ""} disabled label="Pekerjaan"/>
                    <Dusun value={profile?.dusun || ""} disabled />
                    <RTRW value={profile?.rt_rw || ""} disabled />
                  </div>
                </>
              )}

              {/* Informasi Tambahan */}
              {ajuan.data_surat && Object.keys(ajuan.data_surat).length > 0 && (
                <div className="pt-4 mt-6">
                  <p className="text-xl text-start font-semibold text-gray-700 mb-4">Informasi Tambahan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(ajuan.data_surat).map(([key, value]) => (
                      <div key={key} className="capitalize">
                        <AngkaHuruf value={value} disabled label={key.replaceAll("_", " ")} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
