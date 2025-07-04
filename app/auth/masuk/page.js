"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nik, { validateNik } from "@/components/form/Nik";
import KataSandi from "@/components/form/KataSandi";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nik: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nik") setErrors((prev) => ({ ...prev, nik: validateNik(value) }));
    if (name === "password" && value.trim() !== "") setErrors((prev) => ({ ...prev, password: "" }));
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
        setErrors({ general: "NIK atau Kata Sandi Anda salah" });
      }
    } catch {
      setErrors({ general: "Gagal menghubungi server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">←</button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">MASUK</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Nik value={form.nik} onChange={handleChange} error={errors.nik} />
        <KataSandi value={form.password} onChange={handleChange} error={errors.password} />
        {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}

        <div className="text-center text-sm">
          Lupa <Link href="#" className="text-green-600 font-semibold hover:underline">Password</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Belum punya akun?{' '}
        <Link href="/auth/daftar" className="text-green-600 font-semibold hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
