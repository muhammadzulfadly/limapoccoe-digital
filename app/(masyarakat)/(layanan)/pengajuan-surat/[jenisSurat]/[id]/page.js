"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import Nik from "@/components/form/Nik";
import NamaLengkap from "@/components/form/NamaLengkap";
import TempatLahir from "@/components/form/TempatLahir";
import TanggalLahir from "@/components/form/TanggalLahir";
import JenisKelamin from "@/components/form/JenisKelamin";
import Alamat from "@/components/form/Alamat";
import Pekerjaan from "@/components/form/Pekerjaan";
import Dusun from "@/components/form/Dusun";
import RtRw from "@/components/form/RtRw";
import Tanggal from "@/components/form/Tanggal";
import NomorDokumen from "@/components/form/NomorDokumen";

export default function DetailAjuanSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [slug, setSlug] = useState(null);
  const [surat, setSurat] = useState(null);

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
        console.log(json);
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
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-xl font-semibold mb-6">
          Detail Pengajuan Surat / {surat?.nama_surat} / {statusMap[ajuan?.status]}
        </h1>

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
                  <NomorDokumen value={ajuan.nomor_surat_tersimpan || "-"} disabled />
                  <Tanggal value={ajuan.created_at?.split("T")[0] || "-"} disabled />
                </div>
              </div>

              {/* Informasi Pribadi */}
              <legend className="pt-4 text-xl text-start font-semibold text-gray-700">Informasi Pribadi</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
                <Nik value={user?.nik || ""} disabled />
                <NamaLengkap value={user?.name || ""} disabled />
                <TempatLahir value={profile?.tempat_lahir || ""} disabled />
                <TanggalLahir value={profile?.tanggal_lahir || ""} disabled />
                <JenisKelamin value={profile?.jenis_kelamin || ""} disabled />
                <Alamat value={profile?.alamat || ""} disabled />
                <Pekerjaan value={profile?.pekerjaan || ""} disabled />
                <Dusun value={profile?.dusun || ""} disabled />
                <RtRw value={profile?.rt_rw || ""} disabled />
              </div>

              {/* Informasi Tambahan */}
              {ajuan.data_surat && Object.keys(ajuan.data_surat).length > 0 && (
                <div className="pt-4 mt-6">
                  <p className="text-xl text-start font-semibold text-gray-700 mb-4">Informasi Tambahan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(ajuan.data_surat).map(([key, value]) => (
                      <div key={key} className="capitalize">
                        <NamaLengkap value={value} disabled label={key.replaceAll("_", " ")} />
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
