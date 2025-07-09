"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailAjuanSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [slug, setSlug] = useState(null);

  // Ambil slug dari ID surat via internal API
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
        const found = data.jenis_surat?.find((item) => item.id.toString() === jenisSurat);
        if (found) setSlug(found.slug);
        else throw new Error("Surat tidak ditemukan");
      } catch (err) {
        console.error("⚠️ Gagal mendapatkan slug:", err);
      }
    };

    fetchSlug();
  }, [jenisSurat]);

  // Fetch detail pengajuan setelah slug tersedia
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📄 Detail Pengajuan Surat</h2>

      {!ajuan ? (
        <p>🔄 Memuat data ajuan...</p>
      ) : (
        <>
          {/* 👤 Informasi Pengaju */}
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">👤 Data Pengaju:</h3>
            <ul className="text-sm text-gray-800 list-inside list-disc">
              <li>
                <strong>Nama:</strong> {ajuan.user?.name || "-"}
              </li>
              <li>
                <strong>NIK:</strong> {ajuan.user?.nik || "-"}
              </li>
              <li>
                <strong>Tempat/Tanggal Lahir:</strong> {ajuan.user?.profile_masyarakat?.tempat_lahir || "-"} / {ajuan.user?.profile_masyarakat?.tanggal_lahir || "-"}
              </li>
              <li>
                <strong>Jenis Kelamin:</strong> {ajuan.user?.profile_masyarakat?.jenis_kelamin || "-"}
              </li>
              <li>
                <strong>Alamat:</strong> {ajuan.user?.profile_masyarakat?.alamat || "-"}
              </li>
            </ul>
          </div>

          {/* 📝 Info Ajuan */}
          <div className="mb-6">
            <p className="mb-2">
              <strong>Status:</strong> {ajuan.status}
            </p>
            <p className="mb-2">
              <strong>Nomor Surat:</strong> {ajuan.nomor_surat || "-"}
            </p>
            <p className="mb-2">
              <strong>Lampiran:</strong>{" "}
              {Array.isArray(ajuan.lampiran) && ajuan.lampiran.length > 0
                ? ajuan.lampiran.map((file, idx) => (
                    <a key={idx} href={`/api/file/${file}`} className="text-blue-600 underline mr-2" target="_blank">
                      File {idx + 1}
                    </a>
                  ))
                : "-"}
            </p>
          </div>

          {/* 📋 Formulir */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📋 Data Formulir Pengajuan:</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {Object.entries(ajuan.data_surat || {}).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.replaceAll("_", " ")}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <button onClick={() => router.back()} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              ⬅️ Kembali
            </button>
          </div>
        </>
      )}
    </div>
  );
}
