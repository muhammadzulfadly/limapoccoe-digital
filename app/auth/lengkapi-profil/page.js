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
    alamat: "", dusun: "", rt_rw: "", tanggal_lahir: "",
    tempat_lahir: "", jenis_kelamin: "", pekerjaan: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
        localStorage.setItem("user", JSON.stringify(result.user_data));
        localStorage.setItem("profile", JSON.stringify(result.profile));
        alert(result.message || "Profil berhasil disimpan.");
        router.push("/dashboard");
      } else {
        alert(result.message || "Gagal menyimpan profil.");
      }
    } catch {
      alert("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">←</button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">PROFIL</h2>

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

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="border border-green-600 text-green-600 rounded px-6 py-2 hover:bg-green-50"
          >
            Lanjutkan nanti
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
