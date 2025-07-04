"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Nik, { validateNik } from "@/components/form/Nik";
import NamaLengkap, { validateNama } from "@/components/form/NamaLengkap";
import NomorTelepon, { validateTelepon } from "@/components/form/NomorTelepon";
import KataSandi, { validatePassword } from "@/components/form/KataSandi";
import KonfirmasiSandi from "@/components/form/KonfirmasiSandi";

export default function Page() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    nik: "",
    no_whatsapp: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleFieldChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    let errorMessage = "";
    if (name === "nik") errorMessage = validateNik(value);
    else if (name === "name") errorMessage = validateNama(value);
    else if (name === "no_whatsapp") errorMessage = validateTelepon(value);
    else if (name === "password") errorMessage = validatePassword(value);
    else if (name === "password_confirmation" && value !== form.password) {
      errorMessage = "Konfirmasi password tidak cocok.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const validateAll = () => {
    const newErrors = {
      nik: validateNik(form.nik),
      name: validateNama(form.name),
      no_whatsapp: validateTelepon(form.no_whatsapp),
      password: validatePassword(form.password),
    };

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Konfirmasi Kata Sandi tidak cocok.";
    }

    // Hapus error yang kosong
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const newErrors = {};
        if (result?.errors) {
          for (const key in result.errors) {
            newErrors[key] = result.errors[key][0];
          }
        }
        newErrors.general = result?.message || "Terjadi kesalahan saat mendaftar.";
        setErrors(newErrors);
        return;
      }
      localStorage.setItem("registration_token", result.registration_token);
      localStorage.setItem("no_whatsapp", form.no_whatsapp);
      router.push("/auth/verifikasi-otp");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Gagal menghubungi server." });
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">
        ←
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">DAFTAR AKUN</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Nik value={form.nik} onChange={handleFieldChange} error={errors.nik} />
        <NamaLengkap value={form.name} onChange={handleFieldChange} error={errors.name} />
        <NomorTelepon value={form.no_whatsapp} onChange={handleFieldChange} error={errors.no_whatsapp} />
        <KataSandi value={form.password} onChange={handleFieldChange} error={errors.password} />
        <KonfirmasiSandi
          value={form.password_confirmation}
          onChange={handleFieldChange}
          error={errors.password_confirmation}
        />

        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded text-sm font-semibold mt-4">
          Daftar
        </button>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/masuk" className="text-green-600 font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
