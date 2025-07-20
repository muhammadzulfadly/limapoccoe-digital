"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Dusun, { validateDusun } from "@/components/forms/Dusun";
import Huruf, { validateHuruf } from "@/components/forms/Huruf";
import RTRW, { validateRTRW } from "@/components/forms/RTRW";
import Tanggal, { validateTanggal } from "@/components/forms/Tanggal";
import JenisKelamin, { validateJenisKelamin } from "@/components/forms/JenisKelamin";

export default function LengkapiProfilPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/masuk");
    }
  }, []);

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
      alamat: validateHuruf,
      dusun: validateDusun,
      rt_rw: validateRTRW,
      tanggal_lahir: validateTanggal,
      tempat_lahir: validateHuruf,
      jenis_kelamin: validateJenisKelamin,
      pekerjaan: validateHuruf,
    };
    const validate = validators[name];
    if (validate) {
      const message = validate(value, form);
      setErrors((prev) => ({ ...prev, [name]: message }));
    }
  };

  const validateAll = () => {
    const newErrors = {
      alamat: validateHuruf(form.alamat),
      dusun: validateDusun(form.dusun),
      rt_rw: validateRTRW(form.rt_rw),
      tanggal_lahir: validateTanggal(form.tanggal_lahir),
      tempat_lahir: validateHuruf(form.tempat_lahir),
      jenis_kelamin: validateJenisKelamin(form.jenis_kelamin),
      pekerjaan: validateHuruf(form.pekerjaan),
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
      <img src="/logo.png" alt="Logo Desa" className="block mx-auto w-20 h-20 mb-4 md:hidden" />
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">LENGKAPI PROFIL</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Huruf name="alamat" value={form.alamat} onChange={handleChange} error={errors.alamat} label="Alamat" />
        <div className="flex gap-4">
          <div className="w-1/2">
            <Dusun name="dusun" value={form.dusun} onChange={handleChange} error={errors.dusun} label="Dusun" />
          </div>
          <div className="w-1/2">
            <RTRW name="rt_rw" value={form.rt_rw} onChange={handleChange} error={errors.rt_rw} />
          </div>
        </div>
        <div className="hidden md:block border-y border-gray-400 my-10" />
        <div className="flex gap-4">
          <div className="w-1/2">
            <Tanggal name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} error={errors.tanggal_lahir} label="Tanggal Lahir" />
          </div>
          <div className="w-1/2">
            <Huruf name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} error={errors.tempat_lahir} label="Tempat Lahir" />
          </div>
        </div>
        <JenisKelamin name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} error={errors.jenis_kelamin} label="Jenis Kelamin" />
        <Huruf name="pekerjaan" value={form.pekerjaan} onChange={handleChange} error={errors.pekerjaan} label="Pekerjaan" />

        <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3 mt-8 pt-2">
          <button type="button" onClick={() => router.push("/dashboard")} className="border border-[#27AE60] text-[#27AE60] rounded px-6 py-2 hover:bg-green-50 w-full md:w-auto">
            Lanjutkan nanti
          </button>

          <button type="submit" disabled={loading} className="bg-[#27AE60] text-white rounded px-14 py-2 hover:bg-green-700 disabled:opacity-50 w-full md:w-auto">
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
