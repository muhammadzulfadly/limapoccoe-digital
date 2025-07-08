"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Alamat, { validateAlamat } from "@/components/form/Alamat";
import Dusun, { validateDusun } from "@/components/form/Dusun";
import RtRw, { validateRtRw } from "@/components/form/RtRw";
import TanggalLahir, { validateTanggal } from "@/components/form/TanggalLahir";
import TempatLahir, { validateTempat } from "@/components/form/TempatLahir";
import JenisKelamin, { validateGender } from "@/components/form/JenisKelamin";
import Pekerjaan, { validatePekerjaan } from "@/components/form/Pekerjaan";

export default function LengkapiProfilPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    alamat: "",
    dusun: "",
    rt_rw: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "",
    pekerjaan: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    const validators = {
      alamat: validateAlamat,
      dusun: validateDusun,
      rt_rw: validateRtRw,
      tanggal_lahir: validateTanggal,
      tempat_lahir: validateTempat,
      jenis_kelamin: validateGender,
      pekerjaan: validatePekerjaan,
    };
    const validate = validators[name];
    if (validate) {
      const message = validate(value, form);
      setErrors((prev) => ({ ...prev, [name]: message }));
    }
  };

  const validateAll = () => {
    const newErrors = {
      alamat: validateAlamat(form.alamat),
      dusun: validateDusun(form.dusun),
      rt_rw: validateRtRw(form.rt_rw),
      tanggal_lahir: validateTanggal(form.tanggal_lahir),
      tempat_lahir: validateTempat(form.tempat_lahir),
      jenis_kelamin: validateGender(form.jenis_kelamin),
      pekerjaan: validatePekerjaan(form.pekerjaan),
    };
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1800);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">
        ←
      </button>
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">LENGKAPI PROFIL</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Alamat value={form.alamat} onChange={handleChange} error={errors.alamat} />
        <div className="flex gap-4">
          <div className="w-1/2">
            <Dusun value={form.dusun} onChange={handleChange} error={errors.dusun} />
          </div>
          <div className="w-1/2">
            <RtRw value={form.rt_rw} onChange={handleChange} error={errors.rt_rw} />
          </div>
        </div>
        <div className="border-y border-gray-400 my-10" />
        <div className="flex gap-4">
          <div className="w-1/2">
            <TanggalLahir value={form.tanggal_lahir} onChange={handleChange} error={errors.tanggal_lahir} />
          </div>
          <div className="w-1/2">
            <TempatLahir value={form.tempat_lahir} onChange={handleChange} error={errors.tempat_lahir} />
          </div>
        </div>
        <JenisKelamin value={form.jenis_kelamin} onChange={handleChange} error={errors.jenis_kelamin} />
        <Pekerjaan value={form.pekerjaan} onChange={handleChange} error={errors.pekerjaan} />

        <div className="flex justify-between mt-8">
          <button type="button" onClick={() => router.push("/dashboard")} className="border border-[#27AE60] text-[#27AE60] rounded px-6 py-2 hover:bg-green-50">
            Lanjutkan nanti
          </button>
          <button type="submit" disabled={loading} className="bg-[#27AE60] text-white rounded px-14 py-2 hover:bg-green-700 disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-4">Berhasil!</h3>
            <p className="text-sm text-[#141414] leading-relaxed">Profil Anda berhasil disimpan. Terima kasih telah melengkapi data diri Anda.</p>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[320px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-4">Gagal menyimpan!</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-4">Maaf, terjadi kesalahan saat menyimpan data. Silakan lanjutkan nanti atau periksa koneksi internet Anda.</p>
            <button onClick={() => setShowError(false)} className="bg-[#EB5757] hover:bg-[#d84747] text-white rounded px-6 py-2 text-sm font-semibold">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
