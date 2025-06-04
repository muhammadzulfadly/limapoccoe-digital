"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LengkapiProfilPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    dusun: "",
    alamat: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana lokal
    const requiredFields = ["tempat_lahir", "tanggal_lahir", "jenis_kelamin", "dusun", "alamat"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Semua field wajib diisi.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile/lengkapi-profil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Profil berhasil disimpan.");
        router.push("/dashboard"); // arahkan sesuai kebutuhan
      } else {
        setError(result.error || result.message || "Gagal menyimpan profil.");
      }
    } catch (err) {
      console.error(err);
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

      {/* Kanan - Formulir */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Profile
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Alamat</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan Alamat Anda"
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Dusun</label>
                <select
                  name="dusun"
                  value={formData.dusun}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Pilih Dusun</option>
                  {[
                    "WT.Bengo",
                    "Barua",
                    "Mappasaile",
                    "Kampala",
                    "Kaluku",
                    "Jambua",
                    "Bontopanno",
                    "Samata",
                  ].map((dusun) => (
                    <option key={dusun} value={dusun}>
                      {dusun}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  placeholder="Tempat lahir"
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full border-2 border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50 transition"
              >
                Lanjutkan nanti?
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
