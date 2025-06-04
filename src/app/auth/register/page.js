"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    no_whatsapp: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const nikRegex = /^[0-9]{16}$/;
    const waRegex = /^[0-9]{11,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!nikRegex.test(formData.nik)) {
      setError("NIK harus terdiri dari 16 angka.");
      return false;
    }
    if (!waRegex.test(formData.no_whatsapp)) {
      setError("Nomor WhatsApp harus terdiri dari minimal 11 angka.");
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password harus terdiri dari minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("registration_token", result.registration_token);
        alert(result.message || "Pendaftaran berhasil!");
        router.push("/auth/verifikasiOTP");
      } else {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0][0];
          setError(firstError);
        } else {
          setError(result.message || "Terjadi kesalahan saat mendaftar.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server.");
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Kiri - Gambar & Logo */}
      <div className="w-1/2 bg-black relative hidden md:flex items-center justify-center">
        <Image
          src="/background.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="z-10 text-center text-white">
          <Image
            src="/logo-desa.png"
            alt="Logo Desa"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold">LimapoccoeDigital</h1>
        </div>
      </div>

      {/* Kanan - Formulir */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Daftar Akun
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">NIK</label>
              <input
                type="text"
                name="nik"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={16}
                value={formData.nik}
                onChange={handleChange}
                placeholder="Masukkan NIK Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                name="no_whatsapp"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={13}
                value={formData.no_whatsapp}
                onChange={handleChange}
                placeholder="Masukkan nomor WhatsApp Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password unik Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Konfirmasi Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Ulangi password Anda"
                className="w-full border rounded-md p-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm mt-1 text-right text-gray-700 underline"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"} Password
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              Daftar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a
              href="/auth/login"
              className="text-blue-700 font-medium hover:underline"
            >
              Masuk
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
