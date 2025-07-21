"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import Agama, { validateAgama } from "@/components/forms/Agama";
import Angka, { validateAngka } from "@/components/forms/Angka";
import AngkaHuruf, { validateAngkaHuruf } from "@/components/forms/AngkaHuruf";
import DokumenHilang, { validateDokumenHilang } from "@/components/forms/DokumenHilang";
import Dusun, { validateDusun } from "@/components/forms/Dusun";
import Huruf, { validateHuruf } from "@/components/forms/Huruf";
import JenisKelamin, { validateJenisKelamin } from "@/components/forms/JenisKelamin";
import NIK, { validateNIK } from "@/components/forms/NIK";
import Penghasilan, { validatePenghasilan } from "@/components/forms/Penghasilan";
import RTRW, { validateRTRW } from "@/components/forms/RTRW";
import StatusHubungan, { validateStatusHubungan } from "@/components/forms/StatusHubungan";
import StatusPerkawinan, { validateStatusPerkawinan } from "@/components/forms/StatusPerkawinan";
import Tanggal, { validateTanggal } from "@/components/forms/Tanggal";

Agama.validate = validateAgama;
Angka.validate = validateAngka;
AngkaHuruf.validate = validateAngkaHuruf;
DokumenHilang.validate = validateDokumenHilang;
Dusun.validate = validateDusun;
Huruf.validate = validateHuruf;
JenisKelamin.validate = validateJenisKelamin;
NIK.validate = validateNIK;
Penghasilan.validate = validatePenghasilan;
RTRW.validate = validateRTRW;
StatusHubungan.validate = validateStatusHubungan;
StatusPerkawinan.validate = validateStatusPerkawinan;
Tanggal.validate = validateTanggal;

const formSchemaBySuratKode = {
  SKTM: [
    { type: "separator", label: "Informasi Orang Tua" },
    {
      name: "nama_ayah",
      Component: Huruf,
      props: {
        label: "Nama Ayah",
      },
    },
    {
      name: "pekerjaan_ayah",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ayah",
      },
    },
    {
      name: "nama_ibu",
      Component: Huruf,
      props: {
        label: "Nama Ibu",
      },
    },
    {
      name: "pekerjaan_ibu",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ibu",
      },
    },
    {
      name: "jumlah_tanggungan",
      Component: Angka,
      props: {
        label: "Jumlah Tanggungan Ortu",
      },
    },
  ],
  SKU: [
    { type: "separator", label: "Informasi Usaha" },
    {
      name: "nama_usaha",
      Component: AngkaHuruf,
      props: {
        label: "Nama Usaha",
      },
    },
    {
      name: "dusun_usaha",
      Component: Dusun,
      props: {
        label: "Lokasi Usaha",
      },
    },
  ],
  SKCK: [
    { type: "separator", label: "Informasi Tambahan" },
    {
      name: "suku",
      Component: Huruf,
      props: {
        label: "Suku/Bangsa",
      },
    },
    {
      name: "agama",
      Component: Agama,
      props: {
        label: "Agama",
      },
    },
  ],
  SKD: [],
  SKPH: [
    { type: "separator", label: "Informasi Tambahan" },
    {
      name: "asal_sekolah",
      Component: AngkaHuruf,
      props: {
        label: "Asal Sekolah",
      },
    },
    {
      name: "jurusan",
      Component: Huruf,
      props: {
        label: "Jurusan",
      },
    },
    {
      name: "agama",
      Component: Agama,
      props: {
        label: "Agama",
      },
    },
    { type: "separator", label: "Informasi Orang Tua" },
    {
      name: "nama_ayah",
      Component: Huruf,
      props: {
        label: "Nama Ayah",
      },
    },
    {
      name: "alamat_ayah",
      Component: Dusun,
      props: {
        label: "Dusun Ayah",
      },
    },
    {
      name: "pekerjaan_ayah",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ayah",
      },
    },
    {
      name: "penghasilan_ayah",
      Component: Penghasilan,
      props: {
        label: "Penghasilan Ayah (Per Bulan)",
      },
    },
    {
      name: "nama_ibu",
      Component: Huruf,
      props: {
        label: "Nama Ibu",
      },
    },
    {
      name: "alamat_ibu",
      Component: Dusun,
      props: {
        label: "Dusun Ibu",
      },
    },
    {
      name: "pekerjaan_ibu",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ibu",
      },
    },
    {
      name: "penghasilan_ibu",
      Component: Penghasilan,
      props: {
        label: "Penghasilan Ibu (Per Bulan)",
      },
    },
  ],
  SKH: [
    { type: "separator", label: "Informasi Dokumen Hilang" },
    {
      name: "jenis_dokumen",
      Component: DokumenHilang,
      props: {
        label: "Jenis Dokumen Yang Hilang",
      },
    },
    {
      name: "no_dokumen",
      Component: Angka,
      props: {
        label: "Nomor Dokumen Yang Hilang",
      },
    },
    {
      name: "perkiraan_lokasi_hilang",
      Component: AngkaHuruf,
      props: {
        label: "Perkiraan Lokasi Hilang",
      },
    },
    {
      name: "no_kk",
      Component: NIK,
      props: {
        label: "Nomor KK",
      },
    },
  ],
  SKL: [
    { type: "separator", label: "Informasi Anak" },
    {
      name: "nama_anak",
      Component: Huruf,
      props: {
        label: "Nama Anak",
      },
    },
    {
      name: "tempat_lahir",
      Component: Huruf,
      props: {
        label: "Tempat Lahir Anak",
      },
    },
    {
      name: "tanggal_lahir",
      Component: Tanggal,
      props: {
        label: "Tanggal Lahir Anak",
      },
    },
    {
      name: "pukul",
      Component: Angka,
      props: {
        label: "Pukul Kelahiran (WITA)",
      },
    },
    {
      name: "jenis_kelamin",
      Component: JenisKelamin,
      props: {
        label: "Jenis Kelamin Anak",
      },
    },
    {
      name: "anak_ke",
      Component: Angka,
      props: {
        label: "Anak Ke-",
      },
    },
    {
      name: "panjang_bayi",
      Component: Angka,
      props: {
        label: "Panjang Bayi (CM)",
      },
    },
    {
      name: "berat_bayi",
      Component: Angka,
      props: {
        label: "Berat Bayi (KG)",
      },
    },
    { type: "separator", label: "Informasi Orang Tua" },
    {
      name: "nama_ayah",
      Component: Huruf,
      props: {
        label: "Nama Ayah",
      },
    },
    {
      name: "pekerjaan_ayah",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ayah",
      },
    },
    {
      name: "nama_ibu",
      Component: Huruf,
      props: {
        label: "Nama Ibu",
      },
    },
    {
      name: "pekerjaan_ibu",
      Component: Huruf,
      props: {
        label: "Pekerjaan Ibu",
      },
    },
    {
      name: "dusun",
      Component: Dusun,
      props: {
        label: "Dusun Orang Tua",
      },
    },
    {
      name: "alamat",
      Component: AngkaHuruf,
      props: {
        label: "Alamat Orang Tua",
      },
    },
  ],
  SKBR: [
    { type: "separator", label: "Informasi Tambahan" },
    {
      name: "agama",
      Component: Agama,
      props: {
        label: "Agama",
      },
    },
    {
      name: "nama_orang_tua",
      Component: Huruf,
      props: {
        label: "Nama Orang Tua",
      },
    },
    {
      name: "keperluan",
      Component: AngkaHuruf,
      props: {
        label: "Keperluan Surat",
      },
    },
  ],
};

export default function BuatSuratBaru() {
  const router = useRouter();
  const { jenisSurat } = useParams();

  const [formKey, setFormKey] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [surat, setSurat] = useState(null);
  const [suratSlug, setSuratSlug] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [tooManyRequestsMessage, setTooManyRequestsMessage] = useState("");

  const fields = formSchemaBySuratKode[formKey] || [];
  const dataFields = fields.filter((f) => f.name && f.Component);

  useEffect(() => {
    const fetchSuratAndProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token || !jenisSurat) return;

      try {
        const suratRes = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const suratData = await suratRes.json();
        const selected = suratData.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);

        if (!selected) throw new Error("Surat tidak ditemukan.");
        setSurat(selected);
        setFormKey(selected.kode_surat);
        setSuratSlug(selected.slug);

        const profileRes = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const profileJson = await profileRes.json();
        setProfileInfo({
          nik: profileJson.user?.nik || "",
          name: profileJson.user?.name || "",
          tempat_lahir: profileJson.profile?.tempat_lahir || "",
          tanggal_lahir: profileJson.profile?.tanggal_lahir || "",
          jenis_kelamin: profileJson.profile?.jenis_kelamin || "",
          alamat: profileJson.profile?.alamat || "",
          pekerjaan: profileJson.profile?.pekerjaan || "",
          dusun: profileJson.profile?.dusun || "",
          rt_rw: profileJson.profile?.rt_rw || "",
        });
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchSuratAndProfile();
  }, [jenisSurat]);

  const handleChange = ({ name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    const field = fields.find((f) => f.name === name);
    if (field?.Component?.validate) {
      const error = field.Component.validate(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    dataFields.forEach(({ name, Component }) => {
      const value = formData[name];

      // 1. Cek kosong dulu, beri error default
      if (!value || value.toString().trim() === "") {
        newErrors[name] = "Form tidak boleh kosong.";
        return; // ⛔ berhenti di sini, jangan lanjut validasi lain
      }

      // 2. Jalankan validasi tambahan jika ada
      if (typeof Component?.validate === "function") {
        const errorMsg = Component.validate(value);
        if (errorMsg) newErrors[name] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSurat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowFailed(true);
      return;
    }

    const data = new FormData();
    if (dataFields.length === 0) {
      data.append("data_surat", "");
    } else {
      dataFields.forEach(({ name }) => {
        data.append(`data_surat[${name}]`, formData[name] ?? "");
      });
    }

    try {
      const res = await fetch(`/api/letter/${suratSlug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: data,
      });

      const result = await res.json();
      if (res.status === 429) {
        setShowConfirm(false);
        setTooManyRequestsMessage(result.error || "Terlalu banyak permintaan. Silakan coba lagi dalam 2 menit");
        return;
      }

      if (!res.ok) {
        console.error("Respon Gagal:", result);
      }

      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/pengajuan-surat/${jenisSurat}`);
      }, 1800);
    } catch (err) {
      console.error("Gagal submit:", err);
      setShowConfirm(false);
      setShowFailed(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  return (
    <div className="">
      <div className="min-h-screen p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">
          Pengajuan Surat / {surat?.nama_surat} / Buat Surat Baru
        </h2>

        <div className="bg-white rounded-md shadow-sm p-8">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}

            {formKey !== "SKL" && (
              <>
                <legend className="text-xl text-start font-semibold text-gray-700">Data Pribadi</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <NIK value={profileInfo.nik ?? ""} disabled />
                  <Huruf value={profileInfo.name ?? ""} label="Nama Lengkap" disabled />
                  <Huruf value={profileInfo.tempat_lahir ?? ""} label="Tempat Lahir" disabled />
                  <Tanggal value={profileInfo.tanggal_lahir ?? ""} label="Tanggal Lahir" disabled />
                  <JenisKelamin value={profileInfo.jenis_kelamin ?? ""} disabled />
                  <AngkaHuruf value={profileInfo.alamat ?? ""} label="Alamat" disabled />
                  <Huruf value={profileInfo.pekerjaan ?? ""} label="Pekerjaan" disabled />
                  <Dusun value={profileInfo.dusun ?? ""} disabled />
                  <RTRW value={profileInfo.rt_rw ?? ""} disabled />
                </div>
              </>
            )}

            {/* Form Dinamis */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => {
                  if (field.type === "separator") {
                    return (
                      <div key={`separator-${index}`} className="col-span-full pt-4">
                        <p className="text-xl text-start font-semibold text-gray-600">{field.label}</p>
                      </div>
                    );
                  }

                  const { name, Component, props } = field;

                  return <Component key={name} name={name} value={formData[name] || ""} onChange={handleChange} error={errors[name]} {...props} />;
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="bg-[#27AE60] hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">
                Ajukan Surat
              </button>
            </div>
          </form>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[300px] text-center space-y-4 animate-fade-in">
            <h3 className="text-[#27AE60] text-xl font-bold">Konfirmasi Pengajuan Surat!</h3>
            <p className="text-sm text-gray-700">Pastikan seluruh informasi yang Anda isi sudah benar.</p>
            <button onClick={submitSurat} className="bg-[#27AE60] hover:bg-green-600 text-white w-full py-2 rounded font-semibold">
              Ajukan surat
            </button>
            <button onClick={() => setShowConfirm(false)} className="text-gray-500 hover:underline text-sm">
              Periksa Ulang
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[300px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-xl font-bold mb-2">Surat Berhasil Diajukan!</h3>
            <p className="text-sm text-gray-800 leading-relaxed">Mohon tunggu proses verifikasi dari pihak desa. Info lebih lanjut akan dikirim via WhatsApp.</p>
          </div>
        </div>
      )}

      {showFailed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[300px] text-center animate-fade-in">
            <h3 className="text-red-600 text-xl font-bold mb-2">Pengajuan Gagal!</h3>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">Maaf, pengajuan surat Anda tidak berhasil diproses. Silakan coba lagi nanti atau periksa koneksi Anda.</p>
            <button onClick={() => setShowFailed(false)} className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded font-semibold">
              Kembali
            </button>
          </div>
        </div>
      )}

      {tooManyRequestsMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[300px] text-center animate-fade-in">
            <h3 className="text-yellow-600 text-xl font-bold mb-2">Terlalu Banyak Permintaan!</h3>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">{tooManyRequestsMessage}</p>
            <button onClick={() => setTooManyRequestsMessage("")} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded font-semibold">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
