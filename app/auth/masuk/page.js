"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nik, { validateNik } from "@/components/form/Nik";
import KataSandi, { validatePassword } from "@/components/form/KataSandi";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nik: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nik") setErrors((prev) => ({ ...prev, nik: validateNik(value) }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const validate = () => {
    const newErrors = {
      nik: form.nik.trim() === "" ? "NIK wajib diisi." : "",
      password: form.password.trim() === "" ? "Kata sandi wajib diisi." : "",
    };
    Object.keys(newErrors).forEach((k) => !newErrors[k] && delete newErrors[k]);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard");
      } else {
        setShowLoginError(true);
        setErrors({ general: result.message || "Login gagal. Cek kembali NIK dan kata sandi Anda." });
      }
    } catch {
      setShowLoginError(true);
      setErrors({ general: result.message || "Login gagal. Cek kembali NIK dan kata sandi Anda." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">
        ←
      </button>
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">MASUK</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Nik value={form.nik} onChange={handleChange} error={errors.nik} />
        <KataSandi value={form.password} onChange={handleChange} error={errors.password} />
        {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}

        <div className="text-center text-sm">
          Lupa{" "}
          <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#27AE60] hover:underline">
            Password
          </button>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#27AE60] text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-center text-sm mt-16">
        Belum punya akun?{" "}
        <Link href="/auth/daftar" className="text-[#27AE60]  hover:underline">
          Daftar
        </Link>
      </p>
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-4">Lupa Password!</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Jika Anda lupa password, silakan datang langsung ke kantor desa untuk melakukan reset password. Permintaan reset akan dibantu oleh staff desa yang bertugas. Jangan lupa membawa identitas diri untuk keperluan verifikasi.
            </p>
            <button onClick={() => setShowForgotPassword(false)} className="bg-[#27AE60] hover:bg-[#219150] text-white rounded px-6 py-2 text-sm">
              Tutup
            </button>
          </div>
        </div>
      )}

      {showLoginError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-7 py-12 w-[252px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-8">Gagal Melakukan Login</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-10">Maaf, terjadi kesalahan saat masuk. Silakan coba lagi nanti atau periksa koneksi internet Anda.</p>
            <button onClick={() => setShowLoginError(false)} className="bg-[#EB5757] hover:bg-[#c94444] text-white rounded px-6 py-2 text-sm">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
