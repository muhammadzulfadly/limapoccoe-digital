"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const FormSKTidakMampu = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const untuk = searchParams.get("untuk");

  const [showModal, setShowModal] = useState(false); // Modal state

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    pekerjaan: "",
    alamat: "",
    jenisKelamin: "",
  });

  const dataPribadi = {
    nama: "Syahran Syahputra",
    nik: "7304021234567890",
    tempatLahir: "Barru",
    tanggalLahir: "1995-08-21",
    pekerjaan: "Programmer",
    alamat: "Desa Limapoccoe",
    jenisKelamin: "Laki-laki",
  };

  useEffect(() => {
    if (untuk === "diri-sendiri") {
      setFormData(dataPribadi);
    } else {
      setFormData({
        nama: "",
        nik: "",
        tempatLahir: "",
        tanggalLahir: "",
        pekerjaan: "",
        alamat: "",
        jenisKelamin: "",
      });
    }
  }, [untuk]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    console.log("Data dikirim:", formData);
    setShowModal(true); // Tampilkan modal sukses
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
          <h1 className="text-2xl font-bold mb-6">Pembuatan Surat / SK Tidak Mampu / Buat Surat Baru</h1>

          <form className="bg-white p-6 rounded shadow-md grid grid-cols-2 gap-4 max-w-4xl mx-auto border-2 border-dashed border-blue-500">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan Nama Lengkap" className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">NIK</label>
              <input type="text" name="nik" value={formData.nik} onChange={handleChange} placeholder="Masukkan NIK" className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
              <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} placeholder="Masukkan Tempat Lahir" className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
              <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pekerjaan</label>
              <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} placeholder="Masukkan Pekerjaan" className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Masukkan Alamat" className="w-full border border-blue-400 px-3 py-2 rounded" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
              <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="w-full border border-blue-400 px-3 py-2 rounded">
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="col-span-2 flex justify-between mt-6">
              <button type="button" onClick={handleBack} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">
                Kembali
              </button>
              <button type="button" onClick={handleNext} className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded">
                Submit
              </button>
            </div>
          </form>

          {/* MODAL SUKSES */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">BERHASIL !</h2>
                <p className="mb-2">Surat anda berhasil di ajukan!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Mohon cek secara berkala status pengajuan surat.
                  <br />
                  Notifikasi akan dikirimkan melalui nomor telepon yang telah terdaftar.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    router.push("/layanan/pengajuan-surat/sk-tidak-mampu"); // arahkan ke halaman status
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded"
                >
                  Cek Status Surat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FormSKTidakMampu;
