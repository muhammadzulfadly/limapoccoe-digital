"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LengkapiProfilPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    alamat: "",
    dusun: "",
    rt_rw: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "",
    pekerjaan: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("registration_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/lengkapi-profil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Profil berhasil disimpan!");
        router.push("/dashboard"); // arahkan sesuai tujuan selanjutnya
      } else {
        alert(result.message || "Gagal menyimpan profil.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim data.");
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
                <input
                  type="text"
                  name="dusun"
                  value={formData.dusun}
                  onChange={handleChange}
                  placeholder="Dusun"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">RT/RW</label>
                <input
                  type="text"
                  name="rt_rw"
                  value={formData.rt_rw}
                  onChange={handleChange}
                  placeholder="RT/RW"
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  placeholder="Tempat lahir"
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div>
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

            <div>
              <label className="block text-sm mb-1">Pekerjaan</label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Masukkan Pekerjaan Anda"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full border-2 border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50 transition"
              >
                Lanjutkan nanti?
              </button>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
