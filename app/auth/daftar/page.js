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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        // Error validasi (misalnya 422 Unprocessable Entity)
        if (res.status === 422 && result?.errors) {
          const newErrors = {};
          for (const key in result.errors) {
            newErrors[key] = result.errors[key][0];
          }
          setErrors(newErrors);
          return;
        }

        // Error dari server atau yang tidak diketahui
        setShowError(true);
        return;
      }

      localStorage.setItem("registration_token", result.registration_token);
      localStorage.setItem("no_whatsapp", form.no_whatsapp);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/auth/verifikasi");
      }, 1800);
    } catch (err) {
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
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">DAFTAR AKUN</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Nik value={form.nik} onChange={handleFieldChange} error={errors.nik} />
        <NamaLengkap value={form.name} onChange={handleFieldChange} error={errors.name} />
        <NomorTelepon value={form.no_whatsapp} onChange={handleFieldChange} error={errors.no_whatsapp} />
        <div className="border-y border-gray-400 my-10" />

        <KataSandi value={form.password} onChange={handleFieldChange} error={errors.password} />
        <KonfirmasiSandi value={form.password_confirmation} onChange={handleFieldChange} error={errors.password_confirmation} />

        <div className="flex justify-center">
          <button type="submit" disabled={loading} className="px-20 bg-[#27AE60] text-white py-2 rounded text-base mt-4 mb-8 disabled:opacity-50 hover:bg-green-600">
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </div>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/masuk" className="text-[#27AE60] hover:underline">
            Masuk
          </Link>
        </p>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-3">Berhasil!</h3>
            <p className="text-sm text-[#141414] leading-relaxed">Kode OTP berhasil dikirim ke nomor WhatsApp Anda. Silakan periksa pesan masuk.</p>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-8 py-8 w-[250px] text-center animate-fade-in">
            <h3 className="text-[#E74C3C] text-2xl font-bold mb-4 px-6 py-2">Daftar Akun Gagal!</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Maaf, terjadi kesalahan saat membuat akun. <br />
              Silakan coba lagi atau periksa koneksi internet Anda.
            </p>
            <button onClick={() => setShowError(false)} className="bg-[#E74C3C] hover:bg-red-600 text-white text-sm px-11 py-2 rounded">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
