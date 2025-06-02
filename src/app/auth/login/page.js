"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!nik || !password) {
      setError("NIK dan password wajib diisi.");
      return;
    }

    if (nik.length !== 16) {
      setError("NIK harus terdiri dari 16 angka.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        if (result.user.is_profile_complete) {
          router.push("/dashboard");
        } else {
          router.push("/auth/lengkapi-profil");
        }
      } else {
        setError(result.message || "Login gagal. Cek NIK dan password Anda.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
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

      {/* Kanan - Formulir Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Masuk</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">NIK</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Masukkan NIK Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password unik Anda"
                className="w-full border rounded-md p-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm mt-1 text-right text-gray-700 underline"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/auth/register" className="text-blue-700 font-medium hover:underline">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
