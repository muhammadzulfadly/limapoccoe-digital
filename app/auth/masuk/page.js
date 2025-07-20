"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NIK, { validateNIK } from "@/components/forms/NIK";
import KataSandi, { validateKataSandi } from "@/components/forms/KataSandi";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nik: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nik") setErrors((prev) => ({ ...prev, nik: validateNIK(value) }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: validateKataSandi(value) }));
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

      // Coba parse JSON, tapi jika gagal, tangani di bawah
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
          // Kredensial salah, tapi server masih OK
          setErrors({ general: "NIK atau Kata Sandi Anda tidak valid." });
        } else {
          // Error lain (500, dsb)
          setShowLoginError(true);
        }
        return;
      }
      // Sukses login
      if (result?.access_token && result?.user) {
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 jam dari sekarang
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("expiresAt", expiresAt.toString());
        router.push("/dashboard");
      } else {
        // Jika respons 200 tapi tidak lengkap
        setShowLoginError(true);
      }
    } catch (err) {
      // Server tidak bisa dihubungi / fetch error
      setShowLoginError(true);
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
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">MASUK</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <NIK name="nik" value={form.nik} onChange={handleChange} error={errors.nik} label="NIK" />
        <KataSandi name="password" value={form.password} onChange={handleChange} error={errors.password} label="Kata Sandi" />
        {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}

        <div className="text-center text-sm">
          Lupa{" "}
          <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#27AE60] hover:underline">
            Kata Sandi
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
            <h3 className="text-[#27AE60] text-2xl font-bold mb-4">Lupa Kata Sandi!</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Jika Anda lupa kata sandi, silakan datang langsung ke kantor desa untuk melakukan reset kata sandi. Permintaan reset akan dibantu oleh staff desa yang bertugas. Jangan lupa membawa identitas diri untuk keperluan verifikasi.
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
