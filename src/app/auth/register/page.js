"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    telepon: "",
    password: "",
    konfirmasiPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.konfirmasiPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await fetch("https://402f-180-252-25-80.ngrok-free.app/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nama,
          nik: formData.nik,
          no_whatsapp: formData.telepon,
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("Content-Type");
      const text = await response.text();

      // Jika respons bukan JSON, tampilkan error
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Respons bukan JSON:\n", text);
        setError("Server tidak mengirimkan respons yang valid.");
        return;
      }

      const result = JSON.parse(text);

      if (response.ok) {
        localStorage.setItem("registration_token", result.registration_token);
        alert(result.message || "Pendaftaran berhasil!");
        router.push("/auth/verifikasiOTP");
      } else {
        setError(result.message || "Terjadi kesalahan saat mendaftar.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
                name="nama"
                value={formData.nama}
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
                name="telepon"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={13}
                value={formData.telepon}
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
                name="konfirmasiPassword"
                value={formData.konfirmasiPassword}
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
