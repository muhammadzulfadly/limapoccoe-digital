"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import {
  Agama,
  Alamat,
  AnakKe,
  Bangsa,
  Bpjs,
  DeskripsiPengaduan,
  Dusun,
  InputField,
  JenisKelamin,
  JudulPengaduan,
  JumlahTanggunganOrtu,
  validateTanggungan,
  KataSandi,
  KategoriPengaduan,
  KonfirmasiSandi,
  LokasiKejadian,
  LokasiUsaha,
  MasKawin,
  NamaLengkap,
  validateNama,
  NamaUsaha,
  Nik,
  NomorDokumen,
  NomorRumah,
  NomorTelepon,
  Pekerjaan,
  validatePekerjaan,
  Pendidikan,
  Penghasilan,
  PerkiraanLokasi,
  PukulKelahiran,
  Respon,
  RtRw,
  Saksi,
  StatusHubungan,
  StatusPerkawinan,
  Tanggal,
  TanggalLahir,
  TempatLahir,
  Username,
} from "@/components/form";

NamaLengkap.validate = validateNama;
Pekerjaan.validate = validatePekerjaan;
JumlahTanggunganOrtu.validate = validateTanggungan;

const formSchemaBySuratKode = {
  SKTM: [
    { type: "separator", label: "Informasi Orang Tua" },
    {
      name: "nama_ayah",
      Component: NamaLengkap,
      props: {
        label: "Nama Ayah",
      },
    },
    { name: "pekerjaan_ayah", Component: Pekerjaan },
    {
      name: "nama_ibu",
      Component: NamaLengkap,
      props: {
        label: "Nama Ibu",
      },
    },
    { name: "pekerjaan_ibu", Component: Pekerjaan },
    { name: "jumlah_tanggungan", Component: JumlahTanggunganOrtu },
  ],
  SKU: [
    { type: "separator", label: "Informasi Usaha" },
    { name: "nama_usaha", Component: NamaUsaha },
    { name: "lokasi_usaha", Component: LokasiUsaha },
  ],
  SKCK: [
    { type: "separator", label: "Informasi Tambahan" },
    { name: "suku_bangsa", Component: Bangsa },
    { name: "agama", Component: Agama },
  ],
  SKD: [],
  SKP: [
    { type: "separator", label: "Informasi Orang Tua" },
    { name: "nama_ayah", Component: Bangsa },
    { name: "alamat_ayah", Component: Agama },
    { name: "pekerjaan_ayah", Component: Agama },
    { name: "penghasilan_ayah", Component: Agama },
    { name: "nama_ibu", Component: Bangsa },
    { name: "alamat_ibu", Component: Agama },
    { name: "pekerjaan_ibu", Component: Agama },
    { name: "penghasilan_ibu", Component: Agama },
  ],
  SKKD: [
    { type: "separator", label: "Informasi Dokumen Hilang" },
    { name: "nomor_dokumen", Component: NomorDokumen },
    { name: "lokasi_hilang", Component: PerkiraanLokasi },
  ],
  SKBN: [
    { type: "separator", label: "Informasi Tambahan" },
    { name: "status", Component: StatusPerkawinan },
    { name: "suku_bangsa", Component: Bangsa },
  ],
  SKN: [
    { type: "separator", label: "Informasi Laki-laki" },
    { name: "nama_laki", Component: StatusPerkawinan },
    { name: "nik_laki", Component: Bangsa },
    { name: "tempat_lahir_laki", Component: StatusPerkawinan },
    { name: "tanggal_lahir_lahir", Component: Bangsa },
    { name: "pekerjaan_laki", Component: StatusPerkawinan },
    { name: "dusun_laki", Component: Bangsa },
    { name: "alamat_laki", Component: StatusPerkawinan },
    { type: "separator", label: "Informasi Perempuan" },
    { name: "nama_perempuan", Component: StatusPerkawinan },
    { name: "nik_perempuan", Component: Bangsa },
    { name: "tempat_lahir_perempuan", Component: StatusPerkawinan },
    { name: "tanggal_lahir_perempuan", Component: Bangsa },
    { name: "pekerjaan_perempuan", Component: StatusPerkawinan },
    { name: "dusun_perempuan", Component: Bangsa },
    { name: "alamat_perempuan", Component: StatusPerkawinan },
    { type: "separator", label: "Informasi Tambahan" },
    { name: "tanggal_pernikahan", Component: StatusPerkawinan },
    { name: "mas_kawin", Component: Bangsa },
    { name: "saksi", Component: StatusPerkawinan },
  ],
  SKK: [
    { type: "separator", label: "Informasi Anak" },
    { name: "nama_anak", Component: Bangsa },
    { name: "tempat_lahir", Component: Agama },
    { name: "tanggal_lahir", Component: Agama },
    { name: "jenis_kelamin", Component: Bangsa },
    { name: "pukul_kelahiran", Component: Agama },
    { name: "anak_ke", Component: Agama },
    { type: "separator", label: "Informasi Orang Tua" },
    { name: "nama_ayah", Component: Bangsa },
    { name: "alamat_ayah", Component: Agama },
    { name: "pekerjaan_ayah", Component: Agama },
    { name: "nama_ibu", Component: Bangsa },
    { name: "alamat_ibu", Component: Agama },
    { name: "pekerjaan_ibu", Component: Agama },
  ],
  SKBMR: [],
  BBM: [],
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
      if (!res.ok) {
        console.error("Respon Gagal:", result);
        return alert(`Gagal: ${result.message || "Terjadi kesalahan."}`);
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
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-xl font-semibold mb-6">
          Pengajuan Surat / <span className="font-semibold">{surat?.nama_surat}</span>
        </h1>

        <div className="bg-white rounded-md shadow-sm p-8">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}

            <legend className="text-xl text-start font-semibold text-gray-700">Data Pribadi</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Nik value={profileInfo.nik ?? ""} disabled />
              <NamaLengkap value={profileInfo.name ?? ""} disabled />
              <TempatLahir value={profileInfo.tempat_lahir ?? ""} disabled />
              <TanggalLahir value={profileInfo.tanggal_lahir ?? ""} disabled />
              <JenisKelamin value={profileInfo.jenis_kelamin ?? ""} disabled />
              <Alamat value={profileInfo.alamat ?? ""} disabled />
              <Pekerjaan value={profileInfo.pekerjaan ?? ""} disabled />
              <Dusun value={profileInfo.dusun ?? ""} disabled />
              <RtRw value={profileInfo.rt_rw ?? ""} disabled />
            </div>

            {/* Form Dinamis */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => {
                  if (field.type === "separator") {
                    return (
                      <div key={`separator-${index}`} className="col-span-full border-t pt-4">
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
            <h3 className="text-green-600 text-xl font-bold">Konfirmasi Pengajuan Surat!</h3>
            <p className="text-sm text-gray-700">Pastikan seluruh informasi yang Anda isi sudah benar.</p>
            <button onClick={submitSurat} className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded font-semibold">
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
            <h3 className="text-green-600 text-xl font-bold mb-2">Surat Berhasil Diajukan!</h3>
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
    </div>
  );
}
